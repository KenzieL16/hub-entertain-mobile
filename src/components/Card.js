import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../lib/theme';
import Icon from './Icon';

export default function Card({ item, square = false, showPlay = false, onClick, width = 160 }) {
  if (!item) return null;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { width }]}
      onPress={onClick}
      activeOpacity={0.85}
    >
      <View style={[styles.posterWrapper, square ? styles.posterSquare : styles.posterStandard]}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.posterImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>{item.title?.slice(0, 2).toUpperCase()}</Text>
          </View>
        )}

        {/* Rating Badge */}
        {item.rating !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.badgeText}>{item.rating}</Text>
          </View>
        )}

        {/* Floating Play Button */}
        {showPlay && (
          <View style={styles.playFab}>
            <Icon name="play" size={13} color="#FFFFFF" filled style={{ marginLeft: 2 }} />
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {item.subtitle || `${item.year || ''} ${item.genre ? '• ' + item.genre : ''}`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 16,
    marginBottom: 4,
  },
  posterWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  posterStandard: {
    aspectRatio: 2 / 3,
  },
  posterSquare: {
    aspectRatio: 1 / 1,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 24,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  star: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  playFab: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});

