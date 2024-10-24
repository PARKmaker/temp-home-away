import { PropertyCardProps } from "@/utils/types";
import PropertyCard from "@/components/card/property-card";

type PropertiesListProps = {
  properties: PropertyCardProps[];
};

export default function PropertiesList({ properties }: PropertiesListProps) {
  return (
    <section className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => {
        return <PropertyCard key={property.id} property={property} />;
      })}
    </section>
  );
}
