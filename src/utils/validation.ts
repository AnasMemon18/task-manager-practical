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


export const createTaskSchema = (t: TFunction) =>
  z.object({
    title: z
      .string()
      .min(1, t('taskForm.errorTitleRequired'))
      .max(100, t('taskForm.errorTitleTooLong')),
    description: z.string().max(500, t('taskForm.errorDescriptionTooLong')),
    status: z.enum(['Todo', 'In Progress', 'Done']),
    priority: z.enum(['Low', 'Medium', 'High']),
    dueDate: z
      .string()
      .min(1, t('taskForm.errorDueDateRequired'))
      .refine(
        (value) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return new Date(value) >= today;
        },
        { message: t('taskForm.errorDueDatePast') },
      ),
  });


export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;
export type TaskFormValues = z.infer<ReturnType<typeof createTaskSchema>>;

