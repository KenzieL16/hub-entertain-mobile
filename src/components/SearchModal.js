import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../lib/api';
import { colors } from '../lib/theme';
import Icon from './Icon';

export default function SearchModal({ visible, onClose, onSelectDetail, onSearchSubmit }) {
  const [query, setQuery] = useState('');
  const [popular, setPopular] = useState([]);
  const [result, setResult] = useState({ q: '', items: [] });
  const [searching, setSearching] = useState(false);

  // Fetch popular items when modal opens
  useEffect(() => {
    if (!visible || popular.length) return;
    api.get('/home', { params: { limit: 1 } })
      .then((d) => {
        if (d?.sections) {
          setPopular(d.sections.flatMap((s) => s.items));
        }
      })
      .catch(() => {});
  }, [visible, popular.length]);

  // Debounced search
  const q = query.trim();
  useEffect(() => {
    if (!visible || !q) {
      setResult({ q: '', items: [] });
      setSearching(false);
      return;
    }

    setSearching(true);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      api.get('/contents/search', { params: { q, limit: 8 }, signal: controller.signal })
        .then((d) => {
          setResult({ q, items: d.results || [] });
          setSearching(false);
        })
        .catch(() => {
          setSearching(false);
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, visible]);

  const handleSubmit = () => {
    if (!q) return;
    onClose();
    onSearchSubmit(q);
  };

  const shown = q ? result.items : popular;
  const label = !q
    ? 'Popular right now'
    : searching
    ? 'Searching…'
    : shown.length
    ? 'Results'
    : `No results for "${query}"`;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color={colors.textDim} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies, shows, artists..."
              placeholderTextColor={colors.textDim}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
                <Icon name="close" size={16} color={colors.textDim} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Status / Label */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>{label}</Text>
          {searching && <ActivityIndicator size="small" color={colors.primary} />}
        </View>

        {/* Results List */}
        <FlatList
          data={shown}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => {
                onClose();
                onSelectDetail(item.id);
              }}
              activeOpacity={0.7}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
              ) : (
                <View style={[styles.itemImage, styles.imagePlaceholder]}>
                  <Text style={styles.placeholderText}>{item.title?.[0]}</Text>
                </View>
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemSubtitle}>
                  {item.type || item.category || 'Movie'} • {item.year || ''}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  itemImage: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  imagePlaceholder: {
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 18,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.textDim,
    marginTop: 2,
  },
});

