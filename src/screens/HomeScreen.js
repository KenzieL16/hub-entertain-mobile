import React from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import Navbar from '../components/Navbar';
import { ErrorState, Loading } from '../components/State';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';
import { colors } from '../lib/theme';

export default function HomeScreen({ navigation }) {
  const { data, loading, error, reload } = useFetch(
    (signal) => api.get('/home', { params: { limit: 10 }, signal }),
    []
  );

  const goDetail = (id) => {
    navigation.navigate('Detail', { id });
  };

  const goCategory = (slug, title) => {
    navigation.navigate('Category', { slug, title });
  };

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Navbar navigation={navigation} activeRoute="Home" />
        <ErrorState error={error} onRetry={reload} />
      </SafeAreaView>
    );
  }

  if (!data && loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Navbar navigation={navigation} activeRoute="Home" />
        <Loading text="Loading HubEntertain…" />
      </SafeAreaView>
    );
  }

  const hero = data?.hero;
  const sections = data?.sections || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Navbar navigation={navigation} activeRoute="Home" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={reload} colors={[colors.primary]} />
        }
      >
        {/* HERO BANNER */}
        {hero && (
          <View style={styles.heroContainer}>
            <Image
              source={hero.image ? { uri: hero.image } : require('../../assets/hero.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            {/* Dark gradient overlay simulation */}
            <View style={styles.heroGradientOverlay} />

            <View style={styles.heroContent}>
              <View style={styles.pillBadge}>
                <Icon name="star" size={10} color={colors.primary} />
                <Text style={styles.pillText}>#1 Trending this week</Text>
              </View>

              <Text style={styles.heroTitle}>{hero.title}</Text>

              <View style={styles.heroMeta}>
                <Text style={styles.heroRating}>★ {hero.rating}</Text>
                {[hero.year, hero.duration, hero.genre, hero.rated]
                  .filter(Boolean)
                  .map((t, i) => (
                    <React.Fragment key={i}>
                      <Text style={styles.heroDot}>•</Text>
                      <Text style={styles.heroMetaText}>{t}</Text>
                    </React.Fragment>
                  ))}
              </View>

              <Text style={styles.heroSynopsis} numberOfLines={3}>
                {hero.synopsis}
              </Text>

              <View style={styles.heroButtons}>
                <TouchableOpacity
                  style={styles.btnPrimarySm}
                  onPress={() => goDetail(hero.id)}
                  activeOpacity={0.8}
                >
                  <Icon name="play" size={13} color="#FFFFFF" filled style={{ marginLeft: 2 }} />
                  <Text style={styles.btnPrimarySmText}>Watch Trailer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnLight}
                  onPress={() => goDetail(hero.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnLightArrow}>↗</Text>
                  <Text style={styles.btnLightText}>Explore movie</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sliderControl}>
                <Text style={styles.sliderPage}>01/04</Text>
                <View style={styles.sliderTrack}>
                  <View style={styles.sliderThumb} />
                </View>
                <Text style={styles.sliderArrow}>&gt;</Text>
              </View>
            </View>
          </View>
        )}

        {/* SECTIONS */}
        <View style={styles.sectionsContainer}>
          {sections.map((section) => (
            <View key={section.slug} style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <TouchableOpacity
                  onPress={() => goCategory(section.slug, section.title)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllText}>View all →</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                data={section.items}
                keyExtractor={(item) => String(item.id)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsScroll}
                renderItem={({ item }) => (
                  <Card
                    item={item}
                    square={Boolean(section.square)}
                    showPlay={Boolean(section.showPlay)}
                    onClick={() => goDetail(item.id)}
                    width={section.square ? 140 : 150}
                  />
                )}
              />
            </View>
          ))}
        </View>

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
    paddingBottom: 24,
  },
  heroContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    height: 440,
    position: 'relative',
    backgroundColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
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
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 32,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  heroRating: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  heroDot: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  heroMetaText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
  },
  heroSynopsis: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnPrimarySm: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  btnPrimarySmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  btnLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnLightArrow: {
    fontSize: 14,
    color: colors.text,
  },
  btnLightText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  sliderControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    marginTop: 14,
  },
  sliderPage: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sliderTrack: {
    width: 32,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  sliderThumb: {
    width: 8,
    height: 2,
    backgroundColor: colors.primary,
  },
  sliderArrow: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionsContainer: {
    marginTop: 28,
    gap: 32,
  },
  sectionBlock: {
    paddingLeft: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  cardsScroll: {
    paddingRight: 16,
    paddingVertical: 4,
  },
});

