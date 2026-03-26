// src/WeatherDashboard.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cloud, CloudRain, Sun, Thermometer, MapPin, Download, TrendingUp, Calendar, Droplets, Wind, Eye, Activity, Layers, Brain, Satellite, TreePine, AlertTriangle, Sparkles, Users, Settings, Zap } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Dashboard.css';


const WeatherDashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [forecastDays, setForecastDays] = useState(7);
  const [activeTab, setActiveTab] = useState('forecast');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // API State
  const [forecastData, setForecastData] = useState([]);
  const [advisoryData, setAdvisoryData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const districts = ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Vellore', 'Tirunelveli'];
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch forecast data from API
  const fetchForecastData = async (district, days) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/weather/forecast?district=${encodeURIComponent(district)}&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API response to UI format
      const transformedForecast = data.forecast.map((day) => ({
        date: day.day_name.substr(0, 3), // Mon, Tue, etc.
        day: day.day_name,
        rainfall: Math.round(day.rainfall * 10) / 10,
        minTemp: Math.round(day.temperature_min),
        maxTemp: Math.round(day.temperature_max),
        humidity: day.humidity,
        windSpeed: day.wind_speed,
        pressure: day.pressure,
        uv: day.uv_index,
        cloudCover: day.cloud_cover,
        confidence: day.confidence
      }));
      
      setForecastData(transformedForecast);
    } catch (err) {
      console.error('Error fetching forecast:', err);
      setError('Failed to fetch forecast data. Make sure the API server is running on port 5000.');
      // Set fallback data
      setForecastData([
        { date: 'Mon', day: 'Monday', rainfall: 15, minTemp: 24, maxTemp: 32, humidity: 75, windSpeed: 12, pressure: 1013, uv: 8, cloudCover: 65, confidence: 92 },
        { date: 'Tue', day: 'Tuesday', rainfall: 8, minTemp: 25, maxTemp: 33, humidity: 70, windSpeed: 10, pressure: 1015, uv: 9, cloudCover: 40, confidence: 88 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current weather from API
  const fetchCurrentWeather = async (district) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/weather/current?district=${encodeURIComponent(district)}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setCurrentWeather(data.current);
    } catch (err) {
      console.error('Error fetching current weather:', err);
    }
  };

  // Fetch advisory data from API
  const fetchAdvisoryData = async (district) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/weather/advisory?district=${encodeURIComponent(district)}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API response to UI format with icons
      const cropIcons = {
        'Rice': '🌾',
        'Cotton': '🌱',
        'Sugarcane': '🎋',
        'Wheat': '🌾'
      };
      
      const transformedAdvisories = data.advisories.map((adv) => ({
        ...adv,
        icon: cropIcons[adv.crop] || '🌿'
      }));
      
      setAdvisoryData(transformedAdvisories);
    } catch (err) {
      console.error('Error fetching advisory:', err);
    }
  };

  // Fetch analytics data from API
  const fetchAnalyticsData = async (district) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/weather/analytics?district=${encodeURIComponent(district)}&days=${forecastDays}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  // Fetch all data when district or forecast days change
  useEffect(() => {
    fetchForecastData(selectedDistrict, forecastDays);
    fetchCurrentWeather(selectedDistrict);
    fetchAdvisoryData(selectedDistrict);
    fetchAnalyticsData(selectedDistrict);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrict, forecastDays]);

  // Clock and animation effects
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const getWeatherIcon = (rainfall, size = 'w-8 h-8') => {
    if (rainfall > 20) return <CloudRain className={`${size} text-cyan-400 drop-shadow-lg weather-icon animate-pulse`} />;
    if (rainfall > 5) return <Cloud className={`${size} text-slate-400 drop-shadow-lg weather-icon`} />;
    return <Sun className={`${size} text-amber-400 drop-shadow-lg weather-icon animate-spin`} style={{animationDuration: '8s'}} />;
  };

  const getCurrentWeather = () => {
    if (currentWeather) {
      return {
        rainfall: currentWeather.rainfall || 0,
        minTemp: currentWeather.temperature_min || 24,
        maxTemp: currentWeather.temperature_max || 35,
        humidity: currentWeather.humidity || 75,
        windSpeed: currentWeather.wind_speed || 12,
        pressure: currentWeather.pressure || 1013,
        confidence: currentWeather.confidence || 92
      };
    }
    return {
      rainfall: 0,
      minTemp: 24,
      maxTemp: 35,
      humidity: 75,
      windSpeed: 12,
      pressure: 1013,
      confidence: 92
    };
  };

  const generatePDFReport = async () => {
    try {
      const element = document.getElementById('pdf-report');
      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`weather-report-${selectedDistrict}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const themeClasses = 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white';
  const cardClasses = 'bg-slate-800/60 border-slate-700/50 backdrop-blur-xl';

  const MetricCard = ({ icon: Icon, title, value, unit, gradient, trend, confidence }) => (
    <div className={`${cardClasses} rounded-2xl p-6 border transition-all duration-500 hover:scale-105 hover:shadow-2xl group relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center space-x-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-bold">+{trend}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-black text-white">
            {value}<span className="text-lg text-slate-400 ml-1">{unit}</span>
          </p>
          {confidence && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-emerald-500">{confidence}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ForecastCard = ({ day, index }) => (
    <div 
      className={`${cardClasses} rounded-2xl p-6 border transition-all duration-500 hover:scale-105 group relative overflow-hidden`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`absolute inset-0 ${
        day.rainfall > 20 ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10' :
        day.rainfall > 5 ? 'bg-gradient-to-br from-slate-500/10 to-slate-600/10' :
        'bg-gradient-to-br from-amber-500/10 to-orange-500/10'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-black text-lg text-white">{day.date}</p>
            <p className="text-slate-400 text-sm font-medium">{day.day}</p>
          </div>
          <div className="relative">
            {getWeatherIcon(day.rainfall, 'w-12 h-12')}
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
              day.rainfall > 20 ? 'bg-blue-500 animate-pulse' :
              day.rainfall > 5 ? 'bg-slate-500' : 'bg-amber-500'
            }`}></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cyan-50/70 dark:bg-cyan-900/30 rounded-xl p-3 border border-cyan-200/50">
            <div className="flex items-center space-x-2 mb-1">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">RAINFALL</span>
            </div>
            <p className="text-lg font-black text-cyan-800 dark:text-cyan-200">{day.rainfall}mm</p>
          </div>
          <div className="bg-orange-50/70 dark:bg-orange-900/30 rounded-xl p-3 border border-orange-200/50">
            <div className="flex items-center space-x-2 mb-1">
              <Thermometer className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-orange-700 dark:text-orange-300">TEMP</span>
            </div>
            <p className="text-lg font-black text-orange-800 dark:text-orange-200">{day.minTemp}°-{day.maxTemp}°</p>
          </div>
          <div className="bg-emerald-50/70 dark:bg-emerald-900/30 rounded-xl p-3 border border-emerald-200/50">
            <div className="flex items-center space-x-2 mb-1">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">HUMIDITY</span>
            </div>
            <p className="text-lg font-black text-emerald-800 dark:text-emerald-200">{day.humidity}%</p>
          </div>
          <div className="bg-purple-50/70 dark:bg-purple-900/30 rounded-xl p-3 border border-purple-200/50">
            <div className="flex items-center space-x-2 mb-1">
              <Wind className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">WIND</span>
            </div>
            <p className="text-lg font-black text-purple-800 dark:text-purple-200">{day.windSpeed}km/h</p>
          </div>
        </div>
        <div className="mt-4 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-full transition-all duration-1000"
            style={{ width: `${85 + Math.random() * 15}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
      {/* Error Banner */}
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-6 py-4 flex items-center justify-between z-50">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-white hover:bg-red-600 px-3 py-1 rounded">✕</button>
        </div>
      )}
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
        <div className={`absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse`} style={{animationDelay: '4s'}}></div>
      </div>
      <header className={`${cardClasses} border-b backdrop-blur-xl relative z-20`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-md animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-2xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  NeuraWeather
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <p className="text-sm font-bold text-slate-300">
                    AI-Powered Agricultural Intelligence Platform
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className={`${cardClasses} rounded-xl p-4 border text-center min-w-[140px]`}>
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-xs font-bold text-emerald-500">LIVE</p>
                </div>
                <p className="font-black text-lg text-white">
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className="text-xs text-slate-400">
                  {currentTime.toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={generatePDFReport}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-bold flex items-center space-x-2 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-emerald-500/25"
                >
                  <Download className="w-5 h-5" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div id="pdf-report" className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className={`${cardClasses} rounded-2xl p-8 mb-8 border`}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1">TARGET REGION</p>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className={`${cardClasses} border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-cyan-500 outline-none`}
                  >
                    {districts.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1">FORECAST HORIZON</p>
                  <select
                    value={forecastDays}
                    onChange={(e) => setForecastDays(Number(e.target.value))}
                    className={`${cardClasses} border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-purple-500 outline-none`}
                  >
                    <option value={5}>5 Days Neural</option>
                    <option value={7}>7 Days Advanced</option>
                    <option value={10}>10 Days Deep Learning</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {[
                { id: 'forecast', label: 'Neural Forecast', icon: Brain },
                { id: 'analytics', label: 'AI Analytics', icon: Activity },
                { id: 'advisory', label: 'Smart Advisory', icon: TreePine },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={`${cardClasses} rounded-3xl p-8 mb-8 border bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl relative overflow-hidden`}>
          <div className="absolute inset-0">
            <div className={`absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl animate-pulse`}></div>
            <div className={`absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-2xl animate-pulse`} style={{animationDelay: '2s'}}></div>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-5xl font-black mb-2 text-white">{selectedDistrict}</h2>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Satellite className="w-5 h-5 text-cyan-400" />
                    <p className="text-cyan-400 font-bold">Neural Network Active</p>
                  </div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-slate-400 font-medium">
                    Last sync: {currentTime.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className={`${cardClasses} p-8 rounded-2xl text-center border`}>
                <div className="mb-4 flex justify-center">
                  {getWeatherIcon(getCurrentWeather().rainfall, 'w-20 h-20')}
                </div>
                <p className="text-2xl font-black text-white">
                  {getCurrentWeather().rainfall > 20 ? 'Heavy Rainfall' : 
                   getCurrentWeather().rainfall > 5 ? 'Light Showers' : 'Clear Skies'}
                </p>
                <p className="text-slate-400 font-medium mt-2">
                  AI Confidence: 94.2%
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <MetricCard
                icon={Droplets}
                title="Rainfall Prediction"
                value={getCurrentWeather().rainfall}
                unit="mm"
                gradient="from-cyan-500 to-blue-500"
                trend="12"
                confidence={92}
              />
              <MetricCard
                icon={Thermometer}
                title="Temperature Range"
                value={`${getCurrentWeather().minTemp}°-${getCurrentWeather().maxTemp}°`}
                unit="C"
                gradient="from-orange-500 to-red-500"
                trend="3"
                confidence={96}
              />
              <MetricCard
                icon={Wind}
                title="Wind Velocity"
                value={getCurrentWeather().windSpeed}
                unit="km/h"
                gradient="from-emerald-500 to-teal-500"
                trend="8"
                confidence={89}
              />
              <MetricCard
                icon={Eye}
                title="Humidity Index"
                value={getCurrentWeather().humidity}
                unit="%"
                gradient="from-purple-500 to-indigo-500"
                trend="5"
                confidence={91}
              />
            </div>
          </div>
        </div>
        {activeTab === 'forecast' && (
          <div className="space-y-8">
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(forecastDays)].map((_, i) => (
                  <div key={i} className={`${cardClasses} rounded-2xl p-6 border animate-pulse`}>
                    <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded-lg mb-4 w-3/4"></div>
                    <div className="h-12 bg-slate-300 dark:bg-slate-700 rounded-lg mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
                      <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && forecastData.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {forecastData.slice(0, forecastDays).map((day, index) => (
                    <ForecastCard key={index} day={day} index={index} />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className={`${cardClasses} rounded-2xl p-8 border`}>
                    <h3 className="text-2xl font-black mb-6 flex items-center text-white">
                      <Droplets className="w-7 h-7 mr-3 text-cyan-500" />
                      Neural Rainfall Analysis
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={forecastData.slice(0, forecastDays)}>
                        <defs>
                          <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #374151',
                            borderRadius: '12px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="rainfall" 
                          stroke="#06b6d4" 
                          fillOpacity={1} 
                          fill="url(#rainfallGradient)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={`${cardClasses} rounded-2xl p-8 border`}>
                    <h3 className="text-2xl font-black mb-6 flex items-center text-white">
                      <Thermometer className="w-7 h-7 mr-3 text-orange-500" />
                      Temperature Dynamics
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={forecastData.slice(0, forecastDays)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #374151',
                            borderRadius: '12px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="maxTemp" 
                          stroke="#f97316" 
                          strokeWidth={4} 
                          name="Max Temperature"
                          dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="minTemp" 
                          stroke="#06b6d4" 
                          strokeWidth={4} 
                          name="Min Temperature"
                          dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                        />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className={`${cardClasses} rounded-2xl p-8 border`}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black flex items-center text-white">
                  <Brain className="w-8 h-8 mr-3 text-purple-500" />
                  Neural Network Performance
                </h3>
                <div className="flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm">OPTIMAL</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <Activity className="w-10 h-10 mb-4 opacity-80" />
                    <h4 className="text-3xl font-black mb-2">94.7%</h4>
                    <p className="text-blue-100 font-bold">LSTM Accuracy</p>
                    <div className="mt-3 bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-11/12"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <TrendingUp className="w-10 h-10 mb-4 opacity-80" />
                    <h4 className="text-3xl font-black mb-2">0.92</h4>
                    <p className="text-emerald-100 font-bold">F1-Score</p>
                    <div className="mt-3 bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-10/12"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <Layers className="w-10 h-10 mb-4 opacity-80" />
                    <h4 className="text-3xl font-black mb-2">1.2mm</h4>
                    <p className="text-purple-100 font-bold">RMSE Rain</p>
                    <div className="mt-3 bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-9/12"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <Thermometer className="w-10 h-10 mb-4 opacity-80" />
                    <h4 className="text-3xl font-black mb-2">0.8°C</h4>
                    <p className="text-orange-100 font-bold">MAE Temp</p>
                    <div className="mt-3 bg-white/20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`${cardClasses} rounded-2xl p-8 border`}>
                <h3 className="text-2xl font-black mb-6 flex items-center text-white">
                  <TrendingUp className="w-7 h-7 mr-3 text-emerald-500" />
                  Prediction Accuracy Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={[
                    { month: 'Jan', accuracy: 92, confidence: 88 },
                    { month: 'Feb', accuracy: 94, confidence: 91 },
                    { month: 'Mar', accuracy: 91, confidence: 89 },
                    { month: 'Apr', accuracy: 96, confidence: 94 },
                    { month: 'May', accuracy: 95, confidence: 93 },
                    { month: 'Jun', accuracy: 97, confidence: 95 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #374151',
                        borderRadius: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#10b981" 
                      strokeWidth={4}
                      name="Model Accuracy"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#8b5cf6" 
                      strokeWidth={4}
                      name="Confidence Level"
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className={`${cardClasses} rounded-2xl p-8 border`}>
                <h3 className="text-2xl font-black mb-6 flex items-center text-white">
                  <Activity className="w-7 h-7 mr-3 text-blue-500" />
                  Real-time Processing Load
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-300">Neural Network Load</span>
                      <span className="text-blue-500 font-black">67%</span>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full w-2/3 relative">
                        <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-300">Data Processing</span>
                      <span className="text-emerald-500 font-black">89%</span>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full w-5/6 relative">
                        <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-300">Satellite Sync</span>
                      <span className="text-purple-500 font-black">95%</span>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full w-11/12 relative">
                        <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm">MODELS ACTIVE</span>
                      </div>
                      <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200">12</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-blue-700 dark:text-blue-300 font-bold text-sm">DATA SOURCES</span>
                      </div>
                      <p className="text-2xl font-black text-blue-800 dark:text-blue-200">47</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'advisory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className={`${cardClasses} rounded-2xl p-8 border`}>
                <h3 className="text-3xl font-black mb-8 flex items-center text-white">
                  <TreePine className="w-8 h-8 mr-3 text-emerald-500" />
                  AI-Powered Crop Intelligence
                </h3>
                
                {loading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`${cardClasses} border-l-4 p-6 rounded-2xl animate-pulse`}>
                        <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded-lg mb-4 w-1/2"></div>
                        <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-lg mb-3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {advisoryData.map((advisory, index) => (
                      <div
                        key={index}
                        className={`${cardClasses} border-l-4 p-6 rounded-2xl relative overflow-hidden ${
                          advisory.priority === 'high'
                            ? 'border-red-500 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20'
                            : advisory.priority === 'medium'
                            ? 'border-amber-500 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20'
                            : 'border-emerald-500 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20'
                        }`}
                      >
                        <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping"></div>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="text-5xl transform hover:scale-110 transition-transform duration-300">
                              {advisory.icon}
                            </div>
                            <div>
                              <h4 className="text-2xl font-black mb-2 text-white">
                                {advisory.crop}
                              </h4>
                              <div className="flex items-center space-x-3">
                                <span className="bg-white/70 dark:bg-slate-800/70 px-3 py-1 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300">
                                  {advisory.impact}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Sparkles className="w-4 h-4 text-amber-500" />
                                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                    {advisory.confidence}% confidence
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                            advisory.priority === 'high'
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                              : advisory.priority === 'medium'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                              : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                          }`}>
                            {advisory.priority} Priority
                          </div>
                        </div>
                        <p className="text-lg leading-relaxed mb-6 text-slate-300">
                          {advisory.advisory}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-400">Valid for 48 hours</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-400">{selectedDistrict} region</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${advisory.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {advisoryData.length === 0 && !loading && (
                      <div className={`${cardClasses} border rounded-2xl p-8 text-center`}>
                        <p className="text-slate-400">No advisories available at the moment.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">

              <div className={`${cardClasses} rounded-2xl p-6 border`}>
                <h3 className="text-xl font-black mb-6 flex items-center text-white">
                  <Activity className="w-6 h-6 mr-2 text-cyan-500" />
                  Smart Analytics
                </h3>
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 p-5 rounded-xl border border-cyan-200 dark:border-cyan-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-cyan-700 dark:text-cyan-300">Active Farmers</span>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-cyan-600" />
                        <span className="font-black text-cyan-800 dark:text-cyan-200 text-xl">3,247</span>
                      </div>
                    </div>
                    <div className="bg-cyan-200 dark:bg-cyan-800 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-5/6"></div>
                    </div>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400">↗ +234 this week</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 p-5 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-purple-700 dark:text-purple-300">Reports Generated</span>
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 text-purple-600" />
                        <span className="font-black text-purple-800 dark:text-purple-200 text-xl">567</span>
                      </div>
                    </div>
                    <div className="bg-purple-200 dark:bg-purple-800 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400">This month</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-6 flex items-center">
                    <Zap className="w-6 h-6 mr-2" />
                    Neural Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-bold">Neural Report</p>
                          <p className="text-sm text-white/80">Advanced weather analytics</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-bold">AI Configuration</p>
                          <p className="text-sm text-white/80">Model optimization settings</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className={`${cardClasses} mt-16 py-8 border-t backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 rounded-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-md animate-pulse"></div>
                <Brain className="w-6 h-6 text-white relative z-10" />
              </div>
              <div>
                <p className="font-black text-lg text-white">
                  NeuraWeather AI Platform
                </p>
                <p className="text-sm text-slate-400">
                  Developed by Rijja H & Rohith Varshighan S
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-slate-400">
                Tamil Nadu Agricultural University
              </span>
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-emerald-500">Neural Network Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WeatherDashboard;