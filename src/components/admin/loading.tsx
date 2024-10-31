/**
 * Created by tkdgu:박상현 on 2024-10-31
 */
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsLoadingContainer() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  );
}

function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-20 w-full rounded" />
      </CardHeader>
    </Card>
  );
}

export function ChartsLoadingContainer() {
  return <Skeleton className="mt-16 h-[300px] w-full rounded" />;
}
