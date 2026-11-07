import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const DEFAULT_CATEGORIES = [
  { slug: 'movies', title: 'Popular Movies', pageTitle: 'Movies', square: false, showPlay: false },
  { slug: 'series', title: 'Trending TV Shows', pageTitle: 'TV Shows', square: false, showPlay: false },
  { slug: 'music', title: 'Top Music Hits', pageTitle: 'Music', square: true, showPlay: true },
];

let cache = null;

export function useCategories() {
  const [categories, setCategories] = useState(cache || DEFAULT_CATEGORIES);

  useEffect(() => {
    if (cache) return;
    api.get('/categories')
      .then((d) => {
        if (d?.categories && Array.isArray(d.categories)) {
          cache = d.categories;
          setCategories(d.categories);
        }
      })
      .catch(() => {
        // Fallback to default categories
      });
  }, []);

  return categories;
}

