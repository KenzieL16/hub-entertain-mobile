import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.copyright}>© 2026 HubEntertain</Text>
      <View style={styles.linksRow}>
        {['About us', 'Privacy', 'Terms', 'Help center'].map((t) => (
          <Text key={t} style={styles.linkText}>
            {t}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 48,
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    gap: 12,
  },
  copyright: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  linkText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});

