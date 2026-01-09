import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPlate(value: string): string {
  const upper = value.toUpperCase();
  const clean = upper.replace(/[^A-Z0-9]/g, '');
  const limited = clean.slice(0, 7);
  
  if (limited.length >= 5) {
     const fifthChar = limited[4];
     if (/[0-9]/.test(fifthChar)) {
       return `${limited.slice(0, 3)}-${limited.slice(3)}`;
     }
  }
  
  return limited;
}

export function isValidPlate(plate: string): boolean {
  const oldPattern = /^[A-Z]{3}-\d{4}$/;
  const mercosulPattern = /^[A-Z]{3}\d[A-Z]\d{2}$/;
  
  return oldPattern.test(plate) || mercosulPattern.test(plate);
}
