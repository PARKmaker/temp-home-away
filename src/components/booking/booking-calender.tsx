/**
 * Created by tkdgu:박상현 on 2024-10-29
 */
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  defaultSelected,
  generateBlockedPeriods,
  generateDateRange,
  generateDisabledDates,
} from "@/utils/calendar";
import { Calendar } from "@/components/ui/calendar";
import { useProperty } from "@/utils/store";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function BookingCalender() {
  const currentDate = new Date();
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
  const bookings = useProperty((state) => state.bookings);
  const { toast } = useToast();

  const blockedPeriods = generateBlockedPeriods({
    bookings,
    today: currentDate,
  });

  const unavailableDates = generateDisabledDates(blockedPeriods);

  useEffect(() => {
    const selectedRange = generateDateRange(range);
    const isDisableDateIncluded = selectedRange.some((date) => {
      if (unavailableDates[date]) {
        setRange(defaultSelected);
        toast({
          description:
            "선택한 날짜중 일부는 예약되었습니다. 다시 선택해주세요.",
        });
        return true;
      }
      return false;
    });

    useProperty.setState({ range });
  }, [range]);

  return (
    <Card className="mb-4">
      <Calendar
        mode="range"
        defaultMonth={currentDate}
        selected={range}
        onSelect={setRange}
        disabled={blockedPeriods}
      ></Calendar>
    </Card>
  );
}
