import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { fetchProducts } from "@/lib/api";

export default function ProductsList() {
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  return (
    <AppLayout title="Products">
      <div className="rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-2.5 font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-2.5 font-medium text-muted-foreground">SKU</th>
                <th className="px-4 py-2.5 font-medium text-muted-foreground text-right">Unit Price</th>
                <th className="px-4 py-2.5 font-medium text-muted-foreground text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium text-card-foreground">{p.name}</span>
                      {p.category && <span className="ml-2 text-xs text-muted-foreground">{p.category}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3 text-right text-card-foreground">${p.unit_price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={p.stock_level < 20 ? "text-destructive font-medium" : "text-card-foreground"}>
                      {p.stock_level.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
}
