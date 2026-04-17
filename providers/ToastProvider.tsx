"use client";

import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

type ToastProviderProps = {
  children: ReactNode;
};

export default function ToastProvider({ children }: ToastProviderProps) {
  return <>{children}</>;

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2200,
        style: {
          background: "#0f172a",
          color: "#ffffff",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "12px 14px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}