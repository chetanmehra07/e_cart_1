import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class db_class:
    engine = create_engine(os.getenv("DATABASE_URL"))
    Session = sessionmaker(bind=engine)

