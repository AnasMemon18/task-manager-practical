import {
  Box,
  Card,
  CardContent,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { LoginForm } from "../components/auth/LoginForm";

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <LanguageSwitcher />
          </Box>
          <Typography variant="h5" component="h1" gutterBottom>
            {t("auth.login.welcome")}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("auth.login.subtitle")}
          </Typography>

          <LoginForm />

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            {t("auth.login.noAccount")}{" "}
            <MuiLink component={Link} to="/signup" underline="hover">
              {t("auth.login.signUpLink")}
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
