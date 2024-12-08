"use client";
import { toast } from "sonner";

export const errorToast = (message: string): void => {
  toast.error(message, {
    style: {
      border: "2px solid red", 
      color: "red"
    },
  }
  );
};

export const exitoToast = (message: string): void => {
  toast.success(message, {
    style: {
      border: "2px solid #6EE7B7", 
      color: " #6EE7B7", 
    },
  }
  );
};
