from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import PurchaseOrderCreate
from ..crud import create_purchase_order

router = APIRouter(prefix="/purchase-orders", tags=["purchase_orders"])


@router.post("/")
def create_po(order: PurchaseOrderCreate, db: Session = Depends(get_db)):
    return create_purchase_order(db, order)