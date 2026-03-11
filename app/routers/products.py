from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..crud import get_products

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def list_products(db: Session = Depends(get_db)):
    return get_products(db)