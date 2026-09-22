import { Box, Card, CardContent, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SignupForm } from '../components/auth/SignupForm';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function SignupPage() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <LanguageSwitcher />
          </Box>

          <Typography variant="h5" component="h1" gutterBottom>
            {t('auth.signup.title')}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('auth.signup.subtitle')}
          </Typography>

          <SignupForm />

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            {t('auth.signup.haveAccount')}{' '}
            <MuiLink component={Link} to="/login" underline="hover">
              {t('auth.signup.signInLink')}
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}