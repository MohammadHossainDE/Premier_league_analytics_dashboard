

import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-env")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
AUTO_SNAPSHOT_ENABLED = os.getenv("AUTO_SNAPSHOT_ENABLED", "true").lower() == "true"
AUTO_SNAPSHOT_INTERVAL_MINUTES = int(os.getenv("AUTO_SNAPSHOT_INTERVAL_MINUTES", "60"))
