import { LuTent } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Logo() {
  return (
    <Button asChild={true} size="icon">
      <Link href="/">
        <LuTent className="h-6 w-6" />
      </Link>
    </Button>
  );
}
