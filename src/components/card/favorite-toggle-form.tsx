/**
 * Created by tkdgu:박상현 on 2024-10-16
 */

"use client";

import { usePathname } from "next/navigation";
import FormContainer from "@/components/form/form-container";
import { CardSubmitButton } from "@/components/form/buttons";
import { toggleFavoriteAction } from "@/utils/actions";

type FavoriteToggleFormProps = {
  favoriteId: string | null;
  propertyId: string;
};

export default function FavoriteToggleForm({
  propertyId,
  favoriteId,
}: FavoriteToggleFormProps) {
  const pathname = usePathname();
  const toggleAction = toggleFavoriteAction.bind(null, {
    propertyId,
    favoriteId,
    pathname,
  });

  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isFavorite={!!favoriteId} />
    </FormContainer>
  );
}
