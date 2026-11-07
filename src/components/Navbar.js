import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { colors } from '../lib/theme';
import Icon from './Icon';
import SearchModal from './SearchModal';
import UserModal from './UserModal';

export default function Navbar({ navigation, activeRoute = 'Home', activeSlug = null }) {
  const { user } = useAuth();
  const categories = useCategories();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const navLinks = [
    { key: 'all', label: 'All', isAll: true },
    ...categories.map((c) => ({ key: c.slug, label: c.pageTitle, slug: c.slug })),
  ];

  const handleLinkPress = (link) => {
    if (link.isAll) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Category', { slug: link.slug, title: link.label });
    }
  };

  const isLinkActive = (link) => {
    if (link.isAll) return activeRoute === 'Home';
    return activeRoute === 'Category' && activeSlug === link.slug;
  };

  return (
    <View style={styles.wrapper}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Brand */}
        <TouchableOpacity
          style={styles.brand}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <View style={styles.logoBox}>
            <Icon name="play" size={14} color="#FFFFFF" filled style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.brandText}>HubEntertain</Text>
        </TouchableOpacity>

        {/* Right Actions: Search + User/Login */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setSearchOpen(true)}
            activeOpacity={0.7}
            accessibilityLabel="Search"
          >
            <Icon name="search" size={16} color={colors.text} />
          </TouchableOpacity>

          {user ? (
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => setUserModalOpen(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarText}>
                {user.initials || user.fullName?.slice(0, 2).toUpperCase() || 'U'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories Horizontal Tabs */}
      <View style={styles.categoriesBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <TouchableOpacity
                key={link.key}
                style={[styles.categoryTab, active && styles.categoryTabActive]}
                onPress={() => handleLinkPress(link)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryTabText, active && styles.categoryTabTextActive]}>
                  {link.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search Popup Modal */}
      <SearchModal
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectDetail={(id) => navigation.navigate('Detail', { id })}
        onSearchSubmit={(q) => navigation.navigate('Search', { q })}
      />

      {/* User Profile / Logout Dropdown Modal */}
      <UserModal visible={userModalOpen} onClose={() => setUserModalOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: 4,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
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
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryHover,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  categoriesBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.6)',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  categoryTab: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryTabActive: {
    borderBottomColor: colors.primary,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  categoryTabTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
});

