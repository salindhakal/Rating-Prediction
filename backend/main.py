from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd


linear_model = joblib.load("models/linear_model.pkl")
rf_model = joblib.load("models/random_forest_model.pkl")
dt_model = joblib.load("models/decision_tree_model.pkl")
xgb_model = joblib.load("models/xgboost_model.pkl")
svr_model = joblib.load("models/svr_model.pkl")
scaler = joblib.load("models/scaler.pkl")
imputer = joblib.load("models/imputer.pkl")

# Feature list for input validation
selected_features = [
    'crossing', 'finishing', 'heading_accuracy', 'short_passing', 'volleys', 
    'dribbling', 'curve', 'fk_accuracy', 'long_passing', 'ball_control', 
    'reactions', 'jumping', 'stamina', 'strength', 'positioning', 'vision', 
    'composure', 'interceptions', 'defensive_awareness'
]

# Loading dataset
dataset = pd.read_csv("data/player-data-full.csv") 

# Initializing FastAPI app
app = FastAPI()

# Input validation class (Pydantic Model)
class PlayerAttributes(BaseModel):
    crossing: float
    finishing: float
    heading_accuracy: float
    short_passing: float
    volleys: float
    dribbling: float
    curve: float
    fk_accuracy: float
    long_passing: float
    ball_control: float
    reactions: float
    jumping: float
    stamina: float
    strength: float
    positioning: float
    vision: float
    composure: float
    interceptions: float
    defensive_awareness: float

# Helper function for prediction
def calculate_rating(features):
    # Impute and scale features
    features_imputed = imputer.transform(features)
    scaled_features = scaler.transform(features_imputed)
    
    # Predictions from each model
    y_pred_linear = linear_model.predict(scaled_features)
    y_pred_rf = rf_model.predict(scaled_features)
    y_pred_dt = dt_model.predict(scaled_features)
    y_pred_xgb = xgb_model.predict(scaled_features)
    y_pred_svr = svr_model.predict(scaled_features)
    
    # Weights for the models
    weight_linear = 0.05
    weight_rf = 0.2
    weight_dt = 0.05
    weight_xgb = 0.3
    weight_svr = 0.4
    
    # Weighted prediction
    weighted_prediction = (
        weight_linear * y_pred_linear +
        weight_rf * y_pred_rf +
        weight_dt * y_pred_dt +
        weight_xgb * y_pred_xgb +
        weight_svr * y_pred_svr
    )
    return round(weighted_prediction[0], 2)

# Endpoint 1: Direct feature input
@app.post("/predict/by-features")
def predict_by_features(attributes: PlayerAttributes):
    # Convert attributes into a numpy array
    features = np.array([[getattr(attributes, f) for f in selected_features]])
    # Calculate rating
    rating = calculate_rating(features)
    return {"rating": rating}

# Endpoint 2: Search by player name
@app.get("/predict/by-name/{player_name}")
def predict_by_name(player_name: str):
    # Check if the player exists in the dataset
    player_data = dataset[dataset['name'].str.lower() == player_name.lower()]
    if player_data.empty:
        raise HTTPException(status_code=404, detail="Player not found in the dataset.")
    
    # Retrieve player attributes
    player_attributes = player_data[selected_features].values
    if player_attributes.shape[0] > 1:
        raise HTTPException(status_code=400, detail="Multiple players found. Be more specific.")
    
    # Calculate rating
    rating = calculate_rating(player_attributes)
    return {"player_name": player_name, "rating": rating}

