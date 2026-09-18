import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn('Supabase Client Init Warning:', err.message);
  }
}

/**
 * Uploads a file to Supabase Storage if configured, or falls back to local uploads URL.
 * @param {Object} file - Multer file object
 * @param {string} folder - Destination subfolder ('passports', 'reviews', 'tours', 'blog')
 * @returns {Promise<string>} Public URL or relative path to the file
 */
export const uploadFile = async (file, folder = 'passports') => {
  if (!file) return null;

  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // Try Cloud Upload to Supabase Storage if credentials exist
  if (supabase) {
    try {
      let fileBuffer = file.buffer;
      if (!fileBuffer && file.path) {
        fileBuffer = fs.readFileSync(file.path);
      }

      if (fileBuffer) {
        const bucketName = process.env.SUPABASE_BUCKET || 'anditours-uploads';
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, fileBuffer, {
            contentType: file.mimetype,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

          if (publicUrlData?.publicUrl) {
            console.log(`Cloud storage upload success: ${publicUrlData.publicUrl}`);
            return publicUrlData.publicUrl;
          }
        } else if (error) {
          console.warn('Supabase storage upload error, falling back to local storage:', error.message);
        }
      }
    } catch (err) {
      console.warn('Cloud storage exception, using local fallback:', err.message);
    }
  }

  // Fallback to local URL path if file saved to disk by multer
  if (file.filename) {
    return `/uploads/${folder}/${file.filename}`;
  }

  return null;
};
