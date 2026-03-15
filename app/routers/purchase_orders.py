from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import PurchaseOrderCreate
from ..crud import create_purchase_order
from .. import crud

router = APIRouter(prefix="/purchase-orders", tags=["purchase_orders"])


@router.post("/")
def create_po(order: PurchaseOrderCreate, db: Session = Depends(get_db)):
    return create_purchase_order(db, order)

@router.get("/")
def get_purchase_orders(db: Session = Depends(get_db)):

    orders = crud.get_purchase_orders(db)

    return [
        {
            "id": po.id,
            "ref_no": po.ref_no,
            "vendor_id": po.vendor_id,
            "total_amount": po.total_amount,
            "status": po.status
        }
        for po in orders
    ]