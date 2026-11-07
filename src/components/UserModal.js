import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors } from '../lib/theme';
import Icon from './Icon';

export default function UserModal({ visible, onClose }) {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  if (!user) return null;

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, { paddingTop: insets.top + 55 }]}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.header}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.initials || user.fullName?.slice(0, 2).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.fullName}>{user.fullName}</Text>
                  <Text style={styles.email}>{user.email}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: 240,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primaryHover,
    fontSize: 14,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  fullName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  email: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  logoutBtn: {
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
});

