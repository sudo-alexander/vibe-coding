import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Map Component using OpenStreetMap
const InteractiveMap = ({ places, selectedPlace, onPlaceSelect }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) {
      // Initialize map
      const map = window.L.map('map').setView([56.3287, 44.0020], 12);
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers for places
      places.forEach(place => {
        const marker = window.L.marker([place.latitude, place.longitude])
          .addTo(map)
          .bindPopup(`<b>${place.name}</b><br>${place.description}`)
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

  return <div id="map" className="w-full h-96 rounded-lg shadow-lg"></div>;
};

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { path: "/", label: "Главная", icon: "🏠" },
    { path: "/history", label: "История", icon: "📚" },
    { path: "/culture", label: "Культура и традиции", icon: "🎨" },
    { path: "/attractions", label: "Достопримечательности", icon: "🏛️" },
    { path: "/events", label: "События и маршруты", icon: "📅" },
    { path: "/contacts", label: "Контакты", icon: "📧" },
    { path: "/admin", label: "Админ", icon: "⚙️" }
  ];

  return (
    <nav className="bg-blue-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-xl">НН</span>
              </div>
              <span className="text-white font-bold text-xl">Нижегородская область</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-700 text-yellow-300'
                    : 'text-white hover:bg-blue-700 hover:text-yellow-300'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-300"
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-700 text-yellow-300'
                      : 'text-white hover:bg-blue-700 hover:text-yellow-300'
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Добро пожаловать в Нижегородскую область
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto animate-fade-in-delay">
            Откройте для себя богатую историю, уникальную культуру и захватывающие дух 
            достопримечательности нашего прекрасного региона на берегах великой Волги.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/attractions" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              Исследовать достопримечательности
            </Link>
            <Link to="/history" 
                  className="border-2 border-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              Узнать историю
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">
          Интерактивная карта достопримечательностей
        </h2>
        <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
          Кликните на маркеры карты, чтобы узнать больше о знаменитых местах Нижегородской области
        </p>
        <InteractiveMap 
          places={places} 
          selectedPlace={selectedPlace} 
          onPlaceSelect={setSelectedPlace} 
        />
        
        {selectedPlace && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-blue-900">{selectedPlace.name}</h3>
            <p className="text-gray-700 mb-4">{selectedPlace.description}</p>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {selectedPlace.category}
            </span>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            Что вас ждет в нашем регионе
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏰</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-900">Историческое наследие</h3>
              <p className="text-gray-600">
                800 лет истории, древние крепости, уникальная архитектура и памятники культуры
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-900">Народные промыслы</h3>
              <p className="text-gray-600">
                Знаменитая хохломская роспись, городецкие узоры и другие традиционные ремесла
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-900">Природные красоты</h3>
              <p className="text-gray-600">
                Великая Волга, живописные леса, озера и заповедники для отдыха и экотуризма
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// History Page
const HistoryPage = () => {
  const [historyEvents, setHistoryEvents] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API}/history`);
      setHistoryEvents(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">История Нижегородской области</h1>
        
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-300"></div>
          
          {historyEvents.map((event, index) => (
            <div key={event.id} className="relative mb-8 ml-12">
              <div className="absolute -left-10 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow"></div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {event.year} год
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-900">{event.title}</h3>
                <p className="text-gray-700">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
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
    { value: 'all', label: 'Все категории' },
    { value: 'craft', label: 'Ремесла' },
    { value: 'cuisine', label: 'Кухня' },
    { value: 'costume', label: 'Костюмы' },
    { value: 'festival', label: 'Фестивали' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? cultureItems 
    : cultureItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          Культура и традиции
        </h1>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Culture Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-900">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Attractions Page
const AttractionsPage = () => {
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'kremlin', label: 'Кремль' },
    { value: 'museum', label: 'Музеи' },
    { value: 'nature', label: 'Природа' },
    { value: 'architecture', label: 'Архитектура' }
  ];

  const filteredPlaces = selectedCategory === 'all' 
    ? places 
    : places.filter(place => place.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          Достопримечательности
        </h1>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Places Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map(place => (
            <div key={place.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {place.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-900">{place.name}</h3>
                <p className="text-gray-700 mb-4">{place.description}</p>
                <div className="text-sm text-gray-500">
                  📍 {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Events Page
const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          События и маршруты
        </h1>
        
        <div className="grid gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-2">
                      {event.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      📅 {new Date(event.date).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-blue-900">{event.title}</h3>
                  <p className="text-gray-700 mb-2">{event.description}</p>
                  <div className="text-sm text-gray-500">
                    📍 {event.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">События будут добавлены в ближайшее время.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Contact Page
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">Контакты</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Свяжитесь с нами</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Сообщение *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>
            
            {submitMessage && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                {submitMessage}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Информация для связи</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Адрес:</h3>
                <p className="text-gray-600">
                  г. Нижний Новгород<br />
                  Нижегородская область<br />
                  Россия
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">Время работы:</h3>
                <p className="text-gray-600">
                  Понедельник - Пятница: 9:00 - 18:00<br />
                  Суббота - Воскресенье: 10:00 - 16:00
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">Туристические маршруты:</h3>
                <p className="text-gray-600">
                  Мы организуем экскурсии по историческим местам,<br />
                  знакомим с народными промыслами и культурными традициями региона.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Basic Admin Panel
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('places');

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Неверные учетные данные');
    }
  };

  const initializeData = async () => {
    try {
      const auth = btoa('admin:admin123');
      await axios.post(`${API}/init-data`, {}, {
        headers: { 'Authorization': `Basic ${auth}` }
      });
      alert('Данные инициализированы успешно!');
    } catch (error) {
      console.error('Error initializing data:', error);
      alert('Ошибка при инициализации данных');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">Вход в админ панель</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Войти
            </button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-4">
            По умолчанию: admin / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">Админ панель</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Выйти
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <button
              onClick={initializeData}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Инициализировать тестовые данные
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Загрузить образцы мест, истории и культурных элементов
            </p>
          </div>

          <div className="text-center text-gray-600">
            <p>Расширенные функции управления содержимым будут добавлены в следующих версиях.</p>
            <p className="mt-2">Сейчас вы можете инициализировать тестовые данные для сайта.</p>
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
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/contacts" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;