import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface Base64FileResult {
  name: string;
  base64: string;
  size: number; // in bytes
  type: string;
  lastModified: number;
}

export const toB64 = (file: File): Promise<Base64FileResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      resolve({
        name: file.name,
        base64: base64String,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};



 export const countries = [
  // North America
  "Canada",
  "United States",
  "Mexico",
  "Guatemala",
  "Cuba",
  "Honduras",
  "El Salvador",
  "Nicaragua",
  "Costa Rica",
  "Panama",

  // South America
  "Argentina",
  "Brazil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Peru",
  "Uruguay",
  "Paraguay",
  "Bolivia",
  "Venezuela",

  // Europe
  "United Kingdom",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Portugal",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Poland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Greece",
  "Czech Republic",
  "Hungary",
  "Ireland",
  "Romania"
];

