import { fetchFavorites } from "@/utils/actions";
import EmptyList from "@/components/home/empty-list";
import PropertiesList from "@/components/home/properties-list";

export default async function FavoritesPage() {
  const favorites = await fetchFavorites();

  if (favorites.length === 0) {
    return <EmptyList />;
  }

  return <PropertiesList properties={favorites} />;
}
