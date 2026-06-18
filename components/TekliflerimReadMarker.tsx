"use client";

import { useEffect, useRef } from "react";
import { markTekliflerimReadAction } from "@/lib/user-actions";

export default function TekliflerimReadMarker() {
  const marked = useRef(false);

  useEffect(() => {
    if (marked.current) return;
    marked.current = true;
    void markTekliflerimReadAction();
  }, []);

  return null;
}
