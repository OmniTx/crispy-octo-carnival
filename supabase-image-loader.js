export default function supabaseLoader({ src, width, quality }) {
  if (src.startsWith('http') || src.startsWith('/')) {
    return src;
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-imgs/${src}?width=${width}&quality=${quality || 75}`;
}
