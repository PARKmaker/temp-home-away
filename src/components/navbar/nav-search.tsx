"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SEARCH = "search";

function NavSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(
    searchParams.get(SEARCH)?.toString() || "",
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(SEARCH, value);
    } else {
      params.delete(SEARCH);
    }

    replace(`/?${params.toString()}`);
  }, 500);

  useEffect(() => {
    if (!searchParams.get(SEARCH)) {
      setSearch("");
    }
  }, [searchParams]);

  return (
    <Input
      type="text"
      placeholder="검색해서 예약하기..."
      className="max-w-xs dark:bg-muted"
      value={search}
      onChange={(event) => {
        setSearch(event.target.value);
        handleSearch(event.target.value);
      }}
    />
  );
}

export default NavSearch;
