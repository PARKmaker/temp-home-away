import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { categories } from "@/utils/categories";
import Link from "next/link";

type CategoriesListProps = {
  category?: string;
  search?: string;
};
export default function CategoriesList({
  search,
  category,
}: CategoriesListProps) {
  const searchTerm = search ? `&search=${search}` : "";
  return (
    <section>
      <ScrollArea className="py-6">
        <div className="flex gap-x-4">
          {categories.map((item) => {
            const isActive =
              item.label === "all" ? !category : item.label === category;
            return (
              <Link
                href={
                  item.label === "all"
                    ? `/?${searchTerm}`
                    : `/?category=${item.label}${searchTerm}`
                }
                key={item.label}
              >
                <article
                  className={`flex w-[100px] cursor-pointer flex-col items-center p-3 duration-300 hover:text-primary ${isActive ? "text-primary" : ""}`}
                >
                  <item.icon className="h-8 w-8" />
                  <p className="mt-1 text-sm capitalize">{item.label}</p>
                </article>
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
