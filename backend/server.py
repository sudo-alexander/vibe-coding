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
    year: str  # Changed to string to support year ranges like "1941-1945"
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HistoryEventCreate(BaseModel):
    title: str
    description: str
    year: str
    image_url: Optional[str] = None

class CultureItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # craft, cuisine, festival, tradition, nature
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CultureItemCreate(BaseModel):
    title: str
    description: str
    category: str
    image_url: Optional[str] = None

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
    events = await db.history_events.find().to_list(length=None)
    # Sort by year, handling string years
    def sort_key(event):
        year_str = event.get('year', '0')
        # Extract first year from ranges like "1941-1945"
        first_year = year_str.split('-')[0]
        try:
            return int(first_year)
        except ValueError:
            return 0
    
    sorted_events = sorted(events, key=sort_key)
    return [HistoryEvent(**event) for event in sorted_events]

@api_router.post("/history", response_model=HistoryEvent)
async def create_history_event(event_data: HistoryEventCreate, admin: str = Depends(verify_admin)):
    event = HistoryEvent(**event_data.dict())
    event_dict = prepare_for_mongo(event.dict())
    await db.history_events.insert_one(event_dict)
    return event

# Culture endpoints (now combined with attractions)
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
    return {"message": "All data cleared successfully"}

# Initialize updated sample data endpoint
@api_router.post("/init-data")
async def init_sample_data(admin: str = Depends(verify_admin)):
    # Clear existing data first
    await db.places.delete_many({})
    await db.history_events.delete_many({})
    await db.culture_items.delete_many({})
    
    # Updated places data with all new cities and attractions
    sample_places = [
        # Нижний Новгород
        {
            "name": "Нижегородский кремль",
            "description": "Центральная крепость города с башнями, стенами и историческими залами; один из символов Нижнего Новгорода.",
            "category": "kremlin",
            "latitude": 56.3287,
            "longitude": 44.0020,
            "image_url": "https://customer-assets.emergentagent.com/job_nizhny-guide/artifacts/5sp4c3ls_%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.png"
        },
        {
            "name": "Чкаловская лестница",
            "description": "Популярные прогулочные зоны с видами на реку и город. Набережные Оки и Волги создают неповторимую атмосферу.",
            "category": "architecture",
            "latitude": 56.3226,
            "longitude": 43.9853
        },
        {
            "name": "Большая Покровская улица",
            "description": "Старый центр с улицами Большая Покровская, Рождественская, древние гильдейские и купеческие дома создают историческую атмосферу.",
            "category": "architecture",
            "latitude": 56.3264,
            "longitude": 44.0075
        },
        {
            "name": "Музей истории художественных промыслов",
            "description": "Городской исторический музей, художественные галереи, музей народных промыслов — позволяют глубже узнать прошлое города.",
            "category": "museum",
            "latitude": 56.3269,
            "longitude": 44.0051
        },
        
        # Дивеево
        {
            "name": "Свято-Троицкий Серафимо-Дивеевский монастырь",
            "description": "Один из крупнейших православных паломнических центров России. В Троицком соборе монастыря покоятся мощи преподобного Серафима Саровского.",
            "category": "monastery",
            "latitude": 55.0442,
            "longitude": 43.2394,
            "image_url": "https://customer-assets.emergentagent.com/job_nizhny-guide/artifacts/3c3ycajs_%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.png"
        },
        {
            "name": "Святая Канавка",
            "description": "Особый ритуальный путь, который обходит вокруг обители, символически замыкая «удел Богородицы».",
            "category": "monastery",
            "latitude": 55.0445,
            "longitude": 43.2390
        },
        
        # Городец
        {
            "name": "Городец - центр народных промыслов",
            "description": "Известен как один из центров городецкой росписи, с множеством мастерских и музеев народного творчества.",
            "category": "city",
            "latitude": 56.6431,
            "longitude": 43.4707
        },
        
        # Арзамас
        {
            "name": "Воскресенский собор в Арзамасе",
            "description": "Крупная доминанта города, возведённая в классическом стиле. Дом Ханыкова — образец деревянного классицизма.",
            "category": "architecture",
            "latitude": 55.3944,
            "longitude": 43.8406
        },
        {
            "name": "Пустынские озёра",
            "description": "Природная зона отдыха вокруг Арзамаса с живописными водными пейзажами.",
            "category": "nature",
            "latitude": 55.4000,
            "longitude": 43.8500
        },
        
        # Семёнов
        {
            "name": "Музей «Золотая Хохлома»",
            "description": "Центр художественных промыслов, демонстрирует технологии создания знаменитой хохломской росписи и народные промыслы.",
            "category": "museum",
            "latitude": 56.7833,
            "longitude": 44.5000
        },
        
        # Выкса
        {
            "name": "Дом Баташевых в Выксе",
            "description": "Усадьба семьи промышленников, связанная с историей металлургического завода. Шуховская водонапорная башня — символ инженерной истории.",
            "category": "architecture",
            "latitude": 55.3167,
            "longitude": 42.1833
        },
        
        # Павлово
        {
            "name": "Павловский музей ножей и замков",
            "description": "Город мастеров металлопродукции. Музей представляет образцы металлического искусства местных кустарных промыслов.",
            "category": "museum",
            "latitude": 55.9667,
            "longitude": 43.0833
        },
        {
            "name": "Парк «Дальняя Круча»",
            "description": "Один из старейших ландшафтных парков Павлова с аллеями, клумбами, прогулочными дорожками вдоль Оки.",
            "category": "nature",
            "latitude": 55.9650,
            "longitude": 43.0800
        },
        
        # Балахна
        {
            "name": "Никольская церковь в Балахне",
            "description": "Старинный город на Волге с сохранившимися памятниками церковного зодчества XVII–XIX веков.",
            "category": "architecture",
            "latitude": 56.5000,
            "longitude": 43.6000
        },
        
        # Сергач
        {
            "name": "Сергачский краеведческий музей",
            "description": "Знакомит с историей региона, народными промыслами и природой. Сохранились купеческие дома XIX–XX веков.",
            "category": "museum",
            "latitude": 55.5333,
            "longitude": 45.4667
        }
    ]
    
    for place_data in sample_places:
        place = Place(**place_data)
        place_dict = prepare_for_mongo(place.dict())
        await db.places.insert_one(place_dict)
    
    # Updated historical events with corrected dates
    sample_history = [
        {
            "title": "Основание Нижнего Новгорода",
            "description": "Князь Юрий Всеволодович заложил город у слияния рек Оки и Волги. Нижний Новгород стал важным оборонительным пунктом и торговым центром на восточных границах Руси.",
            "year": "1221"
        },
        {
            "title": "Монголо-татарское нашествие",
            "description": "Город подвергся разорению во время похода Батыя на северо-восточные земли Руси. После разрушения Нижний Новгород пришлось восстанавливать почти с нуля.",
            "year": "1238"
        },
        {
            "title": "Образование Нижегородско-Суздальского княжества",
            "description": "Нижний Новгород стал центром самостоятельного княжества. Это усилило его политическую и экономическую роль в Северо-Восточной Руси.",
            "year": "1341"
        },
        {
            "title": "Присоединение к Московскому княжеству",
            "description": "Московский князь Василий I включил Нижний Новгород в состав своих владений. Это стало важным шагом в объединении русских земель вокруг Москвы.",
            "year": "1392"
        },
        {
            "title": "Начало строительства каменного кремля",
            "description": "На месте старых деревянных укреплений началось возведение каменного кремля. Он стал мощной оборонительной крепостью, символом власти и сердцем города.",
            "year": "1508"
        },
        {
            "title": "Народное ополчение Минина и Пожарского",
            "description": "Именно в Нижнем Новгороде начался сбор второго народного ополчения против польско-литовских интервентов. Этот подвиг стал одним из ключевых событий Смутного времени.",
            "year": "1611"
        },
        {
            "title": "Учреждение Макарьевской ярмарки",
            "description": "У стен Макарьевского монастыря была официально открыта ярмарка. Она быстро стала одним из важнейших торговых центров России XVII века.",
            "year": "1641"
        },
        {
            "title": "Пожар и перенос ярмарки в Нижний Новгород",
            "description": "После пожара в Макарьеве ярмарку перенесли в Нижний Новгород. Здесь она стала крупнейшим торговым событием страны и дала мощный импульс развитию города.",
            "year": "1816"
        },
        {
            "title": "Строительство дома губернатора",
            "description": "В кремле возводится дом губернатора — главный административный центр губернии. Здание стало архитектурной доминантой и местом пребывания высших чиновников.",
            "year": "1838"
        },
        {
            "title": "Строительство католического храма Успения Девы Марии",
            "description": "В городе появился первый католический храм, ставший духовным центром для польской и литовской общин. Его архитектура выделяется среди построек того времени.",
            "year": "1861"
        },
        {
            "title": "Всероссийская художественно-промышленная выставка",
            "description": "В Нижнем Новгороде прошла грандиозная выставка, продемонстрировавшая достижения промышленности и искусства. Город укрепил репутацию важного культурно-промышленного центра.",
            "year": "1896"
        },
        {
            "title": "Сормовские рабочие выступления",
            "description": "Рабочие Сормовского завода участвовали в восстаниях в поддержку общероссийской революции. Это стало первым масштабным проявлением рабочего движения в регионе.",
            "year": "1905"
        },
        {
            "title": "Февральская и Октябрьская революции",
            "description": "После свержения монархии в городе установилось двоевластие — Советы и Временное правительство. Осенью власть перешла к большевикам, началась новая эпоха.",
            "year": "1917"
        },
        {
            "title": "Гражданская война и становление советской власти",
            "description": "В годы гражданской войны в регионе происходили бои и мобилизации. Нижний Новгород стал важным центром снабжения и политического контроля большевиков.",
            "year": "1918"
        },
        {
            "title": "Образование Нижегородской области",
            "description": "Создана Нижегородская область в составе РСФСР. Это событие заложило основу современной административной структуры региона.",
            "year": "1929"
        },
        {
            "title": "Переименование города в Горький",
            "description": "В честь писателя Максима Горького город получил новое имя — Горький. Это отражало идеологическую политику СССР по увековечению деятелей культуры.",
            "year": "1932"
        },
        {
            "title": "Великая Отечественная война",
            "description": "Горьковская область стала одним из главных промышленных центров страны. Здесь производили танки, самолёты, вооружение. Более 800 тысяч жителей ушли на фронт, тысячи трудились в тылу на заводах и в госпиталях. Несмотря на бомбардировки и трудности, город выстоял и внёс огромный вклад в Победу.",
            "year": "1941-1945"
        },
        {
            "title": "Послевоенное развитие и рост города",
            "description": "В 1950-е годы началась масштабная застройка новых районов и промышленных зон. После войны началось восстановление промышленности и инфраструктуры. Город превратился в крупный научно-производственный и культурный центр СССР.",
            "year": "1950-е"
        },
        {
            "title": "Возвращение имени «Нижний Новгород»",
            "description": "После десятилетий под названием «Горький» городу и области вернули исторические имена. Это символизировало восстановление исторической преемственности и культурного наследия.",
            "year": "1990"
        },
        {
            "title": "Чемпионат мира по футболу",
            "description": "Нижний Новгород стал одним из городов-хозяев ЧМ-2018. Был построен современный стадион, обновлены набережные и дороги. Турнир дал мощный толчок развитию туризма и городской инфраструктуры.",
            "year": "2018"
        },
        {
            "title": "Празднование 800-летия Нижнего Новгорода",
            "description": "Город отметил юбилей масштабными культурными и общественными проектами. Были восстановлены исторические здания, благоустроены улицы и набережные, проведены десятки фестивалей и выставок.",
            "year": "2021"
        }
    ]
    
    for event_data in sample_history:
        event = HistoryEvent(**event_data)
        event_dict = prepare_for_mongo(event.dict())
        await db.history_events.insert_one(event_dict)
    
    # Updated culture items combined with nature attractions
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
            "title": "Керженский заповедник",
            "description": "Уникальная природная территория с богатейшей флорой и фауной, место традиционных промыслов и экологического туризма. Густые леса и уникальные природные комплексы.",
            "category": "nature"
        }
    ]
    
    for item_data in sample_culture:
        item = CultureItem(**item_data)
        item_dict = prepare_for_mongo(item.dict())
        await db.culture_items.insert_one(item_dict)
    
    return {"message": "Updated sample data with new cities and attractions initialized successfully"}

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