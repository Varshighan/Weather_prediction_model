// src/WeatherDashboardEnhanced.js - Complete AI-Powered Agricultural Intelligence Platform
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { Cloud, CloudRain, Sun, Thermometer, MapPin, Download, Bell, TrendingUp, Calendar, Users, Droplets, Wind, Eye, AlertTriangle, Activity, Zap, Layers, Settings, Sparkles, Brain, Satellite, TreePine, Heart, Bug, Droplet, Leaf, Award, MapIcon, BarChart3, TrendingDown } from 'lucide-react';
import './Dashboard.css';

const WeatherDashboardEnhanced = () => {
  // ===== STATE MANAGEMENT =====
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [forecastDays, setForecastDays] = useState(7);
  const [activeTab, setActiveTab] = useState('forecast');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // API Data
  const [forecastData, setForecastData] = useState([]);
  const [advisoryData, setAdvisoryData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [cropHealthData, setCropHealthData] = useState(null);
  const [diseaseRiskData, setDiseaseRiskData] = useState(null);
  const [irrigationData, setIrrigationData] = useState([]);
  const [yieldData, setYieldData] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const districts = ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Vellore', 'Tirunelveli'];
  const API_BASE_URL = 'http://localhost:5000/api';

  // ===== FETCH FUNCTIONS =====
  const fetchForecastData = async (district, days) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/forecast?district=${encodeURIComponent(district)}&days=${days}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const transformed = data.forecast.map((day) => ({
        date: day.day_name.substr(0, 3),
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
      setForecastData(transformed);
    } catch (err) {
      console.error('Forecast error:', err);
      setError('Failed to fetch forecast data');
    }
  };

  const fetchCurrentWeather = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/current?district=${encodeURIComponent(district)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setCurrentWeather(data.current);
    } catch (err) {
      console.error('Current weather error:', err);
    }
  };

  const fetchAdvisoryData = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/advisory?district=${encodeURIComponent(district)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const cropIcons = { 'Rice': '🌾', 'Cotton': '🌱', 'Sugarcane': '🎋', 'Wheat': '🌾' };
      const transformed = data.advisories.map((adv) => ({ ...adv, icon: cropIcons[adv.crop] || '🌿' }));
      setAdvisoryData(transformed);
    } catch (err) {
      console.error('Advisory error:', err);
    }
  };

  const fetchAnalyticsData = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/analytics?district=${encodeURIComponent(district)}&days=${forecastDays}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Analytics error:', err);
    }
  };

  const fetchAlertsData = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/alerts?district=${encodeURIComponent(district)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setAlertsData(data.alerts || []);
    } catch (err) {
      console.error('Alerts error:', err);
    }
  };

  const fetchCropHealthData = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/crop-health?district=${encodeURIComponent(district)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setCropHealthData(data);
    } catch (err) {
      console.error('Crop health error:', err);
    }
  };

  const fetchDiseaseRiskData = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/disease-risk?district=${encodeURIComponent(district)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setDiseaseRiskData(data);
    } catch (err) {
      console.error('Disease risk error:', err);
    }
  };

  const fetchIrrigationData = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/irrigation?district=${encodeURIComponent(district)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setIrrigationData(data.schedule || []);
    } catch (err) {
      console.error('Irrigation error:', err);
    }
  };

  const fetchYieldData = async (district) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/yield-prediction?district=${encodeURIComponent(district)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setYieldData(data);
    } catch (err) {
      console.error('Yield error:', err);
    }
  };

  const fetchHeatmapData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/heatmap`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setHeatmapData(data.heatmap || []);
    } catch (err) {
      console.error('Heatmap error:', err);
    }
  };

  const fetchComparisonData = async (d1, d2) => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather/comparison?district1=${encodeURIComponent(d1)}&district2=${encodeURIComponent(d2)}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setComparisonData(data);
    } catch (err) {
      console.error('Comparison error:', err);
    }
  };

  // ===== EFFECTS =====
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchForecastData(selectedDistrict, forecastDays),
      fetchCurrentWeather(selectedDistrict),
      fetchAdvisoryData(selectedDistrict),
      fetchAnalyticsData(selectedDistrict),
      fetchAlertsData(selectedDistrict),
      fetchCropHealthData(selectedDistrict),
      fetchDiseaseRiskData(selectedDistrict),
      fetchIrrigationData(selectedDistrict),
      fetchYieldData(selectedDistrict),
      fetchHeatmapData(),
      fetchComparisonData(selectedDistrict, districts[0] === selectedDistrict ? districts[1] : districts[0])
    ]).finally(() => setLoading(false));
  }, [selectedDistrict, forecastDays]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ===== HELPER COMPONENTS =====
  const AnimatedAlertCard = ({ alert }) => {
    const colorMap = {
      blue: 'from-blue-500 to-cyan-500',
      red: 'from-red-500 to-pink-500',
      orange: 'from-orange-500 to-yellow-500',
      yellow: 'from-yellow-500 to-amber-500',
      green: 'from-emerald-500 to-green-500'
    };

    return (
      <div className={`bg-gradient-to-r ${colorMap[alert.color] || colorMap.blue} text-white rounded-2xl p-6 mb-4 relative overflow-hidden shadow-xl`}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-xl font-black">{alert.title}</h4>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              alert.severity === 'HIGH' ? 'bg-white/30' : 'bg-white/20'
            } backdrop-blur`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-sm font-medium mb-4 opacity-90">{alert.message}</p>
          <div className="bg-white/20 backdrop-blur px-3 py-2 rounded-lg inline-block">
            <p className="text-xs font-bold">📋 {alert.recommendation}</p>
          </div>
        </div>
      </div>
    );
  };

  const CropHealthCard = ({ crop, score, status, recommendation }) => {
    const getGradient = (score) => {
      if (score >= 80) return 'from-emerald-500 to-green-500';
      if (score >= 60) return 'from-blue-500 to-cyan-500';
      if (score >= 40) return 'from-yellow-500 to-amber-500';
      return 'from-red-500 to-pink-500';
    };

    return (
      <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} hover:shadow-2xl transition-all duration-300`}>
        <h4 className={`text-xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{crop}</h4>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Health Score</span>
            <span className={`text-2xl font-black bg-gradient-to-r ${getGradient(score)} bg-clip-text text-transparent`}>{score}</span>
          </div>
          <div className={`w-full rounded-full h-3 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} overflow-hidden`}>
            <div 
              className={`h-full bg-gradient-to-r ${getGradient(score)} transition-all duration-1000`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>

        <div className={`text-sm mb-3 px-3 py-2 rounded-lg ${
          score >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' :
          score >= 60 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
          score >= 40 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          <span className="font-bold">{status}</span>
        </div>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{recommendation}</p>
      </div>
    );
  };

  const DiseaseRiskIndicator = ({ disease, probability, recommended_crops }) => {
    return (
      <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'} rounded-xl p-4 mb-3 border-l-4 border-orange-500`}>
        <div className="flex items-start justify-between mb-2">
          <h5 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🦠 {disease.disease}</h5>
          <span className={`text-xs font-black px-2 py-1 rounded ${
            disease.risk_level === 'HIGH' ? 'bg-red-500 text-white' :
            disease.risk_level === 'MEDIUM' ? 'bg-orange-500 text-white' :
            'bg-yellow-500 text-white'
          }`}>{disease.risk_level}</span>
        </div>
        <p className={`text-sm mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{disease.recommendation}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Risk Probability</span>
          <div className="w-24 bg-slate-300 dark:bg-slate-600 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              style={{ width: `${disease.probability}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 ml-2">{disease.probability}%</span>
        </div>
      </div>
    );
  };

  const IrrigationScheduleCard = ({ schedule }) => {
    const getPriorityColor = (priority) => {
      switch(priority) {
        case 'HIGH': return 'from-red-500 to-pink-500';
        case 'MEDIUM': return 'from-amber-500 to-orange-500';
        case 'LOW': return 'from-blue-500 to-cyan-500';
        default: return 'from-emerald-500 to-green-500';
      }
    };

    return (
      <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gradient-to-br from-blue-50 to-cyan-50'} rounded-xl p-4 mb-4 border ${isDarkMode ? 'border-slate-600' : 'border-blue-200'}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h5 className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{schedule.date}</h5>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{schedule.day}</p>
          </div>
          <span className={`bg-gradient-to-r ${getPriorityColor(schedule.priority)} text-white font-black text-xs px-3 py-1 rounded-full`}>
            {schedule.priority}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3 text-center text-sm">
          <div>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>RAINFALL</p>
            <p className={`font-black text-lg ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{schedule.rainfall}mm</p>
          </div>
          <div>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>IRRIGATION</p>
            <p className={`font-black text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{schedule.irrigation_mm}mm</p>
          </div>
          <div>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>DURATION</p>
            <p className={`font-black text-lg ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{schedule.duration_hours}h</p>
          </div>
        </div>

        <div className={`text-xs px-3 py-2 rounded-lg ${isDarkMode ? 'bg-slate-600/50 text-slate-300' : 'bg-white/60 text-slate-700'}`}>
          💰 Water savings: {schedule.water_savings.toLocaleString()}m³/ha | ₹{schedule.cost_per_hectare} savings
        </div>
      </div>
    );
  };

  const YieldPredictionWidget = ({ crop, prediction }) => {
    return (
      <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <h5 className={`font-black mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <Award className="w-5 h-5 mr-2 text-amber-500" />
          {crop}
        </h5>
        <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Expected Yield</span>
            <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{prediction.predicted_yield}</span>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>{prediction.unit}</p>
          
          <div className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
            prediction.condition === 'Excellent' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' :
            prediction.condition === 'Good' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
            'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
          }`}>
            {prediction.condition}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Rainfall Impact: <strong className="text-cyan-600 dark:text-cyan-400">{prediction.factors.rainfall_impact}%</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Temperature Impact: <strong className="text-orange-600 dark:text-orange-400">{prediction.factors.temperature_impact}%</strong></span>
          </div>
          <div className="flex justify-between">
            <span>Humidity Impact: <strong className="text-emerald-600 dark:text-emerald-400">{prediction.factors.humidity_impact}%</strong></span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-300 dark:border-slate-600">
            <span className="text-slate-600 dark:text-slate-400">Confidence: <strong className="text-amber-600 dark:text-amber-400">{prediction.confidence}%</strong></span>
          </div>
        </div>
      </div>
    );
  };

  const DistrictHeatmapWidget = () => {
    if (!heatmapData || heatmapData.length === 0) return null;

    return (
      <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-8 border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <h3 className={`text-2xl font-black mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <MapIcon className="w-7 h-7 mr-3 text-cyan-500" />
          Tamil Nadu Weather Heatmap
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {heatmapData.map((district, idx) => (
            <div key={idx} className={`${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50'} rounded-xl p-4 border ${isDarkMode ? 'border-slate-600' : 'border-blue-200'} text-center`}>
              <p className={`font-black mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{district.name}</p>
              
              <div className="mb-3">
                <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-1`}>🌡️ TEMP</p>
                <p className={`text-2xl font-black ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>{district.temperature}°C</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>💧 RAIN</p>
                  <p className={`font-black text-cyan-600 dark:text-cyan-400`}>{district.rainfall}mm</p>
                </div>
                <div>
                  <p className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>💨 HUM</p>
                  <p className={`font-black text-emerald-600 dark:text-emerald-400`}>{district.humidity}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AgronomicCalendar = ({ district }) => {
    const calendar = {
      'Chennai': [
        { month: 'Apr-May', activity: 'Summer Rice - Nursery preparation', crop: '🌾' },
        { month: 'Jun-Jul', activity: 'Monsoon planting for Rice & Cotton', crop: '🌱' },
        { month: 'Aug-Sep', activity: 'Monsoon crops growth monitoring', crop: '☔' },
        { month: 'Oct-Nov', activity: 'Harvest Rice, plant Winter crops', crop: '🌾' },
        { month: 'Dec-Jan', activity: 'Winter crop maintenance', crop: '❄️' },
        { month: 'Feb-Mar', activity: 'Final winter harvest', crop: '✂️' }
      ],
      'Coimbatore': [
        { month: 'Jan-Feb', activity: 'Cotton nursery preparation', crop: '🌱' },
        { month: 'Mar-Apr', activity: 'Cotton transplanting season', crop: '🌿' },
        { month: 'May-Jun', activity: 'Monsoon onset - additional irrigation', crop: '💧' },
        { month: 'Jul-Aug', activity: 'Pest & disease monitoring', crop: '🦠' },
        { month: 'Sep-Oct', activity: 'Harvest preparation', crop: '📋' },
        { month: 'Nov-Dec', activity: 'Land preparation for new season', crop: '🚜' }
      ]
    };

    const events = calendar[district] || calendar['Chennai'];

    return (
      <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-8 border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <h3 className={`text-2xl font-black mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <Calendar className="w-7 h-7 mr-3 text-emerald-500" />
          Agronomic Calendar - {district}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event, idx) => (
            <div key={idx} className={`${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-emerald-50 to-green-50'} rounded-xl p-4 border-l-4 border-emerald-500`}>
              <div className="text-3xl mb-2">{event.crop}</div>
              <p className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{event.month}</p>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{event.activity}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const HyperLocalWidgets = ({ weather }) => {
    if (!weather) return null;

    const calculateDewPoint = (temp, humidity) => {
      const a = 17.27;
      const b = 237.7;
      const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
      return (b * alpha) / (a - alpha);
    };

    const calculateWindChill = (temp, windSpeed) => {
      if (temp > 10) return temp;
      return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16);
    };

    const dewPoint = calculateDewPoint((weather.minTemp + weather.maxTemp) / 2, weather.humidity);
    const windChill = calculateWindChill((weather.minTemp + weather.maxTemp) / 2, weather.windSpeed);

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50'} rounded-xl p-4 border ${isDarkMode ? 'border-slate-600' : 'border-blue-200'}`}>
          <p className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>💨 DEW POINT</p>
          <p className={`text-xl font-black text-blue-600 dark:text-blue-400`}>{dewPoint.toFixed(1)}°C</p>
          <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">Frost risk indicator</p>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-orange-50 to-red-50'} rounded-xl p-4 border ${isDarkMode ? 'border-slate-600' : 'border-orange-200'}`}>
          <p className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>🌡️ WIND CHILL</p>
          <p className={`text-xl font-black text-orange-600 dark:text-orange-400`}>{windChill.toFixed(1)}°C</p>
          <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">Feels like temperature</p>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-purple-50 to-pink-50'} rounded-xl p-4 border ${isDarkMode ? 'border-slate-600' : 'border-purple-200'}`}>
          <p className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>📊 PRESSURE</p>
          <p className={`text-xl font-black text-purple-600 dark:text-purple-400`}>{weather.pressure}mb</p>
          <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">Atmospheric pressure</p>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-amber-50 to-yellow-50'} rounded-xl p-4 border ${isDarkMode ? 'border-slate-600' : 'border-amber-200'}`}>
          <p className={`text-xs font-bold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>☀️ UV INDEX</p>
          <p className={`text-xl font-black text-amber-600 dark:text-amber-400`}>{weather.uv}</p>
          <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">Sun exposure level</p>
        </div>
      </div>
    );
  };

  const AdvancedAnalyticsDashboard = () => {
    if (!analyticsData) return null;

    // Prepare trend data
    const trendData = forecastData.slice(0, Math.min(7, forecastData.length)).map((d, i) => ({
      day: d.date,
      temperature: d.maxTemp,
      humidity: d.humidity,
      rainfall: d.rainfall
    }));

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-orange-900 to-red-900' : 'bg-gradient-to-br from-orange-100 to-red-100'} rounded-xl p-6 border ${isDarkMode ? 'border-orange-700' : 'border-orange-300'}`}>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-orange-300' : 'text-orange-700'} mb-2`}>🌡️ TEMP RANGE</p>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-orange-100' : 'text-orange-900'}`}>
              {analyticsData.temperature.min}° to {analyticsData.temperature.max}°C
            </p>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Avg: {analyticsData.temperature.average}°C</p>
          </div>

          <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-cyan-900' : 'bg-gradient-to-br from-blue-100 to-cyan-100'} rounded-xl p-6 border ${isDarkMode ? 'border-blue-700' : 'border-blue-300'}`}>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'} mb-2`}>💧 TOTAL RAINFALL</p>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>{analyticsData.rainfall.total}mm</p>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Rainy Days: {analyticsData.rainfall.rainy_days}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-gradient-to-br from-emerald-900 to-green-900' : 'bg-gradient-to-br from-emerald-100 to-green-100'} rounded-xl p-6 border ${isDarkMode ? 'border-emerald-700' : 'border-emerald-300'}`}>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'} mb-2`}>💨 HUMIDITY</p>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>{analyticsData.humidity.average}%</p>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Range: {analyticsData.humidity.min}-{analyticsData.humidity.max}%</p>
          </div>

          <div className={`${isDarkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-gradient-to-br from-purple-100 to-pink-100'} rounded-xl p-6 border ${isDarkMode ? 'border-purple-700' : 'border-purple-300'}`}>
            <p className={`text-xs font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'} mb-2`}>📈 TREND</p>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-purple-100' : 'text-purple-900'}`}>
              {analyticsData.temperature.trend === 'increasing' ? '↗️ UP' : '↘️ DOWN'}
            </p>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>Temperature {analyticsData.temperature.trend}</p>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-8 border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h3 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>📊 Temperature & Rainfall Trends</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e2e8f0'} />
              <XAxis dataKey="day" stroke={isDarkMode ? '#9ca3af' : '#64748b'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#64748b'} yAxisId="left" />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#64748b'} yAxisId="right" orientation="right" />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : 'white', border: `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`, borderRadius: '12px' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={3} name="Temperature (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="#06b6d4" strokeWidth={3} name="Rainfall (mm)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // ===== THEME =====
  const themeClasses = isDarkMode 
    ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
    : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-slate-900';

  const cardClasses = isDarkMode
    ? 'bg-slate-800/60 border-slate-700/50 backdrop-blur-xl'
    : 'bg-white/60 border-white/20 backdrop-blur-xl';

  // ===== MAIN RENDER =====
  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
        <div className={`absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse`} style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className={`${cardClasses} border-b backdrop-blur-xl relative z-20`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-md animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-2xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  🌾 NeuraWeather Pro
                </h1>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  AI-Powered Agricultural Intelligence with 10+ Advanced Features
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl text-white hover:scale-105 transition-transform"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
              </button>
              <div className={`${cardClasses} rounded-xl p-4 border text-center`}>
                <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className={`${cardClasses} rounded-2xl p-6 border`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-cyan-500" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className={`flex-1 ${cardClasses} border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-cyan-500 outline-none`}
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <Calendar className="w-6 h-6 text-purple-500" />
                <select
                  value={forecastDays}
                  onChange={(e) => setForecastDays(Number(e.target.value))}
                  className={`flex-1 ${cardClasses} border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-purple-500 outline-none`}
                >
                  <option value={5}>5 Days Forecast</option>
                  <option value={7}>7 Days Forecast</option>
                  <option value={10}>10 Days Forecast</option>
                </select>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { id: 'forecast', label: '📊 Forecast', icon: Cloud },
                { id: 'alerts', label: '🚨 Alerts', icon: AlertTriangle },
                { id: 'health', label: '❤️ Crop Health', icon: Heart },
                { id: 'disease', label: '🦠 Disease Risk', icon: Bug },
                { id: 'irrigation', label: '💧 Irrigation', icon: Droplet },
                { id: 'yield', label: '🏆 Yield Pred.', icon: Award },
                { id: 'analytics', label: '📈 Analytics', icon: BarChart3 },
                { id: 'calendar', label: '📅 Calendar', icon: Calendar },
                { id: 'heatmap', label: '🗺️ Heatmap', icon: MapIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 text-sm ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105'
                      : `${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Current Weather Summary */}
        {currentWeather && (
          <div className={`${cardClasses} rounded-3xl p-8 mb-8 border bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>📍 LOCATION</p>
                <p className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedDistrict}</p>
              </div>
              <div>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>🌡️ TEMPERATURE</p>
                <p className={`text-3xl font-black text-orange-600 dark:text-orange-400`}>{Math.round((currentWeather.temperature_min + currentWeather.temperature_max) / 2)}°C</p>
              </div>
              <div>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>💧 HUMIDITY</p>
                <p className={`text-3xl font-black text-cyan-600 dark:text-cyan-400`}>{currentWeather.humidity}%</p>
              </div>
              <div>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>🌧️ RAINFALL</p>
                <p className={`text-3xl font-black text-blue-600 dark:text-blue-400`}>{currentWeather.rainfall}mm</p>
              </div>
            </div>

            {/* Hyperlocal Widgets */}
            <div className="mt-8">
              <h3 className={`text-lg font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>📊 Hyperlocal Weather Indicators</h3>
              <HyperLocalWidgets weather={currentWeather} />
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'forecast' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {forecastData.slice(0, forecastDays).map((day, idx) => (
                <div key={idx} className={`${cardClasses} rounded-2xl p-6 border hover:scale-105 transition-transform`}>
                  <h4 className={`text-xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{day.date}</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="font-bold">Range:</span><span>{day.minTemp}°-{day.maxTemp}°C</span></div>
                    <div className="flex justify-between"><span className="font-bold">Rainfall:</span><span className="text-cyan-600 dark:text-cyan-400">{day.rainfall}mm</span></div>
                    <div className="flex justify-between"><span className="font-bold">Humidity:</span><span className="text-emerald-600 dark:text-emerald-400">{day.humidity}%</span></div>
                    <div className="flex justify-between"><span className="font-bold">Wind:</span><span className="text-purple-600 dark:text-purple-400">{day.windSpeed}km/h</span></div>
                    <div className="flex justify-between"><span className="font-bold">Confidence:</span><span className="text-amber-600 dark:text-amber-400">{day.confidence}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {alertsData && alertsData.length > 0 ? (
              alertsData.map((alert, idx) => (
                <AnimatedAlertCard key={idx} alert={alert} />
              ))
            ) : (
              <div className={`${cardClasses} rounded-2xl p-8 border text-center`}>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>✅ No critical alerts. Conditions are normal.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-8">
            {cropHealthData && (
              <>
                <div className={`${cardClasses} rounded-2xl p-8 border`}>
                  <h3 className={`text-2xl font-black mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Heart className="w-7 h-7 mr-3 text-red-500" />
                    Crop Health Overview
                  </h3>
                  <div className={`text-center py-6 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl mb-8`}>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>Overall District Health</p>
                    <p className="text-5xl font-black bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                      {cropHealthData.overall_score}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(cropHealthData.crop_health).map(([crop, health]) => (
                    <CropHealthCard 
                      key={crop}
                      crop={crop}
                      score={health.score}
                      status={health.status}
                      recommendation={health.recommendation}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'disease' && (
          <div className="space-y-8">
            {diseaseRiskData && (
              <>
                <div className={`${cardClasses} rounded-2xl p-8 border`}>
                  <h3 className={`text-2xl font-black mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Bug className="w-7 h-7 mr-3 text-orange-500" />
                    Disease Risk Forecast
                  </h3>
                  <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    High Risk Days: <span className="font-black text-orange-600 dark:text-orange-400">{diseaseRiskData.high_risk_days}</span>
                  </p>

                  <div className="space-y-6">
                    {diseaseRiskData.disease_forecast.map((day, idx) => (
                      <div key={idx} className={`${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100/30'} rounded-xl p-6 border`}>
                        <h4 className={`text-lg font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          📅 {day.date} | 🌡️ {day.conditions.temperature}°C | 💧 {day.conditions.humidity}% | 🌧️ {day.conditions.rainfall}mm
                        </h4>
                        <div className="space-y-3">
                          {day.diseases.map((disease, didx) => (
                            <DiseaseRiskIndicator key={didx} disease={disease} probability={disease.probability} recommended_crops={disease.affected_crops} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'irrigation' && (
          <div className="space-y-8">
            {irrigationData && irrigationData.length > 0 && (
              <>
                <div className={`${cardClasses} rounded-2xl p-8 border`}>
                  <h3 className={`text-2xl font-black mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Droplet className="w-7 h-7 mr-3 text-blue-500" />
                    Smart Irrigation Scheduling
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100/50'} rounded-xl p-4 border ${isDarkMode ? 'border-blue-700' : 'border-blue-300'}`}>
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} mb-1`}>📊 IRRIGATION DAYS</p>
                      <p className="text-3xl font-black text-blue-600 dark:text-blue-300">
                        {irrigationData.filter(s => s.priority === 'HIGH' || s.priority === 'MEDIUM').length}
                      </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-cyan-900/20' : 'bg-cyan-100/50'} rounded-xl p-4 border ${isDarkMode ? 'border-cyan-700' : 'border-cyan-300'}`}>
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'} mb-1`}>💧 WATER SAVINGS</p>
                      <p className="text-3xl font-black text-cyan-600 dark:text-cyan-300">
                        {(irrigationData.reduce((a, b) => a + b.water_savings, 0) / 1000).toFixed(0)}k m³/ha
                      </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-100/50'} rounded-xl p-4 border ${isDarkMode ? 'border-emerald-700' : 'border-emerald-300'}`}>
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'} mb-1`}>💰 COST SAVINGS</p>
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-300">
                        ₹{irrigationData.reduce((a, b) => a + b.cost_per_hectare, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {irrigationData.map((schedule, idx) => (
                      <IrrigationScheduleCard key={idx} schedule={schedule} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'yield' && (
          <div className="space-y-8">
            {yieldData && (
              <>
                <div className={`${cardClasses} rounded-2xl p-8 border`}>
                  <h3 className={`text-2xl font-black mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Award className="w-7 h-7 mr-3 text-amber-500" />
                    Crop Yield Predictions
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(yieldData.predictions).map(([crop, prediction]) => (
                    <YieldPredictionWidget key={crop} crop={crop} prediction={prediction} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <AdvancedAnalyticsDashboard />
        )}

        {activeTab === 'calendar' && (
          <AgronomicCalendar district={selectedDistrict} />
        )}

        {activeTab === 'heatmap' && (
          <DistrictHeatmapWidget />
        )}
      </div>
    </div>
  );
};

export default WeatherDashboardEnhanced;
