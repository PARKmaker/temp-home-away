/**
 * Created by tkdgu:박상현 on 2024-10-31
 */
import { fetchReservationStats } from "@/utils/actions";
import { formatCurrency } from "@/utils/format";
import StatsCard from "@/components/admin/stats-card";

export default async function Stats() {
  const stats = await fetchReservationStats();

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard title="properties" value={stats.properties} />
      <StatsCard title="nights" value={stats.nights} />
      <StatsCard title="total" value={formatCurrency(stats.amount)} />
    </div>
  );
}
