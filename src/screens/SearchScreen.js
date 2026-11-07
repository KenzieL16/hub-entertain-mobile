import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { ErrorState, Loading } from '../components/State';
import { useCategories } from '../hooks/useCategories';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';
import { colors } from '../lib/theme';

export default function SearchScreen({ route, navigation }) {
  const { q = '' } = route.params || {};
  const query = q.trim();
  const categories = useCategories();

  const { data, loading, error, reload } = useFetch(
    (signal) =>
      query
        ? api.get('/contents/search', { params: { q: query }, signal })
        : Promise.resolve({ results: [] }),
    [query]
  );

  const results = data?.results || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Navbar navigation={navigation} activeRoute="Search" />

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
          <Text style={styles.breadcrumbCurrent}>Search</Text>
        </View>

        {/* Title */}
        <Text style={styles.pageTitle}>Results for “{query}”</Text>
        <Text style={styles.subtitle}>{results.length} titles found</Text>

        {/* Loading */}
        {loading && <Loading text="Searching titles…" />}

        {/* Error */}
        {error && <ErrorState error={error} onRetry={reload} />}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Tidak ada hasil. Coba judul, nama artis, atau genre lain.
            </Text>
          </View>
        )}

        {/* Grouped by Categories */}
        {!loading && (
          <View style={styles.categoryBlocks}>
            {categories.map((cat) => {
              const items = results.filter((r) => r.category === cat.slug);
              if (!items.length) return null;

              return (
                <View key={cat.slug} style={styles.categoryBlock}>
                  <Text style={styles.categoryTitle}>{cat.pageTitle}</Text>
                  <View style={styles.grid}>
                    {items.map((item) => (
                      <View key={item.id} style={styles.gridItem}>
                        <Card
                          item={item}
                          square={Boolean(cat.square)}
                          showPlay={Boolean(cat.showPlay)}
                          onClick={() => navigation.navigate('Detail', { id: item.id })}
                          width="100%"
                        />
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <Footer />
      </ScrollView>
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 4,
    marginBottom: 20,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.textDim,
    textAlign: 'center',
    lineHeight: 18,
  },
  categoryBlocks: {
    gap: 28,
  },
  categoryBlock: {
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
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
});

