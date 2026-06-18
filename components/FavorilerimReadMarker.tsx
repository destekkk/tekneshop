"use client";

import { useEffect, useRef } from "react";
import { markFavorilerimReadAction } from "@/lib/user-actions";

export default function FavorilerimReadMarker() {
  const marked = useRef(false);

  useEffect(() => {
    if (marked.current) return;
    marked.current = true;
    void markFavorilerimReadAction();
  }, []);

  return null;
}
