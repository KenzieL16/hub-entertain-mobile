import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import Navbar from '../components/Navbar';
import { ErrorState, Loading } from '../components/State';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';
import { timeAgo } from '../lib/format';
import { colors } from '../lib/theme';

const MAX_REVIEW = 1000;
const PAGE_SIZE = 5;
const EMPTY_SUMMARY = { count: 0, average: 0 };

const Stars = ({ value }) => (
  <Text style={styles.starsBlue}>
    {'★'.repeat(value)}
    <Text style={styles.starsEmpty}>{'☆'.repeat(Math.max(0, 5 - value))}</Text>
  </Text>
);

function ReviewCard({ rev, onEdit, onDelete }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {rev.user?.avatar || rev.user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </Text>
          </View>
          <View>
            <Text style={styles.reviewUserName}>
              {rev.user?.name}
              {rev.isMine ? ' (you)' : ''}
            </Text>
            <Text style={styles.reviewDate}>
              {timeAgo(rev.createdAt)}
              {rev.edited ? ' • edited' : ''}
            </Text>
          </View>
        </View>
        <Stars value={rev.rating || 5} />
      </View>

      {rev.title ? <Text style={styles.reviewTitle}>{rev.title}</Text> : null}
      <Text style={styles.reviewComment}>{rev.comment}</Text>

      {rev.isMine && (
        <View style={styles.reviewActions}>
          <TouchableOpacity onPress={() => onEdit(rev)} style={styles.actionBtn}>
            <Text style={styles.actionBtnEditText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(rev)} style={styles.actionBtn}>
            <Text style={styles.actionBtnDeleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { user } = useAuth();

  const { data, loading, error, reload } = useFetch(
    (signal) => api.get(`/contents/${id}`, { signal }),
    [id]
  );

  const [isFavorite, setIsFavorite] = useState(false);

  // Reviews state
  const userKey = user?.id ?? 'guest';
  const [rv, setRv] = useState({
    key: null,
    reviews: [],
    summary: EMPTY_SUMMARY,
    pagination: null,
    mine: null,
  });
  const reviewsLoading = rv.key !== userKey;
  const { reviews, summary, pagination } = rv;
  const mine = reviewsLoading ? null : rv.mine;

  useEffect(() => {
    let cancelled = false;
    api.get(`/contents/${id}/reviews`, { params: { page: 1, limit: PAGE_SIZE } })
      .then((d) => {
        if (!cancelled && d) {
          setRv({
            key: userKey,
            reviews: d.reviews || [],
            summary: d.summary || EMPTY_SUMMARY,
            pagination: d.pagination,
            mine: d.myReview ?? null,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRv({
            key: userKey,
            reviews: [],
            summary: EMPTY_SUMMARY,
            pagination: null,
            mine: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, userKey]);

  // Load more reviews
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMore = async () => {
    if (!pagination || loadingMore) return;
    setLoadingMore(true);
    try {
      const d = await api.get(`/contents/${id}/reviews`, {
        params: { page: pagination.page + 1, limit: PAGE_SIZE },
      });
      if (d) {
        setRv((s) => ({
          ...s,
          reviews: [...s.reviews, ...(d.reviews || [])],
          summary: d.summary || s.summary,
          pagination: d.pagination,
        }));
      }
    } finally {
      setLoadingMore(false);
    }
  };

  // Review Form & Draft
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const base = editing ? mine : null;
  const rating = draft.rating ?? base?.rating ?? 5;
  const text = draft.text ?? base?.comment ?? '';
  const setRating = (val) => setDraft((d) => ({ ...d, rating: val }));
  const setText = (val) => setDraft((d) => ({ ...d, text: val }));

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const startEdit = () => {
    setDraft({ rating: mine?.rating, text: mine?.comment });
    setFormError('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft({});
    setFormError('');
  };

  const submitReview = async () => {
    setFormError('');
    if (!text.trim()) {
      setFormError('Please enter your review text.');
      return;
    }

    setSubmitting(true);
    try {
      const body = { rating, comment: text.trim() };
      if (editing && mine) {
        const d = await api.patch(`/reviews/${mine.id}`, body);
        setRv((s) => ({
          ...s,
          reviews: s.reviews.map((r) => (r.id === mine.id ? d.review : r)),
          summary: d.summary,
          mine: d.review,
        }));
      } else {
        const d = await api.post(`/contents/${id}/reviews`, body);
        setRv((s) => ({
          ...s,
          reviews: [d.review, ...s.reviews],
          summary: d.summary,
          mine: d.review,
        }));
      }
      setEditing(false);
      setDraft({});
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = (rev) => {
    Alert.alert('Delete Review', 'Are you sure you want to delete your review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const d = await api.delete(`/reviews/${rev.id}`);
            setRv((s) => ({
              ...s,
              reviews: s.reviews.filter((r) => r.id !== rev.id),
              summary: d?.summary || EMPTY_SUMMARY,
              mine: null,
            }));
            setEditing(false);
            setDraft({});
            setFormError('');
          } catch (err) {
            setFormError(err.message);
          }
        },
      },
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: item?.title || 'HubEntertain',
        message: `Check out ${item?.title || 'this title'} on HubEntertain!`,
      });
    } catch {}
  };

  if (error && error.status === 404) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Navbar navigation={navigation} activeRoute="Detail" />
        <View style={styles.notFoundBox}>
          <Text style={styles.notFoundText}>This title could not be found.</Text>
          <TouchableOpacity
            style={styles.backHomeBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backHomeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Navbar navigation={navigation} activeRoute="Detail" />
        <ErrorState error={error} onRetry={reload} />
      </SafeAreaView>
    );
  }

  const item = data?.content;
  if (!item || loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Navbar navigation={navigation} activeRoute="Detail" />
        <Loading text="Loading title details…" />
      </SafeAreaView>
    );
  }

  const hasMore = pagination && pagination.page < pagination.pages;
  const showMine = user && mine && !editing;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Navbar navigation={navigation} activeRoute="Detail" />

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
          <Text style={styles.breadcrumbCurrent}>{item.title}</Text>
        </View>

        {/* Player Container */}
        <View style={styles.playerContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.playerImage}
            resizeMode="cover"
          />
          <View style={styles.playerOverlay} />

          {/* Top Bar */}
          <View style={styles.playerBarTop}>
            <Text style={styles.playerBarTag}>OFFICIAL TRAILER</Text>
            {item.badge ? <Text style={styles.playerBadge}>{item.badge}</Text> : null}
          </View>

          {/* Center Play Button */}
          <View style={styles.playerCenter}>
            <TouchableOpacity
              style={styles.playBig}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Trailer', `Playing trailer for ${item.title}`)}
            >
              <Icon name="play" size={26} color="#FFFFFF" filled style={{ marginLeft: 3 }} />
            </TouchableOpacity>
            <Text style={styles.trailerLabel}>Watch Trailer • {item.trailerTime}</Text>
          </View>

          {/* Bottom Bar */}
          <View style={styles.playerBarBottom}>
            <Icon name="volume" size={16} color="#FFFFFF" />
            <Text style={styles.trailerTimeText}>0:00 / {item.trailerTime}</Text>
          </View>
        </View>

        {/* Title & Meta Header */}
        <View style={styles.headerSection}>
          <Text style={styles.eyebrow}>{item.tag || 'FEATURED'}</Text>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{item.year}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{item.duration || item.info}</Text>
          </View>

          {/* Genre Pills */}
          <View style={styles.genrePills}>
            {item.genres?.map((g) => (
              <View key={g} style={styles.genrePill}>
                <Text style={styles.genrePillText}>{g}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.btnSoft, isFavorite && styles.btnSoftActive]}
              onPress={() => setIsFavorite(!isFavorite)}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnSoftIcon, isFavorite && styles.btnSoftIconActive]}>
                {isFavorite ? '♥' : '♡'}
              </Text>
              <Text style={[styles.btnSoftText, isFavorite && styles.btnSoftTextActive]}>
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSoft} onPress={handleShare} activeOpacity={0.7}>
              <Icon name="share" size={14} color={colors.text} />
              <Text style={styles.btnSoftText}>Share</Text>
            </TouchableOpacity>

            <View style={styles.ratingBox}>
              <Text style={styles.ratingStar}>☆</Text>
              <View>
                <Text style={styles.ratingScore}>{item.rating}</Text>
                <Text style={styles.ratingsCount}>{item.ratingsCount}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Synopsis & Credits */}
        <View style={styles.detailsBlock}>
          {item.tagline ? <Text style={styles.tagline}>{item.tagline}</Text> : null}
          <Text style={styles.synopsis}>{item.synopsis}</Text>

          {item.credits && item.credits.length > 0 && (
            <View style={styles.creditsList}>
              {item.credits.map(({ label, value }) => (
                <View key={label} style={styles.creditItem}>
                  <Text style={styles.creditLabel}>{label}</Text>
                  <Text style={styles.creditValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* REVIEW FORM SECTION */}
        <View style={styles.formCard}>
          {showMine ? (
            <>
              <Text style={styles.formCardTitle}>Your review</Text>
              <Text style={styles.formCardDate}>
                {timeAgo(mine.createdAt)}
                {mine.edited ? ' • edited' : ''}
              </Text>
              <View style={{ marginVertical: 8 }}>
                <Stars value={mine.rating || 5} />
              </View>
              {mine.title ? <Text style={styles.reviewTitle}>{mine.title}</Text> : null}
              <Text style={styles.mineComment}>{mine.comment}</Text>

              {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}

              <View style={styles.mineButtons}>
                <TouchableOpacity style={styles.btnPrimarySm} onPress={startEdit}>
                  <Text style={styles.btnPrimarySmText}>Edit review</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSoftSm} onPress={() => deleteReview(mine)}>
                  <Text style={styles.btnSoftSmText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.formCardTitle}>
                {editing ? 'Edit your review' : 'What did you think?'}
              </Text>
              <Text style={styles.formCardSubtitle}>
                {editing
                  ? 'Change your rating or your thoughts, then save.'
                  : 'The best discoveries start with a conversation.'}
              </Text>

              {/* Star Rating Picker */}
              <View style={styles.pickerRow}>
                <Text style={styles.pickerLabel}>Your rating</Text>
                <View style={styles.starsPicker}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <TouchableOpacity key={s} onPress={() => setRating(s)} activeOpacity={0.7}>
                      <Text style={[styles.starPick, s <= rating && styles.starPickActive]}>★</Text>
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.ratingNumberText}>{rating}/5</Text>
                </View>
              </View>

              {/* Textarea */}
              <View style={styles.textareaWrapper}>
                <Text style={styles.pickerLabel}>Your review</Text>
                <TextInput
                  style={styles.reviewTextarea}
                  placeholder="What stayed with you? Share your thoughts with the community..."
                  placeholderTextColor={colors.textDim}
                  multiline
                  numberOfLines={4}
                  maxLength={MAX_REVIEW}
                  value={text}
                  onChangeText={setText}
                  textAlignVertical="top"
                />
                <Text style={styles.charCounter}>
                  {text.length}/{MAX_REVIEW}
                </Text>
              </View>

              {formError ? <Text style={styles.formErrorText}>{formError}</Text> : null}

              {user ? (
                <>
                  <TouchableOpacity
                    style={[styles.btnPrimaryFull, submitting && styles.btnDisabled]}
                    onPress={submitReview}
                    disabled={submitting}
                  >
                    <Text style={styles.btnPrimaryFullText}>
                      {submitting ? 'Saving…' : editing ? 'Save changes' : 'Submit Review'}
                    </Text>
                  </TouchableOpacity>

                  {editing && (
                    <TouchableOpacity style={styles.cancelEditBtn} onPress={cancelEdit}>
                      <Text style={styles.cancelEditText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <TouchableOpacity
                  style={styles.btnPrimaryFull}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.btnPrimaryFullText}>Log in to write a review</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.spoilerNote}>Keep it real. Keep it spoiler-free.</Text>
            </>
          )}
        </View>

        {/* REVIEWS SECTION */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionHeading}>The community says</Text>
          <Text style={styles.communitySub}>
            {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
            {summary.count > 0 ? ` • ${summary.average}/5 average` : ''} • Real people, Real
            opinions.
          </Text>

          {reviewsLoading ? (
            <Loading text="Loading reviews…" />
          ) : reviews.length === 0 ? (
            <Text style={styles.noReviews}>
              No reviews yet. Be the first to share your thoughts.
            </Text>
          ) : (
            <View style={styles.reviewsList}>
              {reviews.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  rev={rev}
                  onEdit={startEdit}
                  onDelete={deleteReview}
                />
              ))}
            </View>
          )}

          {hasMore && (
            <TouchableOpacity
              style={[styles.btnOutline, loadingMore && styles.btnDisabled]}
              onPress={loadMore}
              disabled={loadingMore}
            >
              <Text style={styles.btnOutlineText}>
                {loadingMore ? 'Loading…' : 'Load more reviews'}
              </Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
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
    flex: 1,
  },
  playerContainer: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  playerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  playerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  playerBarTop: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerBarTag: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
  },
  playerBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  playerCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBig: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  trailerLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  playerBarBottom: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trailerTimeText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
  },
  headerSection: {
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
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  metaDot: {
    fontSize: 12,
    color: colors.textDim,
  },
  genrePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  genrePill: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  genrePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  btnSoft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.soft,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  btnSoftActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  btnSoftIcon: {
    fontSize: 14,
    color: colors.text,
  },
  btnSoftIconActive: {
    color: colors.primary,
  },
  btnSoftText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  btnSoftTextActive: {
    color: colors.primary,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
    marginLeft: 'auto',
  },
  ratingStar: {
    fontSize: 16,
    color: colors.gold,
    fontWeight: '700',
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 16,
  },
  ratingsCount: {
    fontSize: 9,
    color: colors.textDim,
  },
  detailsBlock: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  synopsis: {
    fontSize: 13,
    color: colors.textSoft,
    lineHeight: 20,
    marginBottom: 16,
  },
  creditsList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
    gap: 10,
  },
  creditItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  creditLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    width: 80,
  },
  creditValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  formCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  formCardSubtitle: {
    fontSize: 11,
    color: colors.textDim,
    marginBottom: 14,
  },
  formCardDate: {
    fontSize: 11,
    color: colors.textDim,
    marginBottom: 4,
  },
  pickerRow: {
    marginBottom: 14,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  starsPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starPick: {
    fontSize: 26,
    color: '#CBD5E1',
  },
  starPickActive: {
    color: colors.primary,
  },
  ratingNumberText: {
    fontSize: 12,
    color: colors.textDim,
    marginLeft: 'auto',
  },
  textareaWrapper: {
    marginBottom: 14,
  },
  reviewTextarea: {
    backgroundColor: colors.field,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: colors.text,
    minHeight: 90,
  },
  charCounter: {
    fontSize: 10,
    color: colors.textDim,
    textAlign: 'right',
    marginTop: 4,
  },
  formErrorText: {
    fontSize: 12,
    color: colors.error,
    marginBottom: 12,
  },
  btnPrimaryFull: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  btnPrimaryFullText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  cancelEditBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelEditText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  spoilerNote: {
    fontSize: 10,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 12,
  },
  mineComment: {
    fontSize: 13,
    color: colors.textSoft,
    lineHeight: 18,
    marginBottom: 14,
  },
  mineButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  btnPrimarySm: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnPrimarySmText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  btnSoftSm: {
    backgroundColor: colors.soft,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnSoftSmText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  reviewsSection: {
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  communitySub: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 4,
    marginBottom: 16,
  },
  noReviews: {
    fontSize: 13,
    color: colors.textMuted,
    paddingVertical: 20,
    textAlign: 'center',
  },
  reviewsList: {
    gap: 14,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryHover,
  },
  reviewUserName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 10,
    color: colors.textDim,
    marginTop: 1,
  },
  starsBlue: {
    color: colors.primary,
    fontSize: 12,
  },
  starsEmpty: {
    color: '#CBD5E1',
  },
  reviewTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginVertical: 4,
  },
  reviewComment: {
    fontSize: 12,
    color: colors.textSoft,
    lineHeight: 18,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  actionBtn: {
    paddingVertical: 4,
  },
  actionBtnEditText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  actionBtnDeleteText: {
    fontSize: 11,
    color: colors.error,
    fontWeight: '600',
  },
  btnOutline: {
    backgroundColor: colors.soft,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'center',
  },
  btnOutlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  notFoundBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  notFoundText: {
    fontSize: 15,
    color: colors.textSoft,
    marginBottom: 16,
  },
  backHomeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backHomeBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});

