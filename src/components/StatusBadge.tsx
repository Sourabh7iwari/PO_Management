import { cn } from "@/lib/utils";

type Status = "Draft" | "Pending" | "Approved" | "Paid" | "Cancelled";

const statusStyles: Record<Status, string> = {
  Draft: "bg-warning/15 text-warning border-warning/30",
  Pending: "bg-warning/15 text-warning border-warning/30",
  Approved: "bg-primary/10 text-primary border-primary/30",
  Paid: "bg-success/15 text-success border-success/30",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
