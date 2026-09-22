import { z } from "zod";
import type { TFunction } from 'i18next';

export const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z
      .string()
      .min(1, t('auth.login.errorEmailRequired'))
      .email(t('auth.login.errorEmailInvalid')),
    password: z.string().min(1, t('auth.login.errorPasswordRequired')),
  });



export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long"),
  status: z.enum(["Todo", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(
      (value) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(value) >= today;
      },
      { message: "Due date cannot be in the past" },
    ),
});

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;
