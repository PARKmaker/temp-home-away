/**
 * Created by tkdgu:박상현 on 2024-10-23
 */
import { formatQuantity } from "@/utils/format";

type PropertyDetailsProps = {
  details: {
    bedrooms: number;
    baths: number;
    guests: number;
    beds: number;
  };
};

export default function PropertyDetails({
  details: { bedrooms, beds, guests, baths },
}: PropertyDetailsProps) {
  return (
    <p className="text-md font-light">
      <span>{formatQuantity(bedrooms, "bedroom")} &middot; </span>
      <span>{formatQuantity(baths, "bath")} &middot; </span>
      <span>{formatQuantity(guests, "guest")} &middot; </span>
      <span>{formatQuantity(beds, "bed")}</span>
    </p>
  );
}
