// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import {  FileX_To_Blub } from './utils'
import { FileXInput } from './ZodObject'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function sanitizeFilename(name: string): string {
    return name
        .replace(/\s+/g, "_")       // replace spaces with underscores
        .replace(/[:]/g, "-")       // replace colons with dashes
        .replace(/[^a-zA-Z0-9._-]/g, ""); // remove invalid characters
}


type UploadOptions = {
    userID: string;
    isChat: boolean;
};

export async function FilesToCloud(files: FileXInput[] , { userID, isChat }: UploadOptions): Promise<FileXInput[]> {
    if (userID === "") {
        throw new Error("UserID is required for file upload.");
    }
    const filesToUpload = FileX_To_Blub(files);
    const uploadedFiles: FileXInput[] = [];
    const pathPrefix = isChat ? `${userID}/chat/` : `${userID}/`;
    for (const fileChunk of filesToUpload) {
        const uploadPromises = fileChunk.map(async (file) => {
        const path: string = `${pathPrefix}${Date.now()}-${sanitizeFilename(file.name)}`;
        const { data: uploadData, error } = await supabase.storage.from("img").upload(path, base64ToBlob(file.link, file.mime));
        if (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
        const publicUrl = supabase.storage.from("img").getPublicUrl(uploadData.path).data.publicUrl;
        const fileX: FileXInput = {
            type: file.type,
            mime: file.mime,
            name: file.name,
            size: file.size,
            link: publicUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: [],
            path: path,
            id: "",
            chatRoomID: "",
            chatOwnerID: "",
            messageId: "",
        };
        return fileX;
        });
        await Promise.all(uploadPromises).then((results) => {
            uploadedFiles.push(...results);
        });

    }
    return uploadedFiles

}

// export function UploadImage({ userID, file , patHex = "notChat" }: UploadImageOptions ): Promise<FileUploadResult | FileUploadResultImageChat> {
//     return new Promise(async (resolve, reject) => {

//         if (!file) {
//             reject(new Error('No file provided for upload'));
//             return;
//         }
//         if (!userID) {
//             reject(new Error('No path provided for upload'));
//             return;
//         }
//         function newPath() {
//             if (patHex === "chat") {
//                 return `${userID}/chat/${Date.now()}-${sanitizeFilename(file.name)}`;
//             }
//             return `${userID}/${Date.now()}-${sanitizeFilename(file.name)}`;
//         }
//         // const path = `${userID}/${Date.now()}-${sanitizeFilename(file.name)}`;
//         const { data: uploadData, error } = await supabase.storage.from("img").upload(newPath(), base64ToBlob(file.url, file.type));
//         if (error) {
//             throw new Error(`Upload failed: ${error.message}`);
//         }
//         const publicUrl = supabase.storage.from("img").getPublicUrl(uploadData.path).data.publicUrl;
//         resolve({
//             name: file.name,
//             url: publicUrl,
//             size: file.size,
//             type: file.type,
//             lastModified: file.lastModified,
//             thumbnail: file.thumbnail,
//             supabaseID: uploadData.path,
//             id:""

//         });

//     })


// }

// function chunkArray<T>(array: T[], size: number): T[][] {
//     const result: T[][] = [];
//     for (let i = 0; i < array.length; i += size) {
//         result.push(array.slice(i, i + size));
//     }
//     return result;
// }
        // export function UploadImageList(files: FileUploadResult[] | FileUploadResultImageChat[], userID: string , patHex: 'chat'|"notChat"): Promise<FileUploadResult[] | FileUploadResultImageChat[]> {
        //     return new Promise(async (resolve) => {
        //         const uploadedImages: FileUploadResult[] = [];

        //         for (const chunk of chunkArray(files, 3)) {
        //             const chunkResult = await Promise.allSettled(chunk.map(f => UploadImage({userID, file: f, patHex: patHex})));
        //             for (const result of chunkResult) {
        //                 if (result.status === "fulfilled") {
        //                     uploadedImages.push(result.value);
        //                 } else {
        //                     console.error("Image upload failed:", result.reason);
        //                 }
        //             }
        //             await new Promise(res => setTimeout(res, 200));
        //         }
        //         resolve(uploadedImages);

        //     })
        // }

function base64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
}


export async function DeleteImages(paths: string[]) {
    const { error } = await supabase.storage.from("img").remove(paths);
    if (error) {
        console.error("Failed to delete images:", error.message);
    }
}


