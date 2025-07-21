"use client";
import { useEffect, useState } from "react";

const AnimatedValue = ({
  value,
  children,
  className = "",
  animationType = "value-changed",
  hasChanged = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (hasChanged || (prevValue !== undefined && value !== prevValue)) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
    setPrevValue(value);
  }, [value, prevValue, hasChanged]);

  return (
    <span
      className={`${className} ${
        isAnimating ? animationType : ""
      } transition-all duration-300`}
    >
      {children || value}
    </span>
  );
};

export default AnimatedValue;
