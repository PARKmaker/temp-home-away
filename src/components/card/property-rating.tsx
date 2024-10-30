/**
 * Created by tkdgu:박상현 on 2024-10-16
 */
import { FaStar } from "react-icons/fa";
import { fetchPropertyRating } from "@/utils/actions";

type PropertyRatingProps = { propertyId: string; inPage: boolean };

export default async function PropertyRating({
  propertyId,
  inPage,
}: PropertyRatingProps) {
  const { rating, count } = await fetchPropertyRating(propertyId);

  if (count === 0) return null;

  const className = `flex gap-1 items-center ${inPage ? "text-md" : "text-xs"}`;
  const countText = count > 1 ? "reviews" : "review";
  const countValue = `(${count}) ${inPage ? countText : ""}`;

  return (
    <span className={className}>
      <FaStar className="h-3 w-3" />
      {rating} {countValue}
    </span>
  );
}
