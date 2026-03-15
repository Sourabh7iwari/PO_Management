import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { fetchVendors, fetchProducts, createPurchaseOrder, type Product } from "@/lib/api";
import { toast } from "sonner";

interface LineItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  description: string;
}

export default function CreatePO() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: vendors = [] } = useQuery({ queryKey: ["vendors"], queryFn: fetchVendors });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const [vendorId, setVendorId] = useState<number>(0);
  const [items, setItems] = useState<LineItem[]>([{ product_id: 0, quantity: 1, unit_price: 0, description: "" }]);
  const [generatingIdx, setGeneratingIdx] = useState<number | null>(null);

  const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const mutation = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase Order created");
      navigate("/");
    },
    onError: () => toast.error("Failed to create PO"),
  });

  const addRow = () => setItems([...items, { product_id: 0, quantity: 1, unit_price: 0, description: "" }]);

  const removeRow = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof LineItem, value: number | string) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const selectProduct = (idx: number, productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setItems(
        items.map((item, i) =>
          i === idx ? { ...item, product_id: productId, unit_price: product.unit_price, description: item.description } : item
        )
      );
    }
  };

  const generateDescription = async (idx: number) => {
    const product = products.find((p) => p.id === items[idx].product_id);
    if (!product) {
      toast.error("Select a product first");
      return;
    }
    setGeneratingIdx(idx);
    // Simulated AI generation
    await new Promise((r) => setTimeout(r, 1200));
    const desc = `Premium ${product.name} engineered for maximum durability and performance in industrial applications. Meets ISO quality standards with precision manufacturing for reliable, long-lasting use.`;
    updateItem(idx, "description", desc);
    setGeneratingIdx(null);
    toast.success("Description generated");
  };

  const handleSubmit = () => {
    if (!vendorId) { toast.error("Select a vendor"); return; }
    const validItems = items.filter((i) => i.product_id > 0 && i.quantity > 0);
    if (validItems.length === 0) { toast.error("Add at least one product"); return; }
    mutation.mutate({
      vendor_id: vendorId,
      items: validItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
    });
  };

  return (
    <AppLayout
      title="Create Purchase Order"
      actions={
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      }
    >
      <div className="rounded-lg border border-border bg-card">
        {/* Header section */}
        <div className="grid grid-cols-2 gap-6 border-b border-border p-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Vendor</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(Number(e.target.value))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value={0}>Select vendor...</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Line items */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-card-foreground">Line Items</h3>
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-3.5 w-3.5" /> Add Row
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-2 font-medium text-muted-foreground w-[200px]">Product</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Description</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground w-[90px]">Qty</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground w-[100px]">Unit Price</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground w-[100px] text-right">Subtotal</th>
                  <th className="px-3 py-2 w-[40px]"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">
                      <select
                        value={item.product_id}
                        onChange={(e) => selectProduct(idx, Number(e.target.value))}
                        className="h-8 w-full rounded border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value={0}>Select...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="relative">
                        <input
                          value={item.description}
                          onChange={(e) => updateItem(idx, "description", e.target.value)}
                          placeholder="Product description..."
                          className={`h-8 w-full rounded border border-input bg-background px-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${generatingIdx === idx ? "ai-pulse" : ""}`}
                        />
                        <button
                          onClick={() => generateDescription(idx)}
                          disabled={generatingIdx !== null}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                          title="AI Auto-Description"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, "quantity", Math.max(1, Number(e.target.value)))}
                        className="h-8 w-full rounded border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm text-muted-foreground">${item.unit_price.toFixed(2)}</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-sm font-medium text-card-foreground">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => removeRow(idx)} className="text-muted-foreground hover:text-destructive transition-colors" disabled={items.length <= 1}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-border px-5 py-4 flex justify-end">
          <div className="w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-card-foreground border-t border-border pt-1.5">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border px-5 py-3 flex justify-end gap-2">
          <Link to="/">
            <Button variant="outline" size="sm">Cancel</Button>
          </Link>
          <Button size="sm" onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
