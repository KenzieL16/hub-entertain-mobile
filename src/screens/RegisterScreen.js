import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthLayout, { Field } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { colors } from '../lib/theme';

export default function RegisterScreen({ navigation }) {
  const { user, register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    navigation.replace('Home');
    return null;
  }

  const handleSubmit = async () => {
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ fullName, email, password });
      navigation.navigate('Home');
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      navigation={navigation}
      eyebrow="The good stuff starts here"
      title="Find your next favorite."
      subtitle="Create your account. A whole world of entertainment, all in one place."
      tagline="Free to discover. Yours to explore."
    >
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Field
        label="Full Name"
        icon="user"
        placeholder="Your full name"
        value={fullName}
        onChangeText={setFullName}
      />

      <Field
        label="Email"
        icon="mail"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <Field
        label="Password"
        icon="lock"
        type="password"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.passwordHint}>Use at least 8 characters with a number.</Text>

      <Field
        label="Confirm Password"
        icon="lock"
        type="password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}
      >
        <Text style={styles.submitBtnText}>
          {submitting ? 'Creating account…' : '→ Register'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimerText}>
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </Text>

      <View style={styles.switchRow}>
        <Text style={styles.switchNote}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.switchLink}>Login</Text>
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
  passwordHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: -8,
    marginBottom: 16,
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
  disclaimerText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
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

