import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import MovieCard from "../components/movies/MovieCard";
import { Loading, Navbar } from "../components";
import { getNowPlaying, getPopular, getTopTated, getUpcoming, getTrendingNow, getMoviesByGenre, getWatchedMovies, getRecomendation, getMovieDetail } from "../utils";

export default function CategoryPage() {
    const [searchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [pages, setPage] = useState({ total_pages: null, page: 1 });
    const [loading, setLoading] = useState(true);
    
    const category = searchParams.get('category');
    const userId = Number(localStorage.getItem('userId')) || 76;

    const categoryFetchers = {
        'Assistidos': () => getWatchedMovies(userId),
        'Sugerido': (page) => fetchRecommendation(userId, page),
        'Agora': () => getTrendingNow(),
        'Comédia': (page) => getMoviesByGenre(userId, 'Comedy', page),
        'Ação': (page) => getMoviesByGenre(userId, 'Action', page),
        'Drama': (page) => getMoviesByGenre(userId, 'Drama', page),
        'Terror': (page) => getMoviesByGenre(userId, 'Horror', page)
    };

    const fetchRecommendation = async (userId, page) => {
        if (!userId) return { error: false, data: [], total_pages: 1 };
        const recomendation = await getRecomendation(userId);
        if (recomendation.error) return { error: true, data: [] };

        const recs = await Promise.all(
            recomendation.data.map(async (rec) => {
                try {
                    const result = await getMovieDetail(rec.tmdbId);
                    return result.data;
                } catch (err) {
                    return {
                        id: rec.tmdbId,
                        title: rec.title,
                        poster_path: null,
                    }
                }
            })
        );

        return { error: false, data: recs, total_pages: 1 };
    };

    useEffect(() => {
        if (!category || !categoryFetchers[category]) return;
        
        setLoading(true);
        categoryFetchers[category](pages.page).then(({ data, total_pages }) => {
            if (!pages.total_pages) {
                setPage(prev => ({ ...prev, total_pages: total_pages }));
            }
            setMovies(prev => pages.page === 1 ? data : [...prev, ...data]);
            setLoading(false);
        });
    }, [category, pages.page]);

    if (loading && movies.length === 0) return <Loading />;

    return (
        <div className="app">
            <section className="app__app-navbar">
                <Navbar />
            </section>
            <section className="m-5">
                <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">{category}</h1>
                    <Link to="/" className="text-gray-400 hover:text-white">← Voltar</Link>
                </div>
                <div className="grid 2xl:grid-cols-8 md:grid-cols-6 sm:grid-cols-4 grid-cols-3 gap-5 md:gap-y-10">
                    {movies.map(movie => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                    <Waypoint onEnter={() => {
                        if (pages.page < pages.total_pages) {
                            setPage(prev => ({ page: prev.page + 1, ...prev }));
                        }
                    }} />
                </div>
            </section>
        </div>
    );
}