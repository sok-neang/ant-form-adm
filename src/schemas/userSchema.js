import { z } from "zod";
const baseFields = {
  name: z
    .string()
    .trim()
    .min(1, "សូមបញ្ចូលឈ្មោះពេញ")
    .max(250, "ឈ្មោះមិនអាចលើសពី 250 តួអក្សរ"),

  email: z
    .email("សូមបញ្ចូលអ៊ីមែលដែលត្រឹមត្រូវ")
    .min(1, "សូមបញ្ចូលអ៊ីមែល")
    .max(250, "អ៊ីមែលមិនអាចលើសពី 250 តួអក្សរ"),

  gender: z
    .string()
    .min(1, "សូមជ្រើសរើសភេទ"),

  role: z
    .string()
    .min(1, "សូមជ្រើសរើសតួនាទី"),

  teachingSubject: z.string().optional(),
};

export const createUserSchema = z
  .object({
    ...baseFields,
  })
  .superRefine((data, ctx) => {
    if (data.role === "TEACHER" && !data.teachingSubject) {
      ctx.addIssue({
        code: "custom",
        path: ["teachingSubject"],
        message: "សូមជ្រើសរើសមុខជំនាញ",
      });
    }
  });

export const editUserSchema = z
  .object({
    ...baseFields,
  })
  .superRefine((data, ctx) => {
    if (data.role === "TEACHER" && !data.teachingSubject) {
      ctx.addIssue({
        code: "custom",
        path: ["teachingSubject"],
        message: "សូមជ្រើសរើសមុខជំនាញ",
      });
    }
  });