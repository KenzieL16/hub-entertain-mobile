// Theme definitions matching hub-entertain-web index.css exactly
export const colors = {
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  field: '#F8FAFC',
  soft: '#F1F5F9',
  border: '#E2E8F0',

  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primarySoft: 'rgba(37, 99, 235, 0.1)',
  primarySoftBorder: 'rgba(37, 99, 235, 0.25)',

  text: '#172554',
  textSoft: '#475569',
  textMuted: '#64748B',
  textDim: '#94A3B8',
  gold: '#F59E0B',

  error: '#DC2626',
  errorBg: 'rgba(220, 38, 38, 0.08)',
  errorBorder: 'rgba(220, 38, 38, 0.25)',

  overlayLight: 'rgba(248, 250, 252, 0.85)',
  darkOverlay: 'rgba(15, 23, 42, 0.65)',
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: 14,
    color: colors.textSoft,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    color: colors.textMuted,
  },
  caption: {
    fontSize: 11,
    color: colors.textDim,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.primary,
    textTransform: 'uppercase',
  },
};

