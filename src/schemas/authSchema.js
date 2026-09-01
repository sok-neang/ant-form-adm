import { z } from "zod";
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "សូមបញ្ចូលអុីម៉ែល")
    .email("អុីម៉ែលមិនត្រឹមត្រូវ"),

  password: z
    .string()
    .min(1, "សូមបញ្ចូលពាក្យសម្ងាត់")
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ តួអក្សរ")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
        "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ អក្សរធំ ១, អក្សរតូច ១, លេខ ១ និងសញ្ញាពិសេស ១"
      ),

    confirmNewPassword: z
      .string()
      .min(1, "សូមបញ្ជាក់ពាក្យសម្ងាត់"),
  })
  .refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
      message: "ពាក្យសម្ងាត់មិនដូចគ្នាទេ",
      path: ["confirmNewPassword"],
    }
  );