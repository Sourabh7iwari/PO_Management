// Uses Vite proxy: /api/* → http://localhost:8000/*
const API_BASE_URL = "/api";

// Types
export interface Vendor {
  id: number;
  name: string;
  contact: string;
  rating: number;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  unit_price: number;
  stock_level: number;
  category?: string;
}

export interface POLineItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: number;
  ref_no: string;
  vendor_id: number;
  vendor_name?: string;
  total_amount: number;
  status: "Draft" | "Pending" | "Approved" | "Paid" | "Cancelled";
  created_at?: string;
  items?: POLineItem[];
}

export interface POCreatePayload {
  vendor_id: number;
  items: { product_id: number; quantity: number }[];
}

// Mock data
const mockVendors: Vendor[] = [
  { id: 1, name: "Acme Industrial Supply", contact: "john@acme.com", rating: 4.5 },
  { id: 2, name: "Global Parts Co.", contact: "sales@globalparts.com", rating: 4.2 },
  { id: 3, name: "Premier Components Ltd", contact: "info@premier.com", rating: 3.8 },
  { id: 4, name: "TechSource Materials", contact: "orders@techsource.com", rating: 4.7 },
  { id: 5, name: "Reliable Hardware Inc", contact: "support@reliable.com", rating: 4.0 },
];

const mockProducts: Product[] = [
  { id: 1, name: "Steel Bolt M10x40", sku: "SB-M1040", unit_price: 0.45, stock_level: 12000, category: "Fasteners" },
  { id: 2, name: "Copper Wire 2.5mm", sku: "CW-25", unit_price: 3.20, stock_level: 450, category: "Electrical" },
  { id: 3, name: "Hydraulic Cylinder 50mm", sku: "HC-50", unit_price: 189.00, stock_level: 28, category: "Hydraulics" },
  { id: 4, name: "Ball Bearing 6205", sku: "BB-6205", unit_price: 12.50, stock_level: 800, category: "Bearings" },
  { id: 5, name: "Rubber Gasket DN50", sku: "RG-DN50", unit_price: 2.80, stock_level: 3200, category: "Seals" },
  { id: 6, name: "Aluminum Sheet 2mm", sku: "AS-2MM", unit_price: 45.00, stock_level: 15, category: "Raw Material" },
  { id: 7, name: "PLC Controller S7-200", sku: "PLC-S7200", unit_price: 520.00, stock_level: 5, category: "Automation" },
  { id: 8, name: "Safety Valve DN25", sku: "SV-DN25", unit_price: 78.00, stock_level: 42, category: "Valves" },
];

const mockOrders: PurchaseOrder[] = [
  { id: 1, ref_no: "PO-2026-001", vendor_id: 1, vendor_name: "Acme Industrial Supply", total_amount: 2362.50, status: "Paid", created_at: "2026-03-01" },
  { id: 2, ref_no: "PO-2026-002", vendor_id: 2, vendor_name: "Global Parts Co.", total_amount: 890.40, status: "Approved", created_at: "2026-03-05" },
  { id: 3, ref_no: "PO-2026-003", vendor_id: 4, vendor_name: "TechSource Materials", total_amount: 5460.00, status: "Pending", created_at: "2026-03-10" },
  { id: 4, ref_no: "PO-2026-004", vendor_id: 3, vendor_name: "Premier Components Ltd", total_amount: 345.00, status: "Draft", created_at: "2026-03-12" },
  { id: 5, ref_no: "PO-2026-005", vendor_id: 5, vendor_name: "Reliable Hardware Inc", total_amount: 1230.75, status: "Cancelled", created_at: "2026-03-14" },
];

let nextOrderId = 6;

// API functions with mock fallback
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  if (!API_BASE_URL) return null;
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch (e) {
    console.warn("API call failed, using mock data:", e);
    return null;
  }
}

export async function fetchVendors(): Promise<Vendor[]> {
  const data = await apiFetch<Vendor[]>("/vendors/");
  return data ?? mockVendors;
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await apiFetch<Product[]>("/products/");
  return data ?? mockProducts;
}

export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  const data = await apiFetch<PurchaseOrder[]>("/purchase-orders/");
  return data ?? mockOrders;
}

export async function createPurchaseOrder(payload: POCreatePayload): Promise<PurchaseOrder> {
  const data = await apiFetch<PurchaseOrder>("/purchase-orders/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data) return data;

  // Mock creation
  const vendor = mockVendors.find((v) => v.id === payload.vendor_id);
  const items = payload.items.map((item) => {
    const product = mockProducts.find((p) => p.id === item.product_id);
    const unit_price = product?.unit_price ?? 0;
    return {
      product_id: item.product_id,
      product_name: product?.name ?? "",
      quantity: item.quantity,
      unit_price,
      subtotal: unit_price * item.quantity,
    };
  });
  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const total_amount = subtotal * 1.05; // 5% tax

  const newOrder: PurchaseOrder = {
    id: nextOrderId++,
    ref_no: `PO-2026-${String(nextOrderId).padStart(3, "0")}`,
    vendor_id: payload.vendor_id,
    vendor_name: vendor?.name ?? "",
    total_amount: Math.round(total_amount * 100) / 100,
    status: "Draft",
    created_at: new Date().toISOString().split("T")[0],
    items,
  };
  mockOrders.unshift(newOrder);
  return newOrder;
}
