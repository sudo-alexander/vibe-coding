import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Map Component using OpenStreetMap with dark theme
const InteractiveMap = ({ places, selectedPlace, onPlaceSelect }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && document.getElementById('map')) {
      const map = window.L.map('map').setView([56.3287, 44.0020], 10);
      
      // Dark theme tiles
      window.L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom orange marker icon
      const orangeIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: '<div class="marker-pin" style="background-color: #ff6b35; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; position: relative; transform: rotate(-45deg); border: 2px solid #ff8c42;"><div style="width: 10px; height: 10px; background-color: #ffffff; border-radius: 50%; position: absolute; top: 8px; left: 8px; transform: rotate(45deg);"></div></div>',
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      });

      places.forEach(place => {
        const marker = window.L.marker([place.latitude, place.longitude], { icon: orangeIcon })
          .addTo(map)
          .bindPopup(`<div style="color: #1a1a1a;"><b>${place.name}</b><br/>${place.description}</div>`)
          .on('click', () => onPlaceSelect(place));
        
        if (selectedPlace && selectedPlace.id === place.id) {
          marker.openPopup();
        }
      });

      return () => {
        map.remove();
      };
    }
  }, [places, selectedPlace, onPlaceSelect]);

  return <div id="map" className="w-full h-96 rounded-lg shadow-2xl border border-orange-500/20"></div>;
};

// Navigation Component with dark theme (removed Events)
const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { path: "/", label: "Главная", icon: "🏠" },
    { path: "/history", label: "История", icon: "📚" },
    { path: "/attractions", label: "Достопримечательности", icon: "🏛️" },
    { path: "/contacts", label: "Контакты", icon: "📧" },
    { path: "/admin", label: "Админ", icon: "⚙️" }
  ];

  return (
    <nav className="bg-gray-900 border-b border-orange-500/20 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-xl">НО</span>
              </div>
              <span className="text-white font-bold text-xl">Нижегородская область</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  location.pathname === item.path
                    ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/25'
                    : 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400 border border-transparent hover:border-orange-500/20'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-orange-400 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-orange-500/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-orange-500 text-black'
                      : 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-400'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Home Page with dark theme
const HomePage = () => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`${API}/places`);
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section with dark theme */}
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5"></div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 text-center">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 bg-clip-text text-transparent animate-fade-in">
            Нижегородская область
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl mb-12 max-w-4xl mx-auto text-gray-300 leading-relaxed animate-fade-in-delay">
            Откройте богатейшую историю древнего края, где река Волга встречается с Окой. 
            Погрузитесь в мир легендарных народных промыслов - хохломской и городецкой росписи, 
            семёновских матрёшек. Исследуйте величественный Нижегородский кремль XVI века, 
            прогуляйтесь по историческим городам и насладитесь природными красотами Поволжья.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/attractions" 
                  className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/25">
              <span className="flex items-center justify-center">
                🗺️ Исследовать достопримечательности
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
            <Link to="/history" 
                  className="group border-2 border-orange-500 hover:bg-orange-500/10 text-orange-400 hover:text-orange-300 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center justify-center">
                📜 Узнать историю
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Интерактивная карта региона
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            Исследуйте знаменитые места Нижегородской области на интерактивной карте. 
            Нажимайте на оранжевые маркеры, чтобы узнать подробности о исторических памятниках, 
            городах народных промыслов и природных достопримечательностях.
          </p>
        </div>
        
        <InteractiveMap 
          places={places} 
          selectedPlace={selectedPlace} 
          onPlaceSelect={setSelectedPlace} 
        />
        
        {selectedPlace && (
          <div className="mt-8 p-8 bg-gray-800/50 rounded-xl shadow-2xl border border-orange-500/20 backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-4 text-orange-400">{selectedPlace.name}</h3>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">{selectedPlace.description}</p>
            {selectedPlace.image_url && (
              <img 
                src={selectedPlace.image_url} 
                alt={selectedPlace.name}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-4"
              />
            )}
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                {selectedPlace.category === 'kremlin' ? 'Кремль' :
                 selectedPlace.category === 'museum' ? 'Музей' :
                 selectedPlace.category === 'nature' ? 'Природа' :
                 selectedPlace.category === 'architecture' ? 'Архитектура' :
                 selectedPlace.category === 'monastery' ? 'Монастырь' :
                 selectedPlace.category === 'city' ? 'Город' : selectedPlace.category}
              </span>
              <span className="text-gray-500 text-sm">
                📍 {selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-900/50 py-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Сокровища Нижегородской области
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-gray-800/30 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🏰</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-400">Историческое наследие</h3>
              <p className="text-gray-400 leading-relaxed">
                800-летняя история региона воплощена в величественном Нижегородском кремле XVI века, 
                древних городах и архитектурных памятниках разных эпох
              </p>
            </div>
            
            <div className="group text-center p-8 bg-gray-800/30 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🎨</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-400">Народные промыслы</h3>
              <p className="text-gray-400 leading-relaxed">
                Мировая слава хохломской росписи, городецких узоров и семёновских матрёшек. 
                Живые традиции мастерства, передающиеся из поколения в поколение
              </p>
            </div>
            
            <div className="group text-center p-8 bg-gray-800/30 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🌊</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-400">Природные сокровища</h3>
              <p className="text-gray-400 leading-relaxed">
                Слияние великих рек Волги и Оки, загадочное озеро Светлояр, 
                девственные леса Керженского заповедника и уникальные ландшафты Поволжья
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// History Page with animated timeline cards
const HistoryPage = () => {
  const [historyEvents, setHistoryEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    // Animate cards appearing one by one
    historyEvents.forEach((event, index) => {
      setTimeout(() => {
        setVisibleEvents(prev => [...prev, event]);
      }, index * 200);
    });
  }, [historyEvents]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API}/history`);
      setHistoryEvents(response.data);
      setVisibleEvents([]); // Reset visible events
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent animate-fade-in">
            История Нижегородской области
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            От основания в 1221 году до современности - восемь веков богатейшей истории русского края
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-orange-400 to-orange-500 rounded-full"></div>
          
          {historyEvents.map((event, index) => {
            const isVisible = visibleEvents.some(ve => ve.id === event.id);
            return (
              <div 
                key={event.id} 
                className={`relative mb-12 ml-16 transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 transform translate-x-0' 
                    : 'opacity-0 transform translate-x-8'
                }`}
              >
                <div className="absolute -left-11 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-4 border-gray-900 shadow-xl flex items-center justify-center animate-pulse-slow">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="group bg-gray-800/40 p-8 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-[1.02] backdrop-blur-sm animate-slide-up">
                  <div className="flex items-center mb-4">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {event.year}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-orange-400 group-hover:text-orange-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Combined Attractions Page (includes culture and attractions)
const AttractionsPage = () => {
  const [places, setPlaces] = useState([]);
  const [cultureItems, setCultureItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPlaces();
    fetchCulture();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`${API}/places`);
      setPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const fetchCulture = async () => {
    try {
      const response = await axios.get(`${API}/culture`);
      setCultureItems(response.data);
    } catch (error) {
      console.error('Error fetching culture items:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'Все категории', icon: '🗺️' },
    { value: 'places', label: 'Места', icon: '🏛️' },
    { value: 'culture', label: 'Культура и традиции', icon: '🎨' }
  ];

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return [...places.map(p => ({...p, type: 'place'})), ...cultureItems.map(c => ({...c, type: 'culture'}))];
    } else if (selectedCategory === 'places') {
      return places.map(p => ({...p, type: 'place'}));
    } else if (selectedCategory === 'culture') {
      return cultureItems.map(c => ({...c, type: 'culture'}));
    }
    return [];
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Достопримечательности, культура и традиции
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Откройте знаменитые места, народные промыслы и культурное наследие Нижегородской области
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black shadow-xl transform scale-105'
                  : 'bg-gray-800/50 text-gray-300 border border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="group bg-gray-800/40 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm overflow-hidden">
              {item.image_url && (
                <div className="h-48 overflow-hidden rounded-t-2xl">
                  <img 
                    src={item.image_url} 
                    alt={item.name || item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    {item.type === 'place' 
                      ? (item.category === 'kremlin' ? 'Кремль' :
                         item.category === 'museum' ? 'Музей' :
                         item.category === 'nature' ? 'Природа' :
                         item.category === 'architecture' ? 'Архитектура' :
                         item.category === 'monastery' ? 'Монастырь' :
                         item.category === 'city' ? 'Город' : item.category)
                      : (item.category === 'craft' ? 'Ремесло' :
                         item.category === 'tradition' ? 'Традиция' :
                         item.category === 'nature' ? 'Природа' : item.category)
                    }
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-orange-400 group-hover:text-orange-300 transition-colors">
                  {item.name || item.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{item.description}</p>
                {item.latitude && item.longitude && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="mr-2">📍</span>
                    {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">Элементы в данной категории будут добавлены в ближайшее время.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Contact Page with dark theme
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitMessage('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitMessage('Произошла ошибка при отправке сообщения. Попробуйте еще раз.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Контакты
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Свяжитесь с нами для получения туристической информации о Нижегородской области
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800/40 rounded-2xl border border-orange-500/20 backdrop-blur-sm p-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-400">Свяжитесь с нами</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-3">
                  Имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-orange-500/20 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 text-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-orange-500/20 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 text-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-3">
                  Сообщение *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-orange-500/20 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 text-white transition-all duration-200 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>
            
            {submitMessage && (
              <div className={`mt-6 p-4 rounded-lg ${
                submitMessage.includes('Спасибо') 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {submitMessage}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800/40 rounded-2xl border border-orange-500/20 backdrop-blur-sm p-8">
            <h2 className="text-3xl font-bold mb-6 text-orange-400">Туристическая информация</h2>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-300 mb-2">Административный центр:</h3>
                  <p className="text-gray-400">
                    г. Нижний Новгород<br />
                    Нижегородская область<br />
                    Российская Федерация
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-xl">🕒</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-300 mb-2">Туристические центры:</h3>
                  <p className="text-gray-400">
                    Пн-Пт: 9:00 - 18:00<br />
                    Сб-Вс: 10:00 - 16:00<br />
                    Музеи работают по собственному расписанию
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-300 mb-2">Основные направления:</h3>
                  <p className="text-gray-400">
                    • Культурно-исторический туризм<br />
                    • Экскурсии по народным промыслам<br />
                    • Речные круизы по Волге<br />
                    • Экологический туризм
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Page with dark theme
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isInitializing, setIsInitializing] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Неверные учетные данные');
    }
  };

  const initializeData = async () => {
    setIsInitializing(true);
    try {
      const auth = btoa('admin:admin123');
      await axios.post(`${API}/init-data`, {}, {
        headers: { 'Authorization': `Basic ${auth}` }
      });
      alert('Обновлённые данные с новыми городами успешно загружены!');
    } catch (error) {
      console.error('Error initializing data:', error);
      alert('Ошибка при инициализации данных');
    }
    setIsInitializing(false);
  };

  const clearData = async () => {
    if (window.confirm('Вы уверены, что хотите очистить все данные?')) {
      try {
        const auth = btoa('admin:admin123');
        await axios.post(`${API}/clear-data`, {}, {
          headers: { 'Authorization': `Basic ${auth}` }
        });
        alert('Все данные очищены!');
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Ошибка при очистке данных');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
        <div className="bg-gray-800/40 backdrop-blur-sm p-10 rounded-2xl border border-orange-500/20 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-orange-400">Админ панель</h1>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-3">
                Имя пользователя
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900/50 border border-orange-500/20 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 text-white transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-3">
                Пароль
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900/50 border border-orange-500/20 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 text-white transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Войти
            </button>
          </form>
          
          <p className="text-sm text-gray-500 text-center mt-6">
            По умолчанию: admin / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-orange-400 mb-2">Панель администратора</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 px-6 py-3 rounded-lg transition-all duration-200"
          >
            Выйти
          </button>
        </div>

        <div className="grid gap-8">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-8">
            <h2 className="text-2xl font-bold text-orange-400 mb-6">Управление данными</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Инициализация данных</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Загрузить обновлённые данные с исправленными датами истории (ВОВ 1941-1945, восстановление 1950-е) 
                  и новыми городами: Дивеево, Городец, Арзамас, Семёнов, Выкса, Павлово, Балахна, Сергач.
                </p>
                <button
                  onClick={initializeData}
                  disabled={isInitializing}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50"
                >
                  {isInitializing ? 'Загрузка...' : 'Обновить данные'}
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Очистка данных</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Удалить все существующие данные из базы. Используйте эту функцию 
                  с осторожностью - действие необратимо.
                </p>
                <button
                  onClick={clearData}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Очистить все данные
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-8">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Последние обновления</h2>
            <div className="text-gray-300 space-y-2">
              <p>✅ Исправлены даты: ВОВ 1941-1945, послевоенное развитие 1950-е</p>
              <p>✅ Убран раздел "События и маршруты"</p>
              <p>✅ Объединены "Культура" и "Достопримечательности"</p>
              <p>✅ Добавлены новые города с фотографиями</p>
              <p>✅ Красивые анимации развертывания плашек истории</p>
              <p>✅ Интерактивная карта с тёмной темой</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  useEffect(() => {
    // Load Leaflet CSS and JS for dark theme map
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/contacts" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;