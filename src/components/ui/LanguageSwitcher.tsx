import { Select, MenuItem, FormControl, Box } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useLanguage } from '../../hooks/useLanguage';
import type { LanguageCode } from '../../i18n';

interface LanguageSwitcherProps {
  size?: 'small' | 'medium';
}

export function LanguageSwitcher({ size = 'small' }: LanguageSwitcherProps) {
  const { currentLanguage, availableLanguages, changeLanguage } = useLanguage();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TranslateIcon fontSize="small" sx={{ color: 'text.secondary' }} />
      <FormControl size={size} variant="standard">
        <Select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value as LanguageCode)}
          disableUnderline
          inputProps={{ 'aria-label': 'Select language' }}
          sx={{ fontSize: 14, minWidth: 90 }}
        >
          {availableLanguages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}