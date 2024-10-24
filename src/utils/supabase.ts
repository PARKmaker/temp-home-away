import { createClient } from "@supabase/supabase-js";

const bucket = "temp-home-away";

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string,
);
export const uploadImage = async (image: File) => {
  const timestamp = Date.now();
  const newName = `${timestamp}-${image.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(newName, image, { cacheControl: "3600" });
  // 한글일때 오류

  if (!data) throw new Error("이미지 업로드 실패");

  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};
