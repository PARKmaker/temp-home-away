/**
 * Created by tkdgu:박상현 on 2024-10-26
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FormContainer from "@/components/form/form-container";
import { createReviewAction } from "@/utils/actions";
import RatingInput from "@/components/form/rating-input";
import TextAreaInput from "@/components/form/textarea-input";
import { SubmitButton } from "@/components/form/buttons";

export default function SubmitReview({ propertyId }: { propertyId: string }) {
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  return (
    <div className="mt-8">
      <Button onClick={() => setIsReviewFormVisible((prevState) => !prevState)}>
        Leave a Review
      </Button>
      {isReviewFormVisible && (
        <Card className="mt-8 p-8">
          <FormContainer action={createReviewAction}>
            <input type="hidden" name="propertyId" value={propertyId} />
            <RatingInput name={"rating"} />
            <TextAreaInput
              name={"comment"}
              labelText="youre thoughts on this property"
              defaultValue="Amazing place !!!"
            />
            <SubmitButton text="Submit" className="mt-4" />
          </FormContainer>
        </Card>
      )}
    </div>
  );
}
