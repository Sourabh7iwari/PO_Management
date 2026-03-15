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

-- Purchase Orders
INSERT INTO purchase_orders (ref_no, vendor_id, total_amount, status, created_at) VALUES
('PO-1001', 1, 0, 'Pending', '2026-03-01 10:00:00'),
('PO-1002', 2, 0, 'Pending', '2026-03-02 11:30:00'),
('PO-1003', 3, 0, 'Pending', '2026-03-03 09:15:00');

-- PO Line Items
INSERT INTO po_line_items (po_id, product_id, quantity, price_at_purchase) VALUES
-- PO-1001 for ABC Electronics
(1, 1, 2, 50000),  -- 2 Laptops
(1, 2, 5, 500),    -- 5 Wireless Mice
(1, 3, 1, 3000),   -- 1 Mechanical Keyboard

-- PO-1002 for Global Tech Supplies
(2, 2, 10, 500),   -- 10 Wireless Mice
(2, 4, 2, 12000),  -- 2 Monitors

-- PO-1003 for Prime Industrial
(3, 1, 1, 50000),  -- 1 Laptop
(3, 3, 2, 3000),   -- 2 Mechanical Keyboards
(3, 4, 1, 12000);  -- 1 Monitor

-- Update total_amount in purchase_orders based on line items
UPDATE purchase_orders
SET total_amount = sub.total
FROM (
    SELECT po_id, SUM(quantity * price_at_purchase) AS total
    FROM po_line_items
    GROUP BY po_id
) AS sub
WHERE purchase_orders.id = sub.po_id;