import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signupSchema, type SignupFormValues } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';

export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onSubmit(values: SignupFormValues): Promise<void> {
    setSubmitError(null);
    try {
      await signup(values.email, values.password, values.name);
      navigate('/tasks', { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Signup failed.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <TextField
          label="Name"
          type="text"
          autoComplete="name"
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </Stack>
    </form>
  );
}