# NeuraWeather - AI-Powered Weather Prediction Platform 🌦️

A production-ready machine learning weather prediction system with an interactive React dashboard for Tamil Nadu agricultural advisory.

## Features

✅ **ML-Powered Predictions** - 4 trained models (LightGBM, CatBoost) for rainfall and temperature  
✅ **Real-time API** - Flask REST API serving live predictions  
✅ **Dynamic Dashboard** - React UI with live data fetching  
✅ **District-Based Forecasts** - Predictions for 7 Tamil Nadu districts  
✅ **Agricultural Advisory** - AI-generated crop recommendations  
✅ **Analytics Dashboard** - Model performance metrics and trends  
✅ **Dark Mode** - Built-in theme toggle  
✅ **Responsive Design** - Works on desktop, tablet, mobile  

## Tech Stack

- **Backend**: Flask 3.0, Python 3.8+
- **Frontend**: React 19, Tailwind CSS, Recharts
- **ML Models**: LightGBM, CatBoost, scikit-learn
- **Data Processing**: pandas, numpy

## Project Structure

```
Weather_prediction_model/
├── app.py                      # Flask API backend
├── requirements.txt            # Python dependencies
├── package.json               # Node.js dependencies
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
│
├── models/                    # Trained ML models
│   ├── rainfall_model_lgbm.pkl
│   ├── temperature_model_lgbm.pkl
│   ├── rainfall_category_model_catboost.pkl
│   └── rain_amount_model_lgbm.pkl
│
├── src/                       # React frontend
│   ├── WeatherDashboard.js   # Main component
│   ├── App.js
│   ├── index.js
│   └── Dashboard.css
│
├── public/                    # Static files
├── package-lock.json
├── postcss.config.js
└── tailwind.config.js
```

## Quick Start

### Prerequisites
- Python 3.8+ 
- Node.js 14+
- pip (Python package manager)

### Installation

1. **Clone/Setup**
   ```bash
   cd Weather_prediction_model
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

### Running the Application



Terminal 1 - Backend:
```bash
python app.py
# Server running on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
npm start
# Opens http://localhost:3000
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Get Districts
```
GET /api/districts
```

### Weather Forecast
```
GET /api/weather/forecast?district=Chennai&days=7
```

### Current Weather
```
GET /api/weather/current?district=Chennai
```

### Agricultural Advisory
```
GET /api/weather/advisory?district=Chennai
```

### Weather Analytics
```
GET /api/weather/analytics?district=Chennai&days=7
```

## Available Districts

- Chennai
- Coimbatore
- Madurai
- Salem
- Tiruchirappalli
- Vellore
- Tirunelveli

## Dashboard Tabs

### 🧠 Neural Forecast
- 7-day weather cards with detailed metrics
- Rainfall prediction charts
- Temperature dynamics
- Current weather overview

### 📊 AI Analytics
- Model performance metrics
- Accuracy trends
- Processing load indicators
- Active models count

### 🌾 Smart Advisory
- Crop-specific recommendations
- Priority levels (High/Medium/Low)
- Confidence scores
- Real-time alerts

## Configuration

### Change Backend Port
Edit `app.py` (line ~206):
```python
app.run(debug=True, port=5001)  # Change 5000 to desired port
```

### Change Frontend Port
```bash
PORT=3001 npm start
```

## Trained Models

| Model | Type | Purpose |
|-------|------|---------|
| `temperature_model_lgbm.pkl` | LightGBM | Temperature prediction |
| `rainfall_model_lgbm.pkl` | LightGBM | Rainfall amount prediction |
| `rainfall_category_model_catboost.pkl` | CatBoost | Rainfall classification |
| `rain_amount_model_lgbm.pkl` | LightGBM | Detailed rainfall forecast |

## Features

- **Real-time Updates**: Data updates instantly when district changes
- **Error Handling**: Graceful fallback to sample data if API unavailable
- **Loading States**: Beautiful skeleton screens while fetching
- **Responsive Charts**: Interactive visualizations with Recharts
- **Dark Mode**: Built-in light/dark theme toggle
- **Export**: Generate PDF reports
- **Alerts**: Send SMS notifications (placeholder)

## Troubleshooting

### "Failed to fetch forecast data"
- Ensure Flask backend is running on port 5000
- Check browser console for detailed error

### "Address already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### "ModuleNotFoundError: No module named 'flask'"
```bash
pip install -r requirements.txt
```

### Port conflicts
Change port in `app.py` or set environment variable `PORT=3001 npm start`

## Development

### Backend Development
- Models are in `models/` folder
- API endpoints in `app.py`
- Add new endpoints as needed
- Models load at startup

### Frontend Development
- Main component: `src/WeatherDashboard.js`
- Styling: `src/Dashboard.css`
- Uses Tailwind CSS for styling
- Hot reload enabled by default

## Deployment

### Using start_all.bat/start_all.sh
Best for development and testing on your machine

### Production Deployment
1. Install dependencies on server
2. Run with production server (gunicorn, uwsgi)
3. Use environment variables for configuration
4. Enable HTTPS
5. Consider Docker containerization

## Testing the API

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Get districts
curl http://localhost:5000/api/districts

# Get forecast
curl "http://localhost:5000/api/weather/forecast?district=Chennai&days=7"
```

## System Requirements

- **Minimum**: 2GB RAM, 500MB disk space
- **Recommended**: 4GB RAM, 1GB disk space
- **Python**: 3.8 or higher
- **Node.js**: 14 or higher

## Dependencies Installed

### Python (Backend)
- Flask 3.0.0 - Web framework
- Flask-CORS 4.0.0 - Cross-origin requests
- joblib 1.3.2 - Model serialization
- pandas 2.0.3 - Data processing
- numpy 1.24.3 - Numerical computing
- scikit-learn 1.3.0 - ML utilities
- LightGBM 4.0.0 - Gradient boosting
- CatBoost 1.2.2 - Gradient boosting
- python-dateutil 2.8.2 - Date utilities

### Node.js (Frontend)
- React 19.1.1 - UI library
- Recharts 3.1.0 - Charting
- Tailwind CSS 3.4.17 - Styling
- Lucide React 0.536.0 - Icons

## Future Enhancements

- [ ] Real weather API integration
- [ ] Database for historical data
- [ ] User authentication
- [ ] SMS/Email notifications
- [ ] Mobile app
- [ ] Model retraining pipeline
- [ ] Cloud deployment

## License

Tamil Nadu Agricultural University

## Credits

**Developed by**: Rijja H & Rohith Varshighan S  
**Institution**: Tamil Nadu Agricultural University  
**Platform**: NeuraWeather AI  

## Support

For issues or questions:
1. Check this README
2. Check browser console (F12)
3. Check terminal logs
4. Verify all dependencies are installed

---

## Getting Started Summary

1. Install Python & Node.js
2. Run `pip install -r requirements.txt`
3. Run `npm install`
4. Run `start_all.bat` (Windows) or `./start_all.sh` (Mac/Linux)
5. Open `http://localhost:3000`
6. Select a district and enjoy! 🌦️

**Happy forecasting!** 🤖
