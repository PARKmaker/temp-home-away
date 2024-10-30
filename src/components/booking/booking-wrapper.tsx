/**
 * Created by tkdgu:박상현 on 2024-10-29
 */

"use client";

import { Booking } from "@/utils/types";
import { useEffect } from "react";
import { useProperty } from "@/utils/store";
import BookingCalender from "@/components/booking/booking-calender";
import BookingContainer from "@/components/booking/booking-container";

type BookingWrapperProps = {
  propertyId: string;
  price: number;
  bookings: Booking[];
};

export default function BookingWrapper({
  price,
  propertyId,
  bookings,
}: BookingWrapperProps) {
  useEffect(() => {
    useProperty.setState({
      propertyId,
      bookings,
      price,
    });
  }, []);

  return (
    <>
      <BookingCalender />
      <BookingContainer />
    </>
  );
}
