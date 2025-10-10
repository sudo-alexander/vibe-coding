import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Map Component using OpenStreetMap with dark theme
const InteractiveMap = ({ cities, selectedCity, onCitySelect }) => {
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

      // Add approximate coordinates for cities
      const cityCoordinates = {
        "Нижний Новгород": [56.3287, 44.0020],
        "Дивеево": [55.0442, 43.2394],
        "Городец": [56.6431, 43.4707],
        "Арзамас": [55.3944, 43.8406],
        "Семёнов": [56.7833, 44.5000],
        "Выкса": [55.3167, 42.1833],
        "Павлово": [55.9667, 43.0833],
        "Балахна": [56.5000, 43.6000]
      };

      cities.forEach(city => {
        const coords = cityCoordinates[city.name] || [56.3287, 44.0020];
        const marker = window.L.marker(coords, { icon: orangeIcon })
          .addTo(map)
          .bindPopup(`<div style="color: #1a1a1a;"><b>${city.name}</b><br/>${city.description}</div>`)
          .on('click', () => onCitySelect(city));
        
        if (selectedCity && selectedCity.id === city.id) {
          marker.openPopup();
        }
      });

      return () => {
        map.remove();
      };
    }
  }, [cities, selectedCity, onCitySelect]);

  return <div id="map" className="w-full h-96 rounded-lg shadow-2xl border border-orange-500/20"></div>;
};

// Navigation Component with Transport section added
const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { path: "/", label: "Главная", icon: "🏠" },
    { path: "/history", label: "История", icon: "📚" },
    { path: "/attractions", label: "Достопримечательности", icon: "🏛️" },
    { path: "/culture", label: "Культура и традиции", icon: "🎨" },
    { path: "/transport", label: "Транспорт", icon: "🚌" },
    { path: "/contacts", label: "Контакты", icon: "📧" },
    { path: "/admin", label: "Админ", icon: "⚙️" }
  ];

  return (
    <nav className="bg-black border-b border-orange-500/20 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
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

// Home Page
const HomePage = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API}/cities`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
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
            Исследуйте знаменитые города Нижегородской области на интерактивной карте. 
            Нажимайте на оранжевые маркеры, чтобы узнать подробности о городах области.
          </p>
        </div>
        
        <InteractiveMap 
          cities={cities} 
          selectedCity={selectedCity} 
          onCitySelect={setSelectedCity} 
        />
        
        {selectedCity && (
          <div className="mt-8 p-8 bg-gray-800/50 rounded-xl shadow-2xl border border-orange-500/20 backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-4 text-orange-400">{selectedCity.name}</h3>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">{selectedCity.description}</p>
            {selectedCity.image_url && (
              <img 
                src={selectedCity.image_url} 
                alt={selectedCity.name}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-4"
              />
            )}
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
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
                <div className="absolute -left-11 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-4 border-black shadow-xl flex items-center justify-center animate-pulse-slow">
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

// Cities Attractions Page
const AttractionsPage = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API}/cities`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Достопримечательности по городам
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Выберите город и откройте его уникальные достопримечательности
          </p>
        </div>
        
        {/* Cities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cities.map(city => (
            <div 
              key={city.id} 
              className="group cursor-pointer bg-gray-800/40 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm overflow-hidden"
              onClick={() => setSelectedCity(selectedCity?.id === city.id ? null : city)}
            >
              {city.image_url && (
                <div className="h-48 overflow-hidden rounded-t-2xl">
                  <img 
                    src={city.image_url} 
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-orange-400 group-hover:text-orange-300 transition-colors">
                  {city.name}
                </h3>
                <p className="text-gray-300 leading-relaxed">{city.description}</p>
                <div className="mt-4 text-sm text-orange-500">
                  {selectedCity?.id === city.id ? 'Скрыть достопримечательности ▲' : 'Показать достопримечательности ▼'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected City Attractions */}
        {selectedCity && (
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold mb-8 text-center text-orange-400">
              Достопримечательности города {selectedCity.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {selectedCity.attractions.map((attraction, index) => (
                <div key={index} className="bg-gray-800/40 p-6 rounded-xl border border-orange-500/20 backdrop-blur-sm">
                  {attraction.image_url && (
                    <div className="h-32 mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={attraction.image_url} 
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h4 className="text-xl font-bold mb-3 text-orange-400">{attraction.name}</h4>
                  <p className="text-gray-300 leading-relaxed">{attraction.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Culture Page
const CulturePage = () => {
  const [cultureItems, setCultureItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCulture();
  }, []);

  const fetchCulture = async () => {
    try {
      const response = await axios.get(`${API}/culture`);
      setCultureItems(response.data);
    } catch (error) {
      console.error('Error fetching culture items:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'Все категории', icon: '🎭' },
    { value: 'craft', label: 'Ремёсла', icon: '🎨' },
    { value: 'tradition', label: 'Традиции', icon: '🏛️' },
    { value: 'nature', label: 'Природа', icon: '🌿' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? cultureItems 
    : cultureItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Культура и традиции
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Богатейшее наследие народных промыслов и традиций Нижегородской области
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

        {/* Culture Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="group bg-gray-800/40 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    {item.category === 'craft' ? 'Ремесло' :
                     item.category === 'tradition' ? 'Традиция' :
                     item.category === 'nature' ? 'Природа' : item.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-orange-400 group-hover:text-orange-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">Элементы культуры в данной категории будут добавлены в ближайшее время.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// New Transport Page
const TransportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Транспорт
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Полная информация о тарифах и транспорте в Нижегородской области (актуально на 2024-2025 годы)
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Тарифы на проезд */}
          <div className="space-y-8">
            <div className="bg-gray-800/40 rounded-2xl border border-orange-500/20 backdrop-blur-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-orange-400 text-2xl">💳</span>
                </div>
                <h2 className="text-3xl font-bold text-orange-400">Тарифы на проезд</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/30 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">Базовые тарифы</h3>
                  <p className="text-gray-300">• По карте: <span className="text-orange-400 font-bold">35 ₽</span></p>
                  <p className="text-gray-300">• Наличными: <span className="text-orange-400 font-bold">40 ₽</span></p>
                </div>
                
                <div className="p-4 bg-gray-900/30 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">Проездные на месяц</h3>
                  <p className="text-gray-300">• Один вид транспорта: <span className="text-orange-400 font-bold">1 400 ₽</span></p>
                  <p className="text-gray-300">• Все виды транспорта: <span className="text-orange-400 font-bold">2 300 ₽</span></p>
                </div>
                
                <div className="p-4 bg-gray-900/30 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">Маршрутки</h3>
                  <p className="text-gray-300">По карте: <span className="text-orange-400 font-bold">26-30 ₽</span> (зависит от маршрута)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/40 rounded-2xl border border-orange-500/20 backdrop-blur-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-orange-400 text-2xl">🎫</span>
                </div>
                <h2 className="text-3xl font-bold text-orange-400">Льготные тарифы</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/30 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">Социальные</h3>
                  <p className="text-gray-300">• 20 поездок: <span className="text-green-400 font-bold">250 ₽</span></p>
                  <p className="text-gray-300">• 40 поездок: <span className="text-green-400 font-bold">500 ₽</span></p>
                  <p className="text-gray-300">• Месячный: <span className="text-green-400 font-bold">800 ₽</span></p>
                </div>
                
                <div className="p-4 bg-gray-900/30 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">Студенческие</h3>
                  <p className="text-gray-300">• 40 поездок: <span className="text-blue-400 font-bold">400 ₽</span></p>
                  <p className="text-gray-300">• 60 поездок: <span className="text-blue-400 font-bold">600 ₽</span></p>
                  <p className="text-gray-300">• Безлимит месячный: <span className="text-blue-400 font-bold">700 ₽</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800/40 rounded-2xl border border-orange-500/20 backdrop-blur-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-orange-400 text-2xl">💎</span>
                </div>
                <h2 className="text-3xl font-bold text-orange-400">Ситикард</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">Стоимость карт</h3>
                  <p className="text-gray-300">• Персональная (КЖНО): <span className="text-orange-400 font-bold">5 ₽</span></p>
                  <p className="text-gray-300">• Неперсональная: <span className="text-orange-400 font-bold">50 ₽</span></p>
                  <p className="text-gray-300">• Льготные: <span className="text-green-400 font-bold">бесплатно</span></p>
                </div>
                
                <div className="p-4 bg-gray-900/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">Оформление</h3>
                  <p className="text-gray-300">📍 Персональные карты: в МФЦ</p>
                  <p className="text-gray-300">⏱️ Срок изготовления: до 14 дней</p>
                  <p className="text-gray-300">💰 Пополнение: терминалы, кассы, приложения</p>
                  <p className="text-gray-300">🌐 Сайт: siticard.ru</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/40 rounded-2xl border border-orange-500/20 backdrop-blur-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-orange-400 text-2xl">🚂</span>
                </div>
                <h2 className="text-3xl font-bold text-orange-400">Междугородный транспорт</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">Электрички</h3>
                  <p className="text-gray-300">• 1-4 км: <span className="text-orange-400 font-bold">21 ₽</span></p>
                  <p className="text-gray-300">• 5-10 км: <span className="text-orange-400 font-bold">40 ₽</span></p>
                  <p className="text-gray-300">• 11-20 км: <span className="text-orange-400 font-bold">80 ₽</span></p>
                </div>
                
                <div className="p-4 bg-gray-900/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">Автобусы и такси</h3>
                  <p className="text-gray-300">🚌 Междугородние автобусы по маршруту</p>
                  <p className="text-gray-300">🚐 Маршрутки в сельской местности</p>
                  <p className="text-gray-300">🚗 Аренда авто и такси для отдалённых районов</p>
                  <p className="text-gray-300">🔄 Пересадки через областной центр</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Contact Page with student info and animations
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

  const teamMembers = [
    "Капустин Александр",
    "Горбачёв Семён",
    "Жестков Кирилл", 
    "Бабкин Владислав",
    "Нуждин Алексей"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent animate-fade-in">
            Контакты
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
            Свяжитесь с нами для получения дополнительной информации
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800/40 rounded-2xl border border-orange-500/20 backdrop-blur-sm p-8 animate-slide-up">
            <h2 className="text-3xl font-bold mb-6 text-orange-400">Свяжитесь с нами</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
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
              <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
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
              <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
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
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in-right"
                style={{ animationDelay: '0.5s' }}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>
            
            {submitMessage && (
              <div className={`mt-6 p-4 rounded-lg animate-slide-up ${
                submitMessage.includes('Спасибо') 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {submitMessage}
              </div>
            )}
          </div>

          {/* Project Information */}
          <div className="bg-gray-800/40 rounded-2xl border border-orange-500/20 backdrop-blur-sm p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold mb-6 text-orange-400">О проекте</h2>
            
            <div className="space-y-6">
              <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 text-xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-300 mb-2">Университетский проект</h3>
                    <p className="text-gray-400">
                      Этот сайт создан студентами НИУ ВШЭ НН как проект для ОРГ 
                      "Создание интерактивного путеводителя по региону"
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 text-xl">👥</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-300 mb-3">Made by:</h3>
                    <div className="space-y-2">
                      {teamMembers.map((member, index) => (
                        <div 
                          key={index} 
                          className="animate-slide-in-right bg-gray-900/30 p-3 rounded-lg border-l-4 border-orange-500"
                          style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                        >
                          <p className="text-gray-300 font-medium">{member}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="animate-slide-in-right" style={{ animationDelay: '1.0s' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-300 mb-2">Цель проекта</h3>
                    <p className="text-gray-400">
                      Создание современного интерактивного путеводителя по 
                      достопримечательностям и культурному наследию Нижегородской области
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Page
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
      alert('Данные с городской структурой успешно загружены!');
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
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
                  Загрузить данные с новой структурой городов и достопримечательностей.
                  Включает фотографии и подробные описания.
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
                  Удалить все существующие данные из базы. Используйте с осторожностью.
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
              <p>✅ Изменён цвет фона с тёмно-синего на чёрный</p>
              <p>✅ Переделана страница достопримечательностей на городскую структуру</p>
              <p>✅ Добавлены высококачественные фотографии к городам</p>
              <p>✅ Добавлен раздел "Транспорт" с актуальными тарифами 2024-2025</p>
              <p>✅ Обновлены контакты с информацией о студентах НИУ ВШЭ НН</p>
              <p>✅ Добавлена отправка сообщений на email администратора</p>
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
    // Load Leaflet CSS and JS
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
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/contacts" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;