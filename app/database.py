from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os
import time
import os
import psycopg2


load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://admin:admin123@localhost:5434/po_management"
)

engine = create_engine(DATABASE_URL)

def wait_for_db():
    print("Waiting for PostgreSQL...")
    while True:
        try:
            conn = psycopg2.connect(DATABASE_URL)
            conn.close()
            print("PostgreSQL is ready!")
            break
        except Exception:
            print("PostgreSQL not ready, retrying in 2 seconds...")
            time.sleep(2)
            

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()