import { Button } from "@/components/ui/button";
import Link from "next/link";

type EmptyListProps = {
  heading?: string;
  message?: string;
  btnText?: string;
};

export default function EmptyList({
  heading = "No item in the list",
  btnText = "back home",
  message = "Keep exploring our properties",
}: EmptyListProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">{heading}</h2>
      <p className="text-lg">{message}</p>
      <Button asChild className="mt-4 capitalize" size="lg">
        <Link href={"/"}>{btnText}</Link>
      </Button>
    </div>
  );
}
