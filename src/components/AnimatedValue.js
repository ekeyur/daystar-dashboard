"use client";
import { useEffect, useState, useRef } from "react";

const AnimatedValue = ({
  value,
  children,
  className = "",
  animationType = "value-changed",
  hasChanged = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevValueRef.current = value;
      return;
    }

    // Only animate if value actually changed and it's not undefined/null
    if (
      prevValueRef.current !== undefined &&
      value !== undefined &&
      value !== prevValueRef.current &&
      value !== null &&
      prevValueRef.current !== null
    ) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);

      prevValueRef.current = value;

      return () => clearTimeout(timer);
    }

    prevValueRef.current = value;
  }, [value]);

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
