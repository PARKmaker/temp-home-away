/**
 * Created by tkdgu:박상현 on 2024-10-30
 */
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingTable({ rows }: { rows?: number }) {
  const tableRows = Array.from({ length: rows || 5 }, (_, i) => {
    return (
      <div className="mb-4" key={i}>
        <Skeleton className="h-8 w-full rounded" />
      </div>
    );
  });
  return <>{tableRows}</>;
}
