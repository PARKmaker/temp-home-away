/**
 * Created by tkdgu:박상현 on 2024-10-31
 */
import Charts from "@/components/admin/charts";
import { fetchChartsData } from "@/utils/actions";

export default async function ChartsContainer() {
  const bookings = await fetchChartsData();

  if (bookings.length < 1) return null;

  return <Charts data={bookings} />;
}
