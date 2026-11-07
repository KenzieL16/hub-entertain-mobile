const art = (title, w, h) => {
    const hue = ([...title].reduce((a, c) => a + c.charCodeAt(0), 0) * 7) % 360;
    const initials = title
        .split(/\s+/)
        .filter((word) => /^[A-Za-z0-9]/.test(word))
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue},70%,48%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360},65%,14%)"/>
</linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<text x="50%" y="52%" font-family="Helvetica,Arial,sans-serif" font-weight="800" font-size="${Math.min(w, h) * 0.34}" fill="rgba(255,255,255,0.85)" text-anchor="middle" dominant-baseline="middle">${initials}</text>
</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const ratingsCount = (rating) => `${Math.round(rating * 14)}k ratings`;

/* ---------- MOVIES ---------- */
const movies = [
    {
        id: 'interstellar', title: 'Interstellar', year: 2014, genre: 'Sci-Fi', genres: ['Sci-Fi', 'Adventure', 'Drama'],
        rated: 'PG-13', rating: 8.7, duration: '2h 49m',
        image: 'https://media.themoviedb.org/t/p/w440_and_h660_face/nrSaXF39nDfAAeLKksRCyvSzI2a.jpg',
        tagline: 'Love is the one thing that transcends time and space.',
        synopsis: 'With Earth dying, a former pilot joins a team of explorers who travel through a wormhole in search of a new home for humanity.',
        credits: [['Director', 'Christopher Nolan'], ['Starring', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain']],
    },
    {
        id: 'the-dark-knight', title: 'The Dark Knight', year: 2008, genre: 'Action', genres: ['Action', 'Crime', 'Drama'],
        rated: 'PG-13', rating: 9.0, duration: '2h 32m',
        tagline: 'Why so serious?',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        synopsis: 'Batman faces the Joker, a criminal mastermind who pushes Gotham City into chaos and tests the limits of the hero.',
        credits: [['Director', 'Christopher Nolan'], ['Starring', 'Christian Bale, Heath Ledger, Aaron Eckhart']],
    },
    {
        id: 'inception', title: 'Inception', year: 2010, genre: 'Sci-Fi', genres: ['Sci-Fi', 'Action', 'Thriller'],
        rated: 'PG-13', rating: 8.8, duration: '2h 28m',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
        tagline: 'Your mind is the scene of the crime.',
        synopsis: 'A thief who steals secrets through dream-sharing technology is offered a final job: planting an idea inside a target\'s mind.',
        credits: [['Director', 'Christopher Nolan'], ['Starring', 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page']],
    },
    {
        id: 'the-shawshank-redemption', title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', genres: ['Drama'],
        rated: 'R', rating: 9.3, duration: '2h 22m',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
        tagline: 'Fear can hold you prisoner. Hope can set you free.',
        synopsis: 'A banker sentenced to life in Shawshank State Penitentiary forms an unlikely friendship and finds hope behind bars.',
        credits: [['Director', 'Frank Darabont'], ['Starring', 'Tim Robbins, Morgan Freeman']],
    },
    {
        id: 'parasite', title: 'Parasite', year: 2019, genre: 'Thriller', genres: ['Thriller', 'Drama', 'Dark Comedy'],
        rated: 'R', rating: 8.5, duration: '2h 12m',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        tagline: 'Act like you own the place.',
        synopsis: 'A poor family schemes its way into the lives of a wealthy household, with consequences nobody saw coming.',
        credits: [['Director', 'Bong Joon-ho'], ['Starring', 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong']],
    },
    {
        id: 'spirited-away', title: 'Spirited Away', year: 2001, genre: 'Animation', genres: ['Animation', 'Fantasy', 'Family'],
        rated: 'PG', rating: 8.6, duration: '2h 5m',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
        tagline: 'A world where gods and spirits rest.',
        synopsis: 'A young girl wanders into a spirit world and must work in a bathhouse for gods to free her parents and find her way home.',
        credits: [['Director', 'Hayao Miyazaki'], ['Voices', 'Rumi Hiiragi, Miyu Irino']],
    },
    {
        id: 'your-name', title: 'Your Name', year: 2016, genre: 'Romance', genres: ['Animation', 'Romance', 'Fantasy'],
        rated: 'PG', rating: 8.4, duration: '1h 46m',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/vfJFJPepRKapMd5G2ro7klIRysq.jpg',
        tagline: 'Two strangers, bound by a mystery.',
        synopsis: 'Two teenagers who have never met begin swapping bodies, and set out to find each other across distance and time.',
        credits: [['Director', 'Makoto Shinkai'], ['Voices', 'Ryunosuke Kamiki, Mone Kamishiraishi']],
    },
    {
        id: 'oppenheimer', title: 'Oppenheimer', year: 2023, genre: 'Drama', genres: ['Drama', 'History', 'Biography'],
        rated: 'R', rating: 8.3, duration: '3h 0m',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        tagline: 'The world forever changes.',
        synopsis: 'The story of J. Robert Oppenheimer and the Manhattan Project, and the weight of building the atomic bomb.',
        credits: [['Director', 'Christopher Nolan'], ['Starring', 'Cillian Murphy, Emily Blunt, Robert Downey Jr.']],
    },
].map((m) => ({ type: 'Movies', tag: 'MOVIE', badge: '4K UHD', trailerTime: '2:30', image: art(m.title, 400, 600), ...m }));

/* ---------- TV SHOWS ---------- */
const tvShows = [
    {
        id: 'breaking-bad', title: 'Breaking Bad', year: 2008, info: '2008–2013 • 5 seasons', genres: ['Crime', 'Drama', 'Thriller'],
        rating: 9.5, tagline: 'Chemistry is the study of change.',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/anFx9aTOOYqgS3v7x3R84Kz67ly.jpg',
        synopsis: 'A high-school chemistry teacher diagnosed with cancer turns to manufacturing methamphetamine to secure his family\'s future.',
        credits: [['Creator', 'Vince Gilligan'], ['Starring', 'Bryan Cranston, Aaron Paul, Anna Gunn']],
    },
    {
        id: 'sherlock', title: 'Sherlock', year: 2010, info: '2010–2017 • 4 seasons', genres: ['Crime', 'Mystery', 'Drama'],
        rating: 9.1, tagline: 'The game is on.',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg',
        synopsis: 'A modern-day update of Conan Doyle\'s detective, with Sherlock Holmes and Dr. Watson solving crimes across London.',
        credits: [['Creators', 'Mark Gatiss, Steven Moffat'], ['Starring', 'Benedict Cumberbatch, Martin Freeman']],
    },
    {
        id: 'the-mentalist', title: 'The Mentalist', year: 2008, info: '2008–2015 • 7 seasons', genres: ['Crime', 'Mystery', 'Drama'],
        rating: 8.2, tagline: 'He sees what you hide.',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/acYXu4KaDj1NIkMgObnhe4C4a0T.jpg',
        synopsis: 'A former fake psychic uses his sharp observation skills to help the California Bureau of Investigation catch killers.',
        credits: [['Creator', 'Bruno Heller'], ['Starring', 'Simon Baker, Robin Tunney']],
    },
    {
        id: 'game-of-thrones', title: 'Game of Thrones', year: 2011, info: '2011–2019 • 8 seasons', genres: ['Fantasy', 'Drama', 'Adventure'],
        rating: 9.2, tagline: 'You win or you die.',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
        synopsis: 'Noble families fight for control of the Iron Throne of Westeros while an ancient threat gathers in the north.',
        credits: [['Creators', 'David Benioff, D. B. Weiss'], ['Starring', 'Emilia Clarke, Kit Harington, Peter Dinklage']],
    },
    {
        id: 'stranger-things', title: 'Stranger Things', year: 2016, info: '2016–2025 • 5 seasons', genres: ['Sci-Fi', 'Horror', 'Drama'],
        rating: 8.6, tagline: 'Something is waiting on the other side.',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
        synopsis: 'When a boy vanishes in a small Indiana town, his friends uncover secret experiments and a terrifying parallel dimension.',
        credits: [['Creators', 'The Duffer Brothers'], ['Starring', 'Millie Bobby Brown, Finn Wolfhard, Winona Ryder']],
    },
    {
        id: 'peaky-blinders', title: 'Peaky Blinders', year: 2013, info: '2013–2022 • 6 seasons', genres: ['Crime', 'Drama'],
        rating: 8.7, tagline: 'By order of the Peaky Blinders.',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
        synopsis: 'A gangster family in post-war Birmingham rises from the streets under the ruthless leadership of Tommy Shelby.',
        credits: [['Creator', 'Steven Knight'], ['Starring', 'Cillian Murphy, Helen McCrory, Paul Anderson']],
    },
    {
        id: 'death-note', title: 'Death Note', year: 2006, info: '2006–2007 • 1 season', genres: ['Anime', 'Thriller', 'Supernatural'],
        rating: 8.6, tagline: 'Justice, or something darker?',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/tCZFfYTIwrR7n94J6G14Y4hAFU6.jpg',
        synopsis: 'A student finds a notebook that kills anyone whose name is written in it, and a genius detective known as L sets out to stop him.',
        credits: [['Director', 'Tetsuro Araki'], ['Voices', 'Mamoru Miyano, Kappei Yamaguchi']],
    },
    {
        id: 'attack-on-titan', title: 'Attack on Titan', year: 2013, info: '2013–2023 • 4 seasons', genres: ['Anime', 'Action', 'Dark Fantasy'],
        rating: 9.1, tagline: 'Humanity\'s last stand.',
        image: 'https://media.themoviedb.org/t/p/w600_and_h900_face/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
        synopsis: 'Humanity lives behind enormous walls to escape man-eating giants, until a breach forces a young soldier to fight back.',
        credits: [['Director', 'Tetsuro Araki, Yuichiro Hayashi'], ['Voices', 'Yuki Kaji, Yui Ishikawa']],
    },
].map((s) => ({ type: 'TV Shows', tag: 'TV SHOW', badge: 'HD', trailerTime: '1:45', image: art(s.title, 400, 600), ...s }));

/* ---------- MUSIC ---------- */
const music = [
    {
        id: 'after-hours', title: 'After Hours', artist: 'The Weeknd', year: 2020, info: 'Album', genres: ['Pop', 'R&B', 'Synth-pop'],
        rating: 9.0, tagline: 'Neon lights and late-night heartbreak.',
        synopsis: 'A moody synth-pop album home to "Blinding Lights", one of the most streamed songs of all time.',
    },
    {
        id: '1989', title: '1989', artist: 'Taylor Swift', year: 2014, info: 'Album', genres: ['Pop', 'Synth-pop'],
        rating: 8.9, tagline: 'The full pop reinvention.',
        synopsis: 'Taylor Swift\'s first fully pop album, featuring "Shake It Off", "Blank Space" and "Style".',
    },
    {
        id: 'hit-me-hard-and-soft', title: 'HIT ME HARD AND SOFT', artist: 'Billie Eilish', year: 2024, info: 'Album', genres: ['Alt Pop', 'Electropop'],
        rating: 8.8, tagline: 'Intimate, bold, and cinematic.',
        synopsis: 'A cohesive album meant to be heard front to back, blending quiet confessions with club-ready beats.',
    },
    {
        id: 'damn', title: 'DAMN.', artist: 'Kendrick Lamar', year: 2017, info: 'Album', genres: ['Hip-Hop', 'Rap'],
        rating: 9.1, tagline: 'Pulitzer-winning hip-hop.',
        synopsis: 'Kendrick Lamar\'s fourth studio album, the first non-classical, non-jazz work to win the Pulitzer Prize for Music.',
    },
    {
        id: 'idol', title: 'Idol (アイドル)', artist: 'YOASOBI', year: 2023, info: 'Single', genres: ['J-Pop', 'Electropop'],
        rating: 8.8, tagline: 'The anime-opening that went global.',
        synopsis: 'The opening theme of the anime "Oshi no Ko", which topped charts worldwide.',
    },
    {
        id: 'lemon', title: 'Lemon', artist: 'Kenshi Yonezu', year: 2018, info: 'Single', genres: ['J-Pop', 'Ballad'],
        rating: 8.7, tagline: 'A song about loss, loved by millions.',
        synopsis: 'A ballad written as a drama theme, and one of the best-selling Japanese songs of the decade.',
    },
    {
        id: 'dynamite', title: 'Dynamite', artist: 'BTS', year: 2020, info: 'Single', genres: ['K-Pop', 'Disco-Pop'],
        rating: 8.4, tagline: 'Light it up like dynamite.',
        synopsis: 'BTS\'s first all-English single, a bright disco-pop track that debuted at No. 1 on the Billboard Hot 100.',
    },
    {
        id: 'a-night-at-the-opera', title: 'A Night at the Opera', artist: 'Queen', year: 1975, info: 'Album', genres: ['Rock', 'Progressive Rock'],
        rating: 9.2, tagline: 'Where "Bohemian Rhapsody" began.',
        synopsis: 'Queen\'s fourth album, a theatrical rock landmark featuring "Bohemian Rhapsody" and "Love of My Life".',
    },
    {
        id: 'kind-of-blue', title: 'Kind of Blue', artist: 'Miles Davis', year: 1959, info: 'Album', genres: ['Jazz', 'Modal Jazz'],
        rating: 9.4, tagline: 'The best-selling jazz album ever.',
        synopsis: 'A landmark of modal jazz recorded with a legendary lineup, still a starting point for new jazz listeners.',
    },
    {
        id: 'monokrom', title: 'Monokrom', artist: 'Tulus', year: 2016, info: 'Album', genres: ['Indonesian Pop', 'Soul'],
        rating: 8.6, tagline: 'Smooth, warm, and unmistakably Indonesian.',
        synopsis: 'Tulus\'s third album, including "Pamit", "Monokrom" and "Ruang Sendiri".',
    },
].map((s) => ({
    image: art(s.title, 400, 400),
    type: 'Music',
    tag: `MUSIC • ${s.info.toUpperCase()}`,
    badge: 'LOSSLESS AUDIO',
    trailerTime: '3:30',
    credits: [['Artist', s.artist], ['Genre', s.genres.join(' • ')]],
    ...s,
}));

export const allItems = [...movies, ...tvShows, ...music];

export const searchItems = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allItems.filter((i) =>
        [i.title, i.artist, ...i.genres].filter(Boolean).some((t) => t.toLowerCase().includes(q))
    );
};

export const dummyContents = {
    hero: movies[0],
    movies,
    tvShows,
    music,
    reviews: [
        { id: 'r1', name: 'Alex Morgan', time: '3 days ago', avatar: 'AM', rating: 5, title: 'The kind of title that stays with you.', comment: 'Visually and emotionally stunning, but it\'s the quiet moments that really land. Still thinking about it days later.' },
        { id: 'r2', name: 'Sarah Chen', time: '5 days ago', avatar: 'SC', rating: 4, title: 'Come for the hype. Stay for the story.', comment: 'A great reminder of why this one is so highly rated. Easy to see why people keep coming back to it.' },
        { id: 'r3', name: 'Marcus Reed', time: '1 week ago', avatar: 'MR', rating: 5, title: 'Worth every minute.', comment: 'Every detail feels considered, and the performances give the whole thing a real heart.' },
    ],
};

export const getContentById = (id) => {
    const item = allItems.find((i) => i.id === id) || allItems[0];
    return {
        ...item,
        ratingsCount: ratingsCount(item.rating),
        breadcrumb: `Home > ${item.type} > ${item.title}`,
    };
};