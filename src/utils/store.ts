/**
 * Created by tkdgu:박상현 on 2024-10-29
 */
import { Booking } from "@/utils/types";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

type PropertyState = {
  propertyId: string;
  price: number;
  bookings: Booking[];
  range: DateRange | undefined;
};

export const useProperty = create<PropertyState>(() => {
  return {
    propertyId: "",
    price: 0,
    bookings: [],
    range: undefined,
  };
});
