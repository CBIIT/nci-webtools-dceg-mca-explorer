import { useEffect } from "react";

export default function SwaggerLandmarkLabeler() {
  useEffect(() => {
    const assignRegionLabels = () => {
      const tables = document.querySelectorAll('table.responses-table[role="region"]');
      tables.forEach((table, index) => {
        // If already labeled, skip
        if (table.hasAttribute("aria-label") || table.hasAttribute("aria-labelledby")) return;

        // Assign unique aria-label
        table.setAttribute("aria-label", `Response Table ${index + 1}`);
      });
    };

    // Run once initially
    assignRegionLabels();

    // Use MutationObserver to re-apply if Swagger re-renders
    const observer = new MutationObserver(assignRegionLabels);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
