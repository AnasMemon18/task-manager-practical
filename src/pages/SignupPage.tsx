import { Box, Card, CardContent, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { SignupForm } from '../components/auth/SignupForm';

export function SignupPage() {
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
          <Typography variant="h5" component="h1" gutterBottom>
            Create your account
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start organizing your tasks in seconds.
          </Typography>

          <SignupForm />

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" underline="hover">
              Sign in
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}