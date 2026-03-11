from sqlalchemy.orm import Session
from . import models
from .services import calculate_total
from fastapi import HTTPException

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

        existing_po = db.query(models.PurchaseOrder).filter(
            models.PurchaseOrder.ref_no == order.ref_no
        ).first()

        if existing_po:
            raise HTTPException(
                status_code=400,
                detail="Purchase order reference already exists"
            )

        po = models.PurchaseOrder(
            ref_no=order.ref_no,
            vendor_id=order.vendor_id,
            status="Pending"
        )

        db.add(po)
        db.flush()

        total = 0
        seen_products = set()

        for item in order.items:

            if item.product_id in seen_products:
                raise HTTPException(
                    status_code=400,
                    detail="Duplicate product in order"
                )

            seen_products.add(item.product_id)

            if item.quantity <= 0:
                raise HTTPException(
                    status_code=400,
                    detail="Quantity must be positive"
                )

            product = db.get(models.Product, item.product_id)

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item.product_id} not found"
                )

            line_total = product.unit_price * item.quantity
            total += line_total

            db.add(
                models.POLineItem(
                    po_id=po.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price_at_purchase=product.unit_price
                )
            )

        tax = round(total * 0.05, 2)
        po.total_amount = total + tax

        db.commit()
        db.refresh(po)

    except Exception:
        db.rollback()
        raise

    return po