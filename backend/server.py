from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Basic Auth for admin panel
security = HTTPBasic()

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "admin")
    correct_password = secrets.compare_digest(credentials.password, "admin123")
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    return credentials.username

# Pydantic Models
class Place(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: str  # kremlin, museum, nature, architecture, city, etc.
    latitude: float
    longitude: float
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PlaceCreate(BaseModel):
    name: str
    description: str
    category: str
    latitude: float
    longitude: float
    image_url: Optional[str] = None

class HistoryEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    year: int
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HistoryEventCreate(BaseModel):
    title: str
    description: str
    year: int
    image_url: Optional[str] = None

class CultureItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # craft, cuisine, festival, tradition
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CultureItemCreate(BaseModel):
    title: str
    description: str
    category: str
    image_url: Optional[str] = None

class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: str  # ISO date string
    location: str
    category: str  # festival, exhibition, concert, etc.
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    location: str
    category: str

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str

# Helper functions for MongoDB serialization
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

# Places endpoints
@api_router.get("/places", response_model=List[Place])
async def get_places():
    places = await db.places.find().to_list(length=None)
    return [Place(**place) for place in places]

@api_router.post("/places", response_model=Place)
async def create_place(place_data: PlaceCreate, admin: str = Depends(verify_admin)):
    place = Place(**place_data.dict())
    place_dict = prepare_for_mongo(place.dict())
    await db.places.insert_one(place_dict)
    return place

@api_router.delete("/places/{place_id}")
async def delete_place(place_id: str, admin: str = Depends(verify_admin)):
    result = await db.places.delete_one({"id": place_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Place not found")
    return {"message": "Place deleted successfully"}

# History endpoints
@api_router.get("/history", response_model=List[HistoryEvent])
async def get_history():
    events = await db.history_events.find().sort("year", 1).to_list(length=None)
    return [HistoryEvent(**event) for event in events]

@api_router.post("/history", response_model=HistoryEvent)
async def create_history_event(event_data: HistoryEventCreate, admin: str = Depends(verify_admin)):
    event = HistoryEvent(**event_data.dict())
    event_dict = prepare_for_mongo(event.dict())
    await db.history_events.insert_one(event_dict)
    return event

# Culture endpoints
@api_router.get("/culture", response_model=List[CultureItem])
async def get_culture():
    items = await db.culture_items.find().to_list(length=None)
    return [CultureItem(**item) for item in items]

@api_router.post("/culture", response_model=CultureItem)
async def create_culture_item(item_data: CultureItemCreate, admin: str = Depends(verify_admin)):
    item = CultureItem(**item_data.dict())
    item_dict = prepare_for_mongo(item.dict())
    await db.culture_items.insert_one(item_dict)
    return item

# Events endpoints
@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find().sort("date", 1).to_list(length=None)
    return [Event(**event) for event in events]

@api_router.post("/events", response_model=Event)
async def create_event(event_data: EventCreate, admin: str = Depends(verify_admin)):
    event = Event(**event_data.dict())
    event_dict = prepare_for_mongo(event.dict())
    await db.events.insert_one(event_dict)
    return event

# Contact endpoints
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message_data: ContactMessageCreate):
    message = ContactMessage(**message_data.dict())
    message_dict = prepare_for_mongo(message.dict())
    await db.contact_messages.insert_one(message_dict)
    return message

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages(admin: str = Depends(verify_admin)):
    messages = await db.contact_messages.find().sort("created_at", -1).to_list(length=None)
    return [ContactMessage(**message) for message in messages]

# Clear all data endpoint
@api_router.post("/clear-data")
async def clear_all_data(admin: str = Depends(verify_admin)):
    await db.places.delete_many({})
    await db.history_events.delete_many({})
    await db.culture_items.delete_many({})
    await db.events.delete_many({})
    return {"message": "All data cleared successfully"}

# Initialize updated sample data endpoint
@api_router.post("/init-data")
async def init_sample_data(admin: str = Depends(verify_admin)):
    # Clear existing data first
    await db.places.delete_many({})
    await db.history_events.delete_many({})
    await db.culture_items.delete_many({})
    await db.events.delete_many({})
    
    # Updated places data with accurate information
    sample_places = [
        {
            "name": "Нижегородский кремль",
            "description": "Историческая крепость XVI века с 12 сохранившимися башнями, построенная под руководством итальянского инженера Петра Фрязина. Важнейший символ города и центр культурной жизни.",
            "category": "kremlin",
            "latitude": 56.3287,
            "longitude": 44.0020
        },
        {
            "name": "Волжская набережная",
            "description": "Живописная набережная вдоль великой реки Волги с панорамными видами и историческими памятниками. Одно из любимых мест отдыха жителей и гостей города.",
            "category": "nature",
            "latitude": 56.3240,
            "longitude": 43.9776
        },
        {
            "name": "Чкаловская лестница",
            "description": "Монументальная лестница от Волги к памятнику В.П. Чкалову, состоящая из 560 ступеней. Символ города и популярное место для фотосессий.",
            "category": "architecture",
            "latitude": 56.3226,
            "longitude": 43.9853
        },
        {
            "name": "Усадьба Рукавишниковых",
            "description": "Главное здание Нижегородского государственного художественного музея, выдающийся памятник дворянской архитектуры XIX века.",
            "category": "museum",
            "latitude": 56.3269,
            "longitude": 44.0051
        },
        {
            "name": "Большая Покровская улица",
            "description": "Главная пешеходная улица города с уникальной архитектурой, многочисленными скульптурами и историческими зданиями.",
            "category": "architecture",
            "latitude": 56.3264,
            "longitude": 44.0075
        },
        {
            "name": "Городец",
            "description": "Древнейший город области, центр городецкой росписи и народных промыслов. Музей под открытым небом с богатой культурной программой.",
            "category": "city",
            "latitude": 56.6431,
            "longitude": 43.4707
        },
        {
            "name": "Озеро Светлояр",
            "description": "Легендарное озеро, окутанное преданиями и мифами. Популярное место паломничества, где, по преданию, находится невидимый град Китеж.",
            "category": "nature",
            "latitude": 57.1667,
            "longitude": 45.0833
        },
        {
            "name": "Семёнов",
            "description": "Столица русской матрёшки и центр народных художественных промыслов. Здесь создаются знаменитые семёновские матрёшки.",
            "category": "city",
            "latitude": 56.7833,
            "longitude": 44.5000
        }
    ]
    
    for place_data in sample_places:
        place = Place(**place_data)
        place_dict = prepare_for_mongo(place.dict())
        await db.places.insert_one(place_dict)
    
    # Updated historical events with accurate data
    sample_history = [
        {
            "title": "Основание Нижнего Новгорода",
            "description": "Город был основан великим князем владимирским Юрием Всеволодовичем как крепость для защиты русских земель от набегов волжских булгар и мордвы.",
            "year": 1221
        },
        {
            "title": "Строительство каменного кремля",
            "description": "Началось возведение каменной крепости под руководством итальянского инженера Петра Фрязина для усиления обороноспособности города.",
            "year": 1500
        },
        {
            "title": "Перенос Макарьевской ярмарки",
            "description": "Знаменитая ярмарка была перенесена в Нижний Новгород, превратив город в крупнейший торговый центр России - 'Карман России'.",
            "year": 1817
        },
        {
            "title": "Строительство Транссибирской магистрали",
            "description": "Через город прошла железнодорожная магистраль, соединившая европейскую часть России с Сибирью и значительно усилившая экономическое значение региона.",
            "year": 1896
        },
        {
            "title": "Открытие Горьковского автозавода (ГАЗ)",
            "description": "Начал работу крупнейший автомобильный завод СССР, коренным образом изменивший промышленный облик города и региона.",
            "year": 1932
        }
    ]
    
    for event_data in sample_history:
        event = HistoryEvent(**event_data)
        event_dict = prepare_for_mongo(event.dict())
        await db.history_events.insert_one(event_dict)
    
    # Updated culture items with accurate information about folk crafts
    sample_culture = [
        {
            "title": "Хохломская роспись",
            "description": "Традиционная роспись по дереву, возникшая в XVII веке в деревне Хохлома. Характеризуется яркими цветочными, ягодными и птичьими узорами на чёрном или золотом фоне с уникальным лаковым покрытием.",
            "category": "craft"
        },
        {
            "title": "Городецкая роспись",
            "description": "Самобытный вид росписи по дереву с богатой палитрой и характерными сюжетами. Городец является центром этого промысла и настоящим музеем народного творчества.",
            "category": "craft"
        },
        {
            "title": "Семёновская матрёшка",
            "description": "Знаменитая деревянная расписная кукла, ставшая символом русской народной культуры. Семёнов - признанная столица матрёшечного промысла.",
            "category": "craft"
        },
        {
            "title": "Павловские замки и ножи",
            "description": "Традиционное металлообрабатывающее ремесло города Павлово, известное производством высококачественных замков, ножей и инструментов.",
            "category": "craft"
        },
        {
            "title": "Старообрядческие традиции",
            "description": "Нижегородская область является одним из центров русского старообрядчества, сохраняющего древние церковные традиции и культурное наследие.",
            "category": "tradition"
        },
        {
            "title": "Керженские леса",
            "description": "Уникальная природная территория с богатейшей флорой и фауной, место традиционных промыслов и экологического туризма.",
            "category": "nature"
        }
    ]
    
    for item_data in sample_culture:
        item = CultureItem(**item_data)
        item_dict = prepare_for_mongo(item.dict())
        await db.culture_items.insert_one(item_dict)
    
    return {"message": "Updated sample data initialized successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()