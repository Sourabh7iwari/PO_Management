import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { fetchVendors } from "@/lib/api";

export default function VendorsList() {
  const { data: vendors = [], isLoading } = useQuery({ queryKey: ["vendors"], queryFn: fetchVendors });

  return (
    <AppLayout title="Vendors">
      <div className="rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-2.5 font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-2.5 font-medium text-muted-foreground">Contact</th>
                <th className="px-4 py-2.5 font-medium text-muted-foreground">Rating</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-card-foreground">{v.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.contact}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-card-foreground">{v.rating}</span>
                    </div>
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
