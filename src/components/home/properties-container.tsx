import { PropertyCardProps } from "@/utils/types";
import { fetchProperties } from "@/utils/actions";
import EmptyList from "@/components/home/empty-list";
import PropertiesList from "@/components/home/properties-list";

type PropertiesContainerProps = {
  category?: string;
  search?: string;
};

export default async function PropertiesContainer({
  category,
  search,
}: PropertiesContainerProps) {
  const properties: PropertyCardProps[] = await fetchProperties({
    category,
    search,
  });

  if (!properties || properties.length === 0) {
    return (
      <EmptyList
        heading="NO results"
        message="Try changing or removing some of your filters."
        btnText="Clear Filters"
      />
    );
  }

  return <PropertiesList properties={properties} />;
}
