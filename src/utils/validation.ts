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


export const createSignupSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t('auth.signup.errorNameRequired'))
      .max(50, t('auth.signup.errorNameTooLong')),
    email: z
      .string()
      .min(1, t('auth.signup.errorEmailRequired'))
      .email(t('auth.signup.errorEmailInvalid')),
    password: z
      .string()
      .min(1, t('auth.signup.errorPasswordRequired'))
      .min(6, t('auth.signup.errorPasswordTooShort')),
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
export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;
export type TaskFormValues = z.infer<typeof taskSchema>;
