import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createSignupSchema, type SignupFormValues } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';

export function SignupForm() {
  const { t } = useTranslation();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(createSignupSchema(t)),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onSubmit(values: SignupFormValues): Promise<void> {
    setSubmitError(null);
    try {
      await signup(values.email, values.password, values.name);
      navigate('/tasks', { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('auth.signup.errorGeneric'));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <TextField
          label={t('auth.signup.name')}
          type="text"
          autoComplete="name"
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label={t('auth.signup.email')}
          type="email"
          autoComplete="email"
          fullWidth
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label={t('auth.signup.password')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    aria-label={
                      showPassword
                        ? t('auth.signup.hidePassword')
                        : t('auth.signup.showPassword')
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? t('auth.signup.submitting') : t('auth.signup.submit')}
        </Button>
      </Stack>
    </form>
  );
}