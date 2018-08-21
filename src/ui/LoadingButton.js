import React from "react";
import { FaSpinner } from 'react-icons/fa';
import "./LoadingButton.css";

export default (
  {
    isLoading,
    text,
    loadingText,
    className = "",
    disabled = false,
    ...props
  }
) =>
  <button
    className={`LoadingButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <FaSpinner className="spinning" />}
    {!isLoading ? text : loadingText}
  </button>;