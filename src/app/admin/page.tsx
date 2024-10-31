/**
 * Created by tkdgu:박상현 on 2024-10-31
 */
import { Suspense } from "react";
import StatsLoadingContainer, {
  ChartsLoadingContainer,
} from "@/components/admin/loading";
import StatsContainer from "@/components/admin/stats-container";
import ChartsContainer from "@/components/admin/charts-container";

export default function AdminPage() {
  return (
    <>
      <Suspense fallback={<StatsLoadingContainer />}>
        <StatsContainer />
      </Suspense>
      <Suspense fallback={<ChartsLoadingContainer />}>
        <ChartsContainer />
      </Suspense>
    </>
  );
}
