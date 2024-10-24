import CategoriesList from "@/components/home/categories-list";
import PropertiesContainer from "@/components/home/properties-container";
import { Suspense } from "react";
import LoadingCards from "@/components/card/loading-cards";

export default function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  return (
    <section>
      <CategoriesList
        category={searchParams.category}
        search={searchParams.search}
      />
      <Suspense fallback={<LoadingCards />}>
        <PropertiesContainer
          category={searchParams.category}
          search={searchParams.search}
        />
      </Suspense>
    </section>
  );
}
