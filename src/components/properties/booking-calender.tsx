/**
 * Created by tkdgu:박상현 on 2024-10-23
 */

"use client";

import { DateRange } from "react-day-picker";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function BookingCalender() {
  const currentDate = new Date();
  const defaultSelected: DateRange = {
    from: undefined,
    to: undefined,
  };

  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

  return (
    <Calendar
      id="test"
      mode="range"
      defaultMonth={currentDate}
      selected={range}
      onSelect={setRange}
    />
  );
}
