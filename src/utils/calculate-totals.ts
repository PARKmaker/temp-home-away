/**
 * Created by tkdgu:박상현 on 2024-10-30
 */
import { calculateDaysBetween } from "@/utils/calendar";

type BookingDetail = {
  checkIn: Date;
  checkOut: Date;
  price: number;
};

export function calculateTotals({ checkIn, checkOut, price }: BookingDetail) {
  const totalNights = calculateDaysBetween({ checkIn, checkOut });
  const subTotal = totalNights * price;
  const cleaning = 21;
  const service = 40;
  const tax = subTotal * 0.1;
  const orderTotal = subTotal + cleaning + service + tax;

  return { totalNights, subTotal, cleaning, service, tax, orderTotal };
}
