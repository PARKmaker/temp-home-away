/**
 * Created by tkdgu:박상현 on 2024-10-16
 */
import { FaStar } from "react-icons/fa";

type PropertyRatingProps = { propertyId: string; inPage: boolean };

export default function PropertyRating({
  propertyId,
  inPage,
}: PropertyRatingProps) {
  const rating = 4.7;
  const count = 100;

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
