
import { createClient } from '@supabase/supabase-js';

// Provided Supabase credentials
const supabaseUrl = 'https://cnuzucreklrwpsmkamhd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNudXp1Y3Jla2xyd3BzbWthbWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjA4NjYsImV4cCI6MjA4MTU5Njg2Nn0.j3K8w5knN0Kug1qrJWEcW5XPjJRtVbzvdtCIYo4dhi0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 */
export const uploadAsset = async (file: File | Blob, path: string): Promise<string> => {
  const BUCKET_NAME = 'stallion-assets';
  
  // Clean filename for storage
  const timestamp = Date.now();
  const rawFileName = path.split('/').pop() || 'file';
  const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  
  // Determine extension and content type
  let extension = 'bin';
  let contentType = file.type || 'application/octet-stream';
  
  if (contentType.includes('pdf')) {
    extension = 'pdf';
  } else if (contentType.includes('image/')) {
    extension = contentType.split('/')[1] || 'png';
  }
  
  const finalPath = `uploads/${timestamp}-${cleanFileName}.${extension}`;

  console.log(`[Supabase Storage] Attempting upload: ${finalPath} (${file.size} bytes)`);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(finalPath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType
    });

  if (error) {
    console.error('[Supabase Storage Error]', error);
    throw new Error(`Upload Failed: ${error.message}. Ensure bucket "${BUCKET_NAME}" is public and policies are set.`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(finalPath);

  console.log(`[Supabase Storage] Success: ${publicUrl}`);
  return publicUrl;
};

/**
 * Converts DataURI (Base64) to Blob for Supabase storage.
 * Uses Uint8Array for high compatibility with large PDF files.
 */
export const dataURIToBlob = (dataURI: string): Blob => {
  try {
    const parts = dataURI.split(',');
    if (parts.length < 2) throw new Error('Input is not a valid DataURI string');
    
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const b64Data = parts[1];
    
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    const sliceSize = 1024;

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mime });
  } catch (err) {
    console.error('[Blob Conversion Error]', err);
    throw new Error('Critical error processing file data for upload.');
  }
};
