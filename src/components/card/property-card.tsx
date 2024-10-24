/**
 * Created by tkdgu:박상현 on 2024-10-16
 */
import { PropertyCardProps } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import PropertyRating from "@/components/card/property-rating";
import FavoriteToggleButton from "@/components/card/favorite-toggle-button";
import CountryFlagAndName from "@/components/card/country-flag-and-name";

export default function PropertyCard({
  property,
}: {
  property: PropertyCardProps;
}) {
  const { name, image, price, id: propertyId, tagline, country } = property;

  return (
    <article className="group relative">
      <Link href={`/properties/${propertyId}`}>
        <div className="relative mb-2 h-[300px] overflow-hidden rounded-md">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="transform rounded-md object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="mt-1 text-sm font-semibold">
            {name.substring(0, 30)}
          </h3>
          {/*property rating*/}
          <PropertyRating propertyId={propertyId} inPage={false} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {tagline.substring(0, 40)}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <p className="mt-1 text-sm">
            <span className="font-semibold">{formatCurrency(price)}</span>
            night
          </p>
          {/*country and flag*/}
          <CountryFlagAndName countryCode={country} />
        </div>
      </Link>
      <div className="z-5 absolute right-5 top-5">
        {/*favorite toggle button*/}
        <FavoriteToggleButton propertyId={propertyId} />
      </div>
    </article>
  );
}
