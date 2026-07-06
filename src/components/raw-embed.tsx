"use client";

import { useEffect, useRef } from "react";

/**
 * Mounts a third-party "copy this snippet into your site" embed (NeetoChat's
 * widget script, a NeetoForm inline embed, etc). `innerHTML` alone won't run
 * <script> tags, so each one is recreated and re-inserted to execute it.
 */
export function RawEmbed({ html }: { html?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || !html) return;
    container.innerHTML = html;
    const scripts = Array.from(container.querySelectorAll("script"));
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) {
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.text = oldScript.textContent || "";
      oldScript.replaceWith(newScript);
    }
  }, [html]);

  if (!html) return null;
  return <div ref={ref} />;
}
