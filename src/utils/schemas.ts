import { z, ZodSchema } from "zod";

export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: "max length is 5" }),
  firstName: z.string().min(2, { message: "성은 2글자 이상 작성해주세요." }),
  lastName: z.string().min(2, { message: "이름은 2글자 이상 작성해주세요." }),
  userName: z.string().min(2, { message: "닉네임은 2글자 이상 작성해주세요." }),
});

export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    throw new Error(errors.join(","));
  }

  return result.data;
}

export const imageSchema = z.object({
  image: validateFile(),
});

function validateFile() {
  const maxUploadSize = 1024 * 1024;
  const acceptedFileTypes = ["image/"];
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize;
    }, "1mb 크기 이하의 파일만 업로드 할 수 있습니다.")
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      );
    }, "이미지 파일만 업로드 할 수 있습니다.");
}

export const propertySchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "제목은 2글자이상으로 작성해주세요.",
    })
    .max(20, {
      message: "제목은 20글자이하로 작성해주세요.",
    }),
  tagline: z
    .string()
    .min(2, {
      message: "요약은 2글자이상으로 작성해주세요.",
    })
    .max(30, {
      message: "요약은 30글자이하로 작성해주세요.",
    }),
  price: z.coerce.number().int().min(0, {
    message: "가격은 0원 이상으로 작성해주세요.",
  }),
  category: z.string(),
  description: z.string().refine(
    (description) => {
      // const wordCount = description.split(" ").length;
      const wordCount = description.replace(" ", "").length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: "설명은 10 ~ 1000글자로 작성해주세요.",
    },
  ),
  country: z.string(),
  guests: z.coerce.number().int().min(0, {
    message: "guest amount must be a positive number.",
  }),
  bedrooms: z.coerce.number().int().min(0, {
    message: "bedrooms amount must be a positive number.",
  }),
  beds: z.coerce.number().int().min(0, {
    message: "beds amount must be a positive number.",
  }),
  baths: z.coerce.number().int().min(0, {
    message: "bahts amount must be a positive number.",
  }),
  amenities: z.string(),
});

export const createReviewSchema = z.object({
  propertyId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
});
