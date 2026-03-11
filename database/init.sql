-- Vendors Table
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    rating INT CHECK (rating >= 1 AND rating <= 5)
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    stock_level INT DEFAULT 0
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    ref_no VARCHAR(50) UNIQUE NOT NULL,
    vendor_id INT REFERENCES vendors(id),
    total_amount NUMERIC(10,2),
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PO Line Items
CREATE TABLE po_line_items (
    id SERIAL PRIMARY KEY,
    po_id INT REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price_at_purchase NUMERIC(10,2)
);

-- seeding the database with sample data

-- Vendors
INSERT INTO vendors (name, contact_email, rating) VALUES
('ABC Electronics', 'sales@abc.com', 5),
('Global Tech Supplies', 'contact@globaltech.com', 4),
('Prime Industrial', 'info@primeindustrial.com', 3);

-- Products
INSERT INTO products (sku, name, unit_price, stock_level) VALUES
('LAP-001', 'Laptop', 50000, 20),
('MOU-001', 'Wireless Mouse', 500, 200),
('KEY-001', 'Mechanical Keyboard', 3000, 100),
('MON-001', '24 inch Monitor', 12000, 50);