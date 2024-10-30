/**
 * Created by tkdgu:박상현 on 2024-10-29
 */

"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import { useProperty } from "@/utils/store";
import { Button } from "@/components/ui/button";
import FormContainer from "@/components/form/form-container";
import { SubmitButton } from "@/components/form/buttons";
import { createBookingAction } from "@/utils/actions";

export default function ConfirmBooking() {
  const { userId } = useAuth();
  const { propertyId, range } = useProperty((state) => state);
  const checkIn = range?.from as Date;
  const checkOut = range?.to as Date;

  if (!userId) {
    return (
      <SignInButton mode="modal">
        <Button type="button" className="w-full">
          로그인 후 예약하기
        </Button>
      </SignInButton>
    );
  }

  const createBooking = createBookingAction.bind(null, {
    propertyId,
    checkIn,
    checkOut,
  });

  return (
    <section>
      <FormContainer action={createBooking}>
        <SubmitButton text="예약" className="w-full" />
      </FormContainer>
    </section>
  );
}
