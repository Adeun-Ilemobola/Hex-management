// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Base64FileResult, base64ToBlob, FileUploadResult } from './utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)


export async function UploadImage(file: Base64FileResult[], userID: string): Promise<FileUploadResult[]> {
    return new Promise(async (resolve, reject) => {

        if (!file || file.length === 0) {
            reject(new Error('No file provided for upload'));
            return;
        }
        if (!userID) {
            reject(new Error('No path provided for upload'));
            return;
        }

        const newFile: FileUploadResult[] = await Promise.all(
            file.map(async (f) => {
                const path = `${userID}/${Date.now()}-${f.name}`;

                const { data: uploadData, error } = await supabase.storage
                    .from("img")
                    .upload(path, base64ToBlob(f.url, f.type), {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (error) {
                    throw new Error(`Upload failed: ${error.message}`);
                }

                const { data } = supabase
                    .storage
                    .from('img')
                    .getPublicUrl(uploadData.path);


                return {
                    name: f.name,
                    url: data.publicUrl,
                    size: f.size,
                    type: f.type,
                    lastModified: f.lastModified,
                    Thumbnail: f.Thumbnail,
                    supabaseID: uploadData.path

                };
            })
        )
        resolve(newFile);



    })



}



export async function DeleteImages(paths: string[]) {
    const { error } = await supabase.storage.from("img").remove(paths);
    if (error) {
        console.error("Failed to delete images:", error.message);
    }
}


