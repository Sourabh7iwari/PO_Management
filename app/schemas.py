from pydantic import BaseModel
from typing import List


class Vendor(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }

class Product(BaseModel):
    id: int
    name: str
    unit_price: float

    model_config = {
        "from_attributes": True
    }

class POLineItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float


class PurchaseOrderCreate(BaseModel):
    ref_no: str
    vendor_id: int
    items: List[POLineItemCreate]


class PurchaseOrderResponse(BaseModel):
    id: int
    ref_no: str
    total_amount: float
    status: str

    model_config = {
        "from_attributes": True
    }