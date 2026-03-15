import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, ShoppingCart, DollarSign, Clock, CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { fetchPurchaseOrders } from "@/lib/api";

export default function Dashboard() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: fetchPurchaseOrders,
  });

  const stats = {
    total: orders.length,
    totalValue: orders.reduce((s, o) => s + o.total_amount, 0),
    pending: orders.filter((o) => o.status === "Pending" || o.status === "Draft").length,
    paid: orders.filter((o) => o.status === "Paid").length,
  };

  return (
    <AppLayout
      title="Dashboard"
      actions={
        <Link to="/orders/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Create PO
          </Button>
        </Link>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Orders", value: stats.total, icon: ShoppingCart, color: "text-primary" },
          { label: "Total Value", value: `$${stats.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-success" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-warning" },
          { label: "Paid", value: stats.paid, icon: CheckCircle, color: "text-success" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-card-foreground">All Purchase Orders</h2>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Reference</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Vendor</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-card-foreground">{order.ref_no}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.vendor_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.created_at}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-card-foreground">
                      ${order.total_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
