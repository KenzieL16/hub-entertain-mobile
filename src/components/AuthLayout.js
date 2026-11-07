import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../lib/theme';
import Icon from './Icon';

export function Field({
  label,
  icon,
  type = 'text',
  value,
  onChangeText,
  placeholder,
  ...inputProps
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <View style={styles.inputGroup}>
        <View style={styles.iconLeft}>
          <Icon name={icon} size={16} color={colors.textMuted} />
        </View>

        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textDim}
          secureTextEntry={isPassword && !show}
          autoCapitalize={isPassword || type === 'email' ? 'none' : 'words'}
          autoCorrect={false}
          textContentType={
            isPassword ? (label.toLowerCase().includes('confirm') ? 'none' : 'password') : 'none'
          }
          keyboardType={type === 'email' ? 'email-address' : 'default'}
          {...inputProps}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setShow(!show)}
            activeOpacity={0.7}
          >
            <Icon name={show ? 'eye-off' : 'eye'} size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function AuthLayout({
  navigation,
  eyebrow,
  title,
  subtitle,
  tagline,
  children,
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.brand}
              onPress={() => navigation?.navigate('Home')}
              activeOpacity={0.8}
            >
              <View style={styles.logoBox}>
                <Icon name="play" size={16} color="#FFFFFF" filled style={{ marginLeft: 2 }} />
              </View>
              <Text style={styles.brandText}>HubEntertain</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation?.navigate('Home')}
              style={styles.homeBtn}
            >
              <Text style={styles.homeBtnText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Auth Banner Card */}
          <View style={styles.heroCard}>
            <View style={styles.pillBadge}>
              <Icon name="star" size={11} color={colors.primary} />
              <Text style={styles.pillText}>Your next obsession awaits</Text>
            </View>
            <Text style={styles.heroCardTitle}>Great stories. All in one hub.</Text>
            <Text style={styles.heroCardDesc}>
              Discover the films, series, and music that stay with you.
            </Text>
          </View>

          {/* Titles */}
          <View style={styles.titleSection}>
            {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
            <Text style={styles.mainTitle}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Form Body */}
          <View style={styles.formCard}>{children}</View>

          {/* Footer Tagline */}
          {tagline && (
            <View style={styles.footerTagline}>
              <Icon name="clock" size={13} color={colors.textMuted} />
              <Text style={styles.taglineText}>{tagline}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  homeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  homeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSoft,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoftBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 26,
    marginBottom: 6,
  },
  heroCardDesc: {
    fontSize: 13,
    color: colors.textSoft,
    lineHeight: 18,
  },
  titleSection: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.field,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    height: '100%',
  },
  footerTagline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  taglineText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});

