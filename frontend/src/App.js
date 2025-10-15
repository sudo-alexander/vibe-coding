import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component with new color scheme
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
    <nav className="bg-primary border-b border-accent/20 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-xl">НО</span>
              </div>
              <span className="text-text font-bold text-xl">Нижегородская область</span>
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
                    ? 'bg-gradient-active text-primary shadow-lg shadow-accent/25'
                    : 'text-text-muted hover:bg-accent/10 hover:text-accent-hover border border-transparent hover:border-accent/20'
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
              className="text-text-muted hover:text-accent-hover transition-colors"
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
          <div className="md:hidden border-t border-accent/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gradient-active text-primary'
                      : 'text-text-muted hover:bg-accent/10 hover:text-accent-hover'
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

// Home Page without map
const HomePage = () => {
  const [cities, setCities] = useState([]);

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
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-lighter to-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5"></div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 text-center">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-accent via-accent-hover to-button-end bg-clip-text text-transparent animate-fade-in">
            Нижегородская область
          </h1>
          <div className="h-1 w-32 bg-gradient-active mx-auto mb-8 rounded-full"></div>
          <p className="text-xl mb-12 max-w-4xl mx-auto text-text leading-relaxed animate-fade-in-delay">
            Откройте богатейшую историю древнего края, где река Волга встречается с Окой. 
            Погрузитесь в мир легендарных народных промыслов - хохломской и городецкой росписи, 
            семёновских матрёшек. Исследуйте величественный Нижегородский кремль XVI века, 
            прогуляйтесь по историческим городам и насладитесь природными красотами Поволжья.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/attractions" 
                  className="group bg-gradient-active hover:bg-gradient-hover text-primary px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent/25">
              <span className="flex items-center justify-center">
                🗺️ Исследовать достопримечательности
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
            <Link to="/history" 
                  className="group border-2 border-accent hover:bg-accent/10 text-accent hover:text-accent-hover px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105">
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

      {/* Cities Preview Section */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-text">
            Города Нижегородской области
          </h2>
          <div className="h-1 w-24 bg-gradient-active mx-auto mb-6 rounded-full"></div>
          <p className="text-text-muted max-w-3xl mx-auto text-lg leading-relaxed">
            Исследуйте исторические города области, каждый из которых хранит уникальные достопримечательности и культурные традиции.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.slice(0, 8).map(city => (
            <Link 
              key={city.id}
              to="/attractions"
              className="group bg-card rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm overflow-hidden"
            >
              {city.image_url && (
                <div className="h-32 overflow-hidden rounded-t-2xl">
                  <img 
                    src={city.image_url} 
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-accent group-hover:text-accent-hover transition-colors">
                  {city.name}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed line-clamp-2">{city.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/attractions" className="btn-primary">
            Посмотреть все города
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-secondary py-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-text">
              Сокровища Нижегородской области
            </h2>
            <div className="h-1 w-32 bg-gradient-active mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-card rounded-2xl border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🏰</div>
              <h3 className="text-2xl font-bold mb-4 text-accent">Историческое наследие</h3>
              <p className="text-text-muted leading-relaxed">
                800-летняя история региона воплощена в величественном Нижегородском кремле XVI века, 
                древних городах и архитектурных памятниках разных эпох
              </p>
            </div>
            
            <div className="group text-center p-8 bg-card rounded-2xl border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🎨</div>
              <h3 className="text-2xl font-bold mb-4 text-accent">Народные промыслы</h3>
              <p className="text-text-muted leading-relaxed">
                Мировая слава хохломской росписи, городецких узоров и семёновских матрёшек. 
                Живые традиции мастерства, передающиеся из поколения в поколение
              </p>
            </div>
            
            <div className="group text-center p-8 bg-card rounded-2xl border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🌊</div>
              <h3 className="text-2xl font-bold mb-4 text-accent">Природные сокровища</h3>
              <p className="text-text-muted leading-relaxed">
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

// History Page with new colors
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
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-button-end bg-clip-text text-transparent animate-fade-in">
            История Нижегородской области
          </h1>
          <div className="h-1 w-32 bg-gradient-active mx-auto mb-6 rounded-full"></div>
          <p className="text-text-muted text-lg max-w-3xl mx-auto leading-relaxed">
            От основания в 1221 году до современности - восемь веков богатейшей истории русского края
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-active rounded-full"></div>
          
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
                <div className="absolute -left-11 w-8 h-8 bg-gradient-active rounded-full border-4 border-primary shadow-xl flex items-center justify-center animate-pulse-slow">
                  <div className="w-2 h-2 bg-text rounded-full"></div>
                </div>
                <div className="group bg-card p-8 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:transform hover:scale-[1.02] backdrop-blur-sm animate-slide-up">
                  <div className="flex items-center mb-4">
                    <span className="bg-gradient-active text-primary px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {event.year}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-accent group-hover:text-accent-hover transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-text leading-relaxed text-lg">{event.description}</p>
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
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-button-end bg-clip-text text-transparent">
            Достопримечательности по городам
          </h1>
          <div className="h-1 w-32 bg-gradient-active mx-auto mb-6 rounded-full"></div>
          <p className="text-text-muted text-lg max-w-3xl mx-auto leading-relaxed">
            Выберите город и откройте его уникальные достопримечательности
          </p>
        </div>
        
        {/* Cities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cities.map(city => (
            <div 
              key={city.id} 
              className="group cursor-pointer bg-card rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm overflow-hidden"
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
                <h3 className="text-2xl font-bold mb-3 text-accent group-hover:text-accent-hover transition-colors">
                  {city.name}
                </h3>
                <p className="text-text leading-relaxed">{city.description}</p>
                <div className="mt-4 text-sm text-secondary-accent">
                  {selectedCity?.id === city.id ? 'Скрыть достопримечательности ▲' : 'Показать достопримечательности ▼'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected City Attractions */}
        {selectedCity && (
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold mb-8 text-center text-accent">
              Достопримечательности города {selectedCity.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {selectedCity.attractions.map((attraction, index) => (
                <div key={index} className="bg-card p-6 rounded-xl border border-accent/20 backdrop-blur-sm">
                  {attraction.image_url && (
                    <div className="h-32 mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={attraction.image_url} 
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h4 className="text-xl font-bold mb-3 text-accent">{attraction.name}</h4>
                  <p className="text-text leading-relaxed">{attraction.description}</p>
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
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-button-end bg-clip-text text-transparent">
            Культура и традиции
          </h1>
          <div className="h-1 w-32 bg-gradient-active mx-auto mb-6 rounded-full"></div>
          <p className="text-text-muted text-lg max-w-3xl mx-auto leading-relaxed">
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
                  ? 'bg-gradient-active text-primary shadow-xl transform scale-105'
                  : 'bg-card text-text-muted border border-accent/20 hover:border-accent/40 hover:bg-accent/10 hover:text-accent-hover'
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
            <div key={item.id} className="group bg-card rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium border border-accent/30">
                    <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                    {item.category === 'craft' ? 'Ремесло' :
                     item.category === 'tradition' ? 'Традиция' :
                     item.category === 'nature' ? 'Природа' : item.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-accent group-hover:text-accent-hover transition-colors">
                  {item.title}
                </h3>
                <p className="text-text leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted text-xl">Элементы культуры в данной категории будут добавлены в ближайшее время.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Transport Page
const TransportPage = () => {
  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-button-end bg-clip-text text-transparent">
            Транспорт
          </h1>
          <div className="h-1 w-32 bg-gradient-active mx-auto mb-6 rounded-full"></div>
          <p className="text-text-muted text-lg max-w-3xl mx-auto leading-relaxed">
            Полная информация о тарифах и транспорте в Нижегородской области (актуально на 2024-2025 годы)
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Тарифы на проезд */}
          <div className="space-y-8">
            <div className="bg-card rounded-2xl border border-accent/20 backdrop-blur-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-accent text-2xl">💳</span>
                </div>
                <h2 className="text-3xl font-bold text-accent">Тарифы на проезд</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg border-l-4 border-accent">
                  <h3 className="text-lg font-semibold text-accent-hover mb-2">Базовые тарифы</h3>
                  <p className="text-text">• По карте: <span className="text-accent font-bold">35 ₽</span></p>
                  <p className="text-text">• Наличными: <span className="text-accent font-bold">40 ₽</span></p>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg border-l-4 border-accent">
                  <h3 className="text-lg font-semibold text-accent-hover mb-2">Проездные на месяц</h3>
                  <p className="text-text">• Один вид транспорта: <span className="text-accent font-bold">1 400 ₽</span></p>
                  <p className="text-text">• Все виды транспорта: <span className="text-accent font-bold">2 300 ₽</span></p>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg border-l-4 border-accent">
                  <h3 className="text-lg font-semibold text-accent-hover mb-2">Маршрутки</h3>
                  <p className="text-text">По карте: <span className="text-accent font-bold">26-30 ₽</span> (зависит от маршрута)</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-accent/20 backdrop-blur-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-accent text-2xl">🎫</span>
                </div>
                <h2 className="text-3xl font-bold text-accent">Льготные тарифы</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg border-l-4 border-secondary-accent">
                  <h3 className="text-lg font-semibold text-secondary-accent mb-2">Социальные</h3>
                  <p className="text-text">• 20 поездок: <span className="text-secondary-accent font-bold">250 ₽</span></p>
                  <p className="text-text">• 40 поездок: <span className="text-secondary-accent font-bold">500 ₽</span></p>
                  <p className="text-text">• Месячный: <span className="text-secondary-accent font-bold">800 ₽</span></p>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg border-l-4 border-secondary-accent">
                  <h3 className="text-lg font-semibold text-secondary-accent mb-2">Студенческие</h3>
                  <p className="text-text">• 40 поездок: <span className="text-secondary-accent font-bold">400 ₽</span></p>
                  <p className="text-text">• 60 поездок: <span className="text-secondary-accent font-bold">600 ₽</span></p>
                  <p className="text-text">• Безлимит месячный: <span className="text-secondary-accent font-bold">700 ₽</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card rounded-2xl border border-accent/20 backdrop-blur-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-accent text-2xl">💎</span>
                </div>
                <h2 className="text-3xl font-bold text-accent">Ситикард</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-lg font-semibold text-accent-hover mb-2">Стоимость карт</h3>
                  <p className="text-text">• Персональная (КЖНО): <span className="text-accent font-bold">5 ₽</span></p>
                  <p className="text-text">• Неперсональная: <span className="text-accent font-bold">50 ₽</span></p>
                  <p className="text-text">• Льготные: <span className="text-secondary-accent font-bold">бесплатно</span></p>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-lg font-semibold text-accent-hover mb-2">Оформление</h3>
                  <p className="text-text">📍 Персональные карты: в МФЦ</p>
                  <p className="text-text">⏱️ Срок изготовления: до 14 дней</p>
                  <p className="text-text">💰 Пополнение: терминалы, кассы, приложения</p>
                  <p className="text-text">🌐 Сайт: siticard.ru</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-accent/20 backdrop-blur-sm p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-accent text-2xl">🚂</span>
                </div>
                <h2 className="text-3xl font-bold text-accent">Междугородный транспорт</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-lg font-semibold text-accent-hover mb-2">Электрички</h3>
                  <p className="text-text">• 1-4 км: <span className="text-accent font-bold">21 ₽</span></p>
                  <p className="text-text">• 5-10 км: <span className="text-accent font-bold">40 ₽</span></p>
                  <p className="text-text">• 11-20 км: <span className="text-accent font-bold">80 ₽</span></p>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-lg font-semibold text-accent-hover mb-2">Автобусы и такси</h3>
                  <p className="text-text">🚌 Междугородние автобусы по маршруту</p>
                  <p className="text-text">🚐 Маршрутки в сельской местности</p>
                  <p className="text-text">🚗 Аренда авто и такси для отдалённых районов</p>
                  <p className="text-text">🔄 Пересадки через областной центр</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Page with animations
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
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-button-end bg-clip-text text-transparent animate-fade-in">
            Контакты
          </h1>
          <div className="h-1 w-32 bg-gradient-active mx-auto mb-6 rounded-full"></div>
          <p className="text-text-muted text-lg max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
            Свяжитесь с нами для получения дополнительной информации
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl border border-accent/20 backdrop-blur-sm p-8 animate-slide-up">
            <h2 className="text-3xl font-bold mb-6 text-accent">Свяжитесь с нами</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <label className="block text-text text-sm font-bold mb-3">
                  Имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-secondary border border-accent/20 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 text-text transition-all duration-200"
                />
              </div>
              <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                <label className="block text-text text-sm font-bold mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-secondary border border-accent/20 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 text-text transition-all duration-200"
                />
              </div>
              <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                <label className="block text-text text-sm font-bold mb-3">
                  Сообщение *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-secondary border border-accent/20 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 text-text transition-all duration-200 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full animate-slide-in-right"
                style={{ animationDelay: '0.5s' }}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>
            
            {submitMessage && (
              <div className={`mt-6 p-4 rounded-lg animate-slide-up ${
                submitMessage.includes('Спасибо') 
                  ? 'bg-secondary-accent/20 text-secondary-accent border border-secondary-accent/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {submitMessage}
              </div>
            )}
          </div>

          {/* Project Information */}
          <div className="bg-card rounded-2xl border border-accent/20 backdrop-blur-sm p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold mb-6 text-accent">О проекте</h2>
            
            <div className="space-y-6">
              <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text mb-2">Университетский проект</h3>
                    <p className="text-text-muted">
                      Этот сайт создан студентами НИУ ВШЭ НН как проект для ОРГ 
                      "Создание интерактивного путеводителя по региону"
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-xl">👥</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text mb-3">Made by:</h3>
                    <div className="space-y-2">
                      {teamMembers.map((member, index) => (
                        <div 
                          key={index} 
                          className="animate-slide-in-right bg-secondary p-3 rounded-lg border-l-4 border-accent"
                          style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                        >
                          <p className="text-text font-medium">{member}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="animate-slide-in-right" style={{ animationDelay: '1.0s' }}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text mb-2">Цель проекта</h3>
                    <p className="text-text-muted">
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
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="bg-card backdrop-blur-sm p-10 rounded-2xl border border-accent/20 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-accent">Админ панель</h1>
            <div className="h-1 w-16 bg-gradient-active mx-auto rounded-full"></div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-text text-sm font-bold mb-3">
                Имя пользователя
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 bg-secondary border border-accent/20 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 text-text transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-text text-sm font-bold mb-3">
                Пароль
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 bg-secondary border border-accent/20 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 text-text transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Войти
            </button>
          </form>
          
          <p className="text-sm text-text-muted text-center mt-6">
            По умолчанию: admin / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-accent mb-2">Панель администратора</h1>
            <div className="h-1 w-24 bg-gradient-active rounded-full"></div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 px-6 py-3 rounded-lg transition-all duration-200"
          >
            Выйти
          </button>
        </div>

        <div className="grid gap-8">
          <div className="bg-card backdrop-blur-sm rounded-2xl border border-accent/20 p-8">
            <h2 className="text-2xl font-bold text-accent mb-6">Управление данными</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text">Инициализация данных</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Загрузить данные с новой структурой городов и достопримечательностей.
                  Включает фотографии и подробные описания.
                </p>
                <button
                  onClick={initializeData}
                  disabled={isInitializing}
                  className="btn-secondary w-full disabled:opacity-50"
                >
                  {isInitializing ? 'Загрузка...' : 'Обновить данные'}
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text">Очистка данных</h3>
                <p className="text-text-muted text-sm leading-relaxed">
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

          <div className="bg-card backdrop-blur-sm rounded-2xl border border-accent/20 p-8">
            <h2 className="text-2xl font-bold text-accent mb-4">Последние обновления</h2>
            <div className="text-text space-y-2">
              <p>✅ Обновлена цветовая палитра: современный тёмно-серый фон с тёплыми акцентами</p>
              <p>✅ Убрана интерактивная карта</p>
              <p>✅ Переделана страница достопримечательностей на городскую структуру</p>
              <p>✅ Добавлены высококачественные фотографии к городам</p>
              <p>✅ Добавлен раздел "Транспорт" с актуальными тарифами 2024-2025</p>
              <p>✅ Обновлены контакты с информацией о студентах НИУ ВШЭ НН</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
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