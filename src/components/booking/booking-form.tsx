/**
 * Created by tkdgu:박상현 on 2024-10-29
 */
import { useProperty } from "@/utils/store";
import { calculateTotals } from "@/utils/calculate-totals";
import { formatCurrency } from "@/utils/format";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function BookingForm() {
  const { range, price } = useProperty((state) => state);
  const checkIn = range?.from as Date;
  const checkOut = range?.to as Date;
  const { totalNights, subTotal, service, tax, orderTotal, cleaning } =
    calculateTotals({ checkIn, checkOut, price });

  return (
    <Card className="mb-4 p-8">
      <CardTitle className="mb-8">Summary</CardTitle>
      <FormRow label={`$${price} x ${totalNights} 일`} amount={subTotal} />
      <FormRow label={`청소비용`} amount={cleaning} />
      <FormRow label={`서비스 비용`} amount={service} />
      <FormRow label={`수수료`} amount={tax} />
      <Separator className="mt-4" />
      <CardTitle className="mt-8">
        <FormRow label={"Booking Total"} amount={orderTotal} />
      </CardTitle>
    </Card>
  );
}

function FormRow({ label, amount }: { label: string; amount: number }) {
  return (
    <p className="mb-2 flex justify-between text-sm">
      <span>{label}</span>
      <span>{formatCurrency(amount)}</span>
    </p>
  );
}
