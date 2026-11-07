import { dummyContents } from './dummyData';

/** Satu sumber untuk Home (judul section) dan halaman View all. Key = slug di URL. */
export const categories = {
    movies: {
        title: 'Popular Movies',
        pageTitle: 'Movies',
        description: 'Film terbaik sepanjang masa, dari blockbuster sampai animasi.',
        items: dummyContents.movies,
        subtitle: (i) => `${i.year} • ${i.genre}`,
    },
    series: {
        title: 'Trending TV Shows',
        pageTitle: 'TV Shows',
        description: 'Serial yang bikin lupa waktu, dari kriminal sampai anime.',
        items: dummyContents.tvShows,
        subtitle: (i) => i.info,
    },
    music: {
        title: 'Top Music Hits',
        pageTitle: 'Music',
        description: 'Album dan single dari berbagai genre dan negara.',
        items: dummyContents.music,
        subtitle: (i) => `${i.artist} • ${i.year}`,
        square: true,
        showPlay: true,
    },
};