from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# Secret key for JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")

# Admin credentials
admin_username = "admin"
admin_hashed_password = pwd_context.hash("admin123")

# Load models
linear_model = joblib.load("models/linear_model.pkl")
rf_model = joblib.load("models/random_forest_model.pkl")
dt_model = joblib.load("models/decision_tree_model.pkl")
xgb_model = joblib.load("models/xgboost_model.pkl")
svr_model = joblib.load("models/svr_model.pkl")
scaler = joblib.load("models/scaler.pkl")
imputer = joblib.load("models/imputer.pkl")

# Feature list
selected_features = [
    'crossing', 'finishing', 'heading_accuracy', 'short_passing', 'volleys',
    'dribbling', 'curve', 'fk_accuracy', 'long_passing', 'ball_control',
    'reactions', 'jumping', 'stamina', 'strength', 'positioning', 'vision',
    'composure', 'interceptions', 'defensive_awareness'
]

# Load dataset
dataset_path = "data/player-data-full.csv"
dataset = pd.read_csv(dataset_path)

# Initialize FastAPI
app = FastAPI()

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_admin(username: str, password: str):
    if username == admin_username and verify_password(password, admin_hashed_password):
        return True
    return False

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("sub") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Admin login endpoint
@app.post("/admin/login")
def login_admin(form_data: OAuth2PasswordRequestForm = Depends()):
    if not authenticate_admin(form_data.username, form_data.password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token({"sub": "admin"}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

# Player model
class Player(BaseModel):
    name: str
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

# Admin add player
@app.post("/admin/add-player")
def add_player(player: Player, admin: dict = Depends(get_current_admin)):
    global dataset
    new_player = pd.DataFrame([player.dict()])
    dataset = pd.concat([dataset, new_player], ignore_index=True)
    dataset.to_csv(dataset_path, index=False)
    return {"message": "Player added successfully"}

# Admin update player
@app.put("/admin/update-player/{player_name}")
def update_player(player_name: str, player: Player, admin: dict = Depends(get_current_admin)):
    global dataset
    mask = dataset['name'].str.lower() == player_name.lower()
    if not mask.any():
        raise HTTPException(status_code=404, detail="Player not found")
    dataset.loc[mask, selected_features] = [player.dict()[f] for f in selected_features]
    dataset.to_csv(dataset_path, index=False)
    return {"message": "Player updated successfully"}

# Prediction function
def calculate_rating(features):
    features_imputed = imputer.transform(features)
    scaled_features = scaler.transform(features_imputed)
    y_pred_linear = linear_model.predict(scaled_features)
    y_pred_rf = rf_model.predict(scaled_features)
    y_pred_dt = dt_model.predict(scaled_features)
    y_pred_xgb = xgb_model.predict(scaled_features)
    y_pred_svr = svr_model.predict(scaled_features)
    weighted_prediction = (0.05 * y_pred_linear + 0.2 * y_pred_rf +
                           0.05 * y_pred_dt + 0.3 * y_pred_xgb +
                           0.4 * y_pred_svr)
    return round(weighted_prediction[0], 2)

# Predict by features
@app.post("/predict/by-features")
def predict_by_features(attributes: Player):
    print("Received attributes:", attributes.model_dump())
    features = np.array([[getattr(attributes, f) for f in selected_features]])
    rating = calculate_rating(features)
    return {"rating": rating, "attributes": attributes.model_dump()}

# Predict by player name
@app.get("/predict/by-name/{player_name}")
def predict_by_name(player_name: str):
    player_data = dataset[dataset['name'].str.lower() == player_name.lower()]
    if player_data.empty:
        raise HTTPException(status_code=404, detail="Player not found in the dataset.")
    player_attributes = player_data[selected_features].values
    if player_attributes.shape[0] > 1:
        raise HTTPException(status_code=400, detail="Multiple players found. Be more specific.")
    rating = calculate_rating(player_attributes)
    player_info = player_data [selected_features].iloc[0].to_dict()  #player attributes to dictionary
    return {"player_name": player_name, "rating": rating, "attributes": player_info}
