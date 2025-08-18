// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import {  base64ToBlob, FileUploadResult } from './utils'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function sanitizeFilename(name: string): string {
    return name
        .replace(/\s+/g, "_")       // replace spaces with underscores
        .replace(/[:]/g, "-")       // replace colons with dashes
        .replace(/[^a-zA-Z0-9._-]/g, ""); // remove invalid characters
}

interface UploadImageOptions {
    userID: string;
    file: FileUploadResult;
    patHex:'chat'|"notChat"
}
// interface UploadImageOptionsConstructor {
//     userID: string;
//     file: FileUploadResult[];
//     patHex:'chat'|"notChat"
// }

export function UploadImage({ userID, file , patHex = "notChat" }: UploadImageOptions ): Promise<FileUploadResult> {
    return new Promise(async (resolve, reject) => {

        if (!file) {
            reject(new Error('No file provided for upload'));
            return;
        }
        if (!userID) {
            reject(new Error('No path provided for upload'));
            return;
        }
        function newPath() {
            if (patHex === "chat") {
                return `${userID}/chat/${Date.now()}-${sanitizeFilename(file.name)}`;
            }
            return `${userID}/${Date.now()}-${sanitizeFilename(file.name)}`;
        }
        // const path = `${userID}/${Date.now()}-${sanitizeFilename(file.name)}`;
        const { data: uploadData, error } = await supabase.storage.from("img").upload(newPath(), base64ToBlob(file.url, file.type));
        if (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
        const publicUrl = supabase.storage.from("img").getPublicUrl(uploadData.path).data.publicUrl;
        resolve({
            name: file.name,
            url: publicUrl,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            thumbnail: file.thumbnail,
            supabaseID: uploadData.path,
            id:""

        });

    })


}

function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export function UploadImageList(files: FileUploadResult[], userID: string , patHex: 'chat'|"notChat"): Promise<FileUploadResult[]> {
    return new Promise(async (resolve) => {
        const uploadedImages: FileUploadResult[] = [];

        for (const chunk of chunkArray(files, 3)) {
            const chunkResult = await Promise.allSettled(chunk.map(f => UploadImage({userID, file: f, patHex: patHex})));
            for (const result of chunkResult) {
                if (result.status === "fulfilled") {
                    uploadedImages.push(result.value);
                } else {
                    console.error("Image upload failed:", result.reason);
                }
            }
            await new Promise(res => setTimeout(res, 200));
        }

        resolve(uploadedImages);

    })

}



export async function DeleteImages(paths: string[]) {
    const { error } = await supabase.storage.from("img").remove(paths);
    if (error) {
        console.error("Failed to delete images:", error.message);
    }
}


