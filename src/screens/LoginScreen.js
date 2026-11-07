import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthLayout, { Field } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { colors } from '../lib/theme';

export default function LoginScreen({ route, navigation }) {
  const { user, login } = useAuth();
  const from = route?.params?.from || 'Home';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect
  if (user) {
    navigation.replace('Home');
    return null;
  }

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password, rememberMe });
      navigation.navigate(from);
    } catch (err) {
      setError(err?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      navigation={navigation}
      eyebrow="Good to see you again"
      title="Welcome back."
      subtitle="Your world of entertainment is waiting."
      tagline="Your favorites. Your world. Securely yours."
    >
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Field
        label="Email"
        icon="mail"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <Field
        label="Password"
        icon="lock"
        type="password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
      />

      {/* Remember Me & Forgot Password */}
      <View style={styles.optionsRow}>
        <View style={styles.rememberRow}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: '#CBD5E1', true: colors.primary }}
            thumbColor="#FFFFFF"
            style={styles.switch}
          />
          <Text style={styles.rememberText}>Remember Me</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}
      >
        <Text style={styles.submitBtnText}>
          {submitting ? 'Logging in…' : '→ Login'}
        </Text>
      </TouchableOpacity>

      {/* Switch to Register */}
      <View style={styles.switchRow}>
        <Text style={styles.switchNote}>New to HubEntertain? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.7}
        >
          <Text style={styles.switchLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  rememberText: {
    fontSize: 13,
    color: colors.textSoft,
  },
  forgotText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.65,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchNote: {
    fontSize: 13,
    color: colors.textMuted,
  },
  switchLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
});

