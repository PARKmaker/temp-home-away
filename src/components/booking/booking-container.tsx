/**
 * Created by tkdgu:박상현 on 2024-10-29
 */
import { useProperty } from "@/utils/store";
import ConfirmBooking from "@/components/booking/confirm-booking";
import BookingForm from "@/components/booking/booking-form";

export default function BookingContainer() {
  const { range } = useProperty((state) => state);

  if (!range || !range.from || !range.to) return null;
  if (range.from.getTime() === range.to.getTime()) return null;

  return (
    <div className="w-full">
      <BookingForm />
      <ConfirmBooking />
    </div>
  );
}
