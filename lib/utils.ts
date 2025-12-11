import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FileXInput } from "./Zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}






function normalizeType(file: File): FileXInput["type"] {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type.includes("pdf")) return "document";
    return "other";
}
function FileToBase64(params: File): Promise<FileXInput> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(params);
        reader.onload = () => {
            const fileX: FileXInput = {
                type: normalizeType(params),
                mime: params.type,
                name: params.name,
                size: params.size,
                link: reader.result as string,
                createdAt: params.lastModified
                    ? new Date(params.lastModified)
                    : new Date(),
                updatedAt: new Date(),
                tags: [],
                path: "",
                id:"",
            };
            resolve(fileX);
        };
        reader.onerror = (error) => reject(error);
    });
}
export async function File_To_FileXList(params: File[]) {
    return Promise.all(params.map((file) => FileToBase64(file)));
}

export function FileX_To_Blub(FileList: FileXInput[]): FileXInput[][] {
    const result: FileXInput[][] = [];
    let temp: FileXInput[] = [];
    const maxTemp = 3;
    FileList.forEach((file, index) => {
        temp.push(file);
        if (temp.length === maxTemp || index === FileList.length - 1) {
            result.push(temp);
            temp = [];
        }
    });
    return result;
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

export function secondsToMilliseconds(params:number | undefined):number{
  if(!params) return 1000 * 62
  return params * 1000
  
}

export function DateToIOS(d: Date | string | undefined): string {
  if(!d) return ""
  const date = new Date(d);
  return date.toISOString();
  
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


export const setThumbnail= "CX-Thumbnail-XC!@#2026";

