from sqlalchemy.orm import Session
from . import models
from fastapi import HTTPException
from app.models import PurchaseOrder
from decimal import Decimal
from datetime import datetime
import uuid

def get_vendors(db: Session):
    return db.query(models.Vendor).all()


def get_products(db: Session):
    return db.query(models.Product).all()


def create_purchase_order(db: Session, order):
    

    try:

        if not order.items:
            raise HTTPException(
                status_code=400,
                detail="Order must contain items"
            )

        vendor = db.get(models.Vendor, order.vendor_id)

        if not vendor:
            raise HTTPException(
                status_code=404,
                detail="Vendor not found"
            )


        po = models.PurchaseOrder(
            ref_no = f"PO-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}",
            vendor_id=order.vendor_id,
            status="Pending"
        )

        db.add(po)
        db.flush()

        total = Decimal("0")
        seen_products = set()

        for item in order.items:

            if item.product_id in seen_products:
                raise HTTPException(
                    status_code=400,
                    detail="Duplicate product in order"
                )

            seen_products.add(item.product_id)

            product = db.get(models.Product, item.product_id)

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail="Product not found"
                )

            line_total = Decimal(product.unit_price) * item.quantity
            total += line_total

            db.add(
                models.POLineItem(
                    po_id=po.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price_at_purchase=product.unit_price
                )
            )

        tax = total * Decimal("0.05")
        po.total_amount = total + tax

        db.commit()
        db.refresh(po)

    except Exception:
        db.rollback()
        raise

    return po


def get_purchase_orders(db: Session):
    return db.query(PurchaseOrder).all()