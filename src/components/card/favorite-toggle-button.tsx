/**
 * Created by tkdgu:박상현 on 2024-10-16
 */
import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "@/components/form/buttons";
import { fetchFavoriteId } from "@/utils/actions";
import FavoriteToggleForm from "@/components/card/favorite-toggle-form";
import { Suspense } from "react";

type FavoriteToggleButtonProps = { propertyId: string };

export default async function FavoriteToggleButton({
  propertyId,
}: FavoriteToggleButtonProps) {
  const { userId } = auth();

  if (!userId) {
    return <CardSignInButton />;
  }

  const favoriteId = await fetchFavoriteId({ propertyId });

  return <FavoriteToggleForm favoriteId={favoriteId} propertyId={propertyId} />;
}
