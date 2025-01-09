import { COLORS } from './colors';
import { fontConfig } from './fonts';
import { configureFonts, MD3LightTheme } from 'react-native-paper';
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.PRIMARY,
    onPrimary: COLORS.BACKGROUND,
    primaryContainer: COLORS.PRIMARY_LIGHT,
    onPrimaryContainer: COLORS.PRIMARY_DARK,
    secondary: COLORS.SECONDARY,
    onSecondary: COLORS.BACKGROUND,
    secondaryContainer: COLORS.SECONDARY_LIGHT,
    onSecondaryContainer: COLORS.SECONDARY_DARK,
    tertiary: COLORS.PRIMARY_DARK,
    onTertiary: COLORS.BACKGROUND,
    background: COLORS.BACKGROUND,
    onBackground: COLORS.TEXT_PRIMARY,
    surface: COLORS.CARD_BACKGROUND,
    onSurface: COLORS.TEXT_PRIMARY,
    surfaceVariant: COLORS.BACKGROUND,
    onSurfaceVariant: COLORS.TEXT_SECONDARY,
    error: COLORS.ERROR,
    onError: COLORS.BACKGROUND,
  },
  fonts: configureFonts({config: fontConfig}),
};