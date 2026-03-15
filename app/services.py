from sqlalchemy.orm import Session
from app import crud


def get_purchase_orders(db: Session):
    return crud.get_purchase_orders(db)

