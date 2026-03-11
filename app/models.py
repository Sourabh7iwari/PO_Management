from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    contact_email = Column(String)
    rating = Column(Integer)

    purchase_orders = relationship("PurchaseOrder", back_populates="vendor")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String)
    name = Column(String)
    unit_price = Column(Numeric)
    stock_level = Column(Integer)


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True)
    ref_no = Column(String)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    total_amount = Column(Numeric)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    vendor = relationship("Vendor", back_populates="purchase_orders")
    items = relationship(
    "POLineItem",
    back_populates="purchase_order",
    cascade="all, delete-orphan"
)


class POLineItem(Base):
    __tablename__ = "po_line_items"

    id = Column(Integer, primary_key=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price_at_purchase = Column(Numeric)

    purchase_order = relationship("PurchaseOrder", back_populates="items")