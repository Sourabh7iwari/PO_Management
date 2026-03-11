from fastapi import FastAPI
from .routers import vendors, products, purchase_orders
from fastapi.middleware.cors import CORSMiddleware
from .database import wait_for_db

app = FastAPI(
    title="Purchase Order Management API",
    version="1.0"
)

wait_for_db()  # Ensure DB is ready before starting the app

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vendors.router)
app.include_router(products.router)
app.include_router(purchase_orders.router)


@app.get("/")
def health_check():
    return {"status": "API running"}