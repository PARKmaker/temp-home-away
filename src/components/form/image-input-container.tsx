"use client";

import { actionFunction } from "@/utils/types";
import { useState } from "react";
import { LuUser2 } from "react-icons/lu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FormContainer from "@/components/form/form-container";
import ImageInput from "@/components/form/image-input";
import { SubmitButton } from "@/components/form/buttons";

type ImageInputContainerProps = {
  image: string;
  name: string;
  action: actionFunction;
  text: string;
  children?: React.ReactNode;
};

export default function ImageInputContainer(props: ImageInputContainerProps) {
  const { image, name, action, text } = props;
  const [isFormUpdateVisible, setIsFormUpdateVisible] = useState(false);

  const userIcon = (
    <LuUser2 className="mb-4 h-24 w-24 rounded bg-primary text-white" />
  );

  return (
    <div>
      {image ? (
        <Image
          src={image}
          alt={image}
          width={100}
          height={100}
          className="mb-4 h-24 w-24 rounded object-cover"
        />
      ) : (
        userIcon
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsFormUpdateVisible((prevState) => !prevState)}
      >
        {text}
      </Button>
      {isFormUpdateVisible && (
        <div className="=max-w-lg mt-4">
          <FormContainer action={action}>
            {props.children}
            <ImageInput />
            <SubmitButton size="sm" />
          </FormContainer>
        </div>
      )}
    </div>
  );
}
