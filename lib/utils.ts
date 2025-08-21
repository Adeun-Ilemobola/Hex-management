import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface Base64FileResult {
 supabaseID: string;
  name: string;
  url: string;
  size: number; // in bytes
  type: string;
 lastModified: bigint;
  thumbnail:boolean
}


export interface FileUploadResult {
  supabaseID: string;
  name: string;
  url: string;
  size: number; // in bytes
  type: string;
  lastModified: bigint;
  thumbnail:boolean,
  id:string
}
export interface FileUploadResultImageChat extends FileUploadResult{
  ChatRoomID:string ;
   messageId :string;
    chatOwnerID:string
  
  
}
export type fullFile = FileUploadResultImageChat | FileUploadResult 
export type fullFileList = FileUploadResultImageChat[] | FileUploadResult[] 



export const toB64 = (file: File): Promise<FileUploadResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      resolve({
        name: file.name,
        url: base64String,
        size: file.size,
        type: file.type,
        lastModified: BigInt(file.lastModified),
        thumbnail:false,
        supabaseID: "",
        id:""

      });
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


export function base64ToBlob(base64: string, contentType = ''): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}


export function seatPlan(planType: string): number {
  switch (planType) {
    case 'Premium': return 50;
    case 'Deluxe': return 15;
    case 'Free':
    default: return 3;
  }
}

export function isEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
  
}

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

