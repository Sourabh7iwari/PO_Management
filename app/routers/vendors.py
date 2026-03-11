from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..crud import get_vendors

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.get("/")
def list_vendors(db: Session = Depends(get_db)):
    return get_vendors(db)