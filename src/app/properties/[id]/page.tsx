/**
 * Created by tkdgu:박상현 on 2024-10-22
 */
import { fetchPropertyDetails } from "@/utils/actions";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/properties/breadcrumbs";
import FavoriteToggleButton from "@/components/card/favorite-toggle-button";
import ShareButton from "@/components/properties/share-button";
import ImageContainer from "@/components/properties/image-container";
import PropertyRating from "@/components/card/property-rating";
import BookingCalender from "@/components/properties/booking-calender";
import PropertyDetails from "@/components/properties/propertyDetails";
import UserInfo from "@/components/properties/user-info";
import { Separator } from "@/components/ui/separator";
import Description from "@/components/properties/description";
import Amenities from "@/components/properties/amenities";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicMap = dynamic(
  () => import("@/components/properties/property-map"),
  { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> },
);

export default async function PropertyDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await fetchPropertyDetails(params.id);

  if (!property) redirect("/");

  const { baths, bedrooms, beds, guests } = property;
  const details = { baths, bedrooms, beds, guests };

  const firstName = property.profile.firstName;
  const profileImage = property.profile.profileImage;

  return (
    <section>
      <Breadcrumbs name={property.name} />
      <header className="mt-4 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{property.tagline}</h1>
        <div className="flex items-center gap-x-4">
          {/*share button*/}
          <ShareButton propertyId={property.id} name={property.name} />
          <FavoriteToggleButton propertyId={property.id} />
        </div>
      </header>
      <ImageContainer mainImage={property.image} name={property.name} />
      <section className="mt-12 gap-x-12 lg:grid lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-x-4">
            <h1 className="text-xl font-bold">{property.name}</h1>
            <PropertyRating propertyId={property.id} inPage={true} />
          </div>
          <PropertyDetails details={details} />
          <UserInfo profile={{ firstName, profileImage }} />
          <Separator className="mt-4" />
          <Description description={property.description} />
          <Amenities amenities={property.amenities} />
          <DynamicMap countryCode={property.country} />
        </div>
        <div className="flex flex-col items-center lg:col-span-4">
          {/*calender*/}
          <BookingCalender />
        </div>
      </section>
    </section>
  );
}
