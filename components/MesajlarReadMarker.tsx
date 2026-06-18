"use client";

import { useEffect, useRef } from "react";
import { markMesajlarReadAction } from "@/lib/user-actions";

export default function MesajlarReadMarker() {
  const marked = useRef(false);

  useEffect(() => {
    if (marked.current) return;
    marked.current = true;
    void markMesajlarReadAction();
  }, []);

  return null;
}
