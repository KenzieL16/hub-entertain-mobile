import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { ErrorState, Loading } from '../components/State';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';
import { colors } from '../lib/theme';

const SORTS = {
  rating: 'Top rated',
  newest: 'Newest',
  title: 'A – Z',
};

export default function CategoryScreen({ route, navigation }) {
  const { slug } = route.params || { slug: 'movies' };
  const [sort, setSort] = useState('rating');
  const [genre, setGenre] = useState('All');
  const [sortModalOpen, setSortModalOpen] = useState(false);

  const { data, loading, error, reload } = useFetch(
    (signal) =>
      api.get(`/categories/${slug}`, {
        params: {
          genre: genre === 'All' ? undefined : genre,
          sort,
          limit: 100,
        },
        signal,
      }),
    [slug, genre, sort]
  );

  if (error && error.status === 404) {
    navigation.navigate('Home');
    return null;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Navbar navigation={navigation} activeRoute="Category" activeSlug={slug} />
        <ErrorState error={error} onRetry={reload} />
      </SafeAreaView>
    );
  }

  const cat = data?.category;
  const genres = data?.genres || [];
  const items = data?.items || [];
  const total = data?.pagination?.total ?? items.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Navbar navigation={navigation} activeRoute="Category" activeSlug={slug} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.breadcrumbLink}>Home</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}> &gt; </Text>
          <Text style={styles.breadcrumbCurrent}>{cat?.pageTitle || 'Category'}</Text>
        </View>

        {/* Category Header */}
        <View style={styles.headerRow}>
          <View style={styles.titleInfo}>
            <Text style={styles.pageTitle}>{cat?.pageTitle || 'Category'}</Text>
            <Text style={styles.description}>
              {cat?.description || ''}{' '}
              <Text style={styles.totalBadge}>• {total} titles</Text>
            </Text>
          </View>

          {/* Sort Selector Button */}
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.sortBtnText}>{SORTS[sort] || 'Sort'}</Text>
            <Text style={styles.sortArrow}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* Genre Chips Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {['All', ...genres].map((g) => {
            const active = g === genre;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setGenre(g)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Loading Indicator */}
        {loading && !data && <Loading text="Loading content…" />}

        {/* 2-Column Grid */}
        <View style={styles.grid}>
          {items.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <Card
                item={item}
                square={Boolean(cat?.square)}
                showPlay={Boolean(cat?.showPlay)}
                onClick={() => navigation.navigate('Detail', { id: item.id })}
                width="100%"
              />
            </View>
          ))}
        </View>

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada judul di genre ini.</Text>
          </View>
        )}

        <Footer />
      </ScrollView>

      {/* Sort Selection Modal */}
      <Modal visible={sortModalOpen} transparent animationType="fade" onRequestClose={() => setSortModalOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setSortModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Sort by</Text>
                {Object.entries(SORTS).map(([key, label]) => {
                  const active = sort === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.sortOption, active && styles.sortOptionActive]}
                      onPress={() => {
                        setSort(key);
                        setSortModalOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.sortOptionText, active && styles.sortOptionTextActive]}>
                        {label}
                      </Text>
                      {active && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  breadcrumbLink: {
    fontSize: 12,
    color: colors.textMuted,
  },
  breadcrumbSeparator: {
    fontSize: 12,
    color: colors.textDim,
  },
  breadcrumbCurrent: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  titleInfo: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 4,
  },
  totalBadge: {
    color: colors.textDim,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  sortArrow: {
    fontSize: 10,
    color: colors.textMuted,
  },
  chipsScroll: {
    paddingVertical: 6,
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSoft,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.textDim,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortOptionActive: {
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
  },
  sortOptionText: {
    fontSize: 14,
    color: colors.textSoft,
  },
  sortOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  checkmark: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});

