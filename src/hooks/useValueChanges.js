// src/hooks/useValueChanges.js
import { useEffect, useRef, useState } from "react";

export const useValueChanges = (currentData, key) => {
  const prevDataRef = useRef();
  const [changedFields, setChangedFields] = useState(new Set());

  useEffect(() => {
    if (prevDataRef.current && currentData) {
      const newChangedFields = new Set();

      // Compare current data with previous data
      const compareObjects = (current, previous, path = "") => {
        if (typeof current === "object" && current !== null) {
          Object.keys(current).forEach((key) => {
            const currentPath = path ? `${path}.${key}` : key;
            if (current[key] !== previous?.[key]) {
              newChangedFields.add(currentPath);
            }
            if (typeof current[key] === "object") {
              compareObjects(current[key], previous?.[key], currentPath);
            }
          });
        }
      };

      compareObjects(currentData, prevDataRef.current);
      setChangedFields(newChangedFields);

      // Clear the highlight after 3 seconds
      const timer = setTimeout(() => {
        setChangedFields(new Set());
      }, 3000);

      return () => clearTimeout(timer);
    }

    prevDataRef.current = currentData;
  }, [currentData]);

  return changedFields;
};
