import { Navbar, Movies, LatestMovieCard, WatchedBasedRecommendations } from "../components"
import CategoryPage from "./CategoryPage"
import { useState, useEffect } from 'react'
import { getNowPlaying, getPopular, getTopTated, getUpcoming, getRecomendation, getMovieDetail, getTrendingNow, getMoviesByGenre, getWatchedMovies } from "../utils"
import { useSearchParams } from "react-router-dom";
import SearchPage from "./SearchPage";

export default function MoviesPage() {
    const [useQuery] = useSearchParams()
    const [userId, setUserId] = useState(() => Number(localStorage.getItem('userId')) || 76)

    useEffect(() => {
        const onUserId = (e) => {
            const v = e.detail ? Number(e.detail) : null
            setUserId(v || 76)
        }
        window.addEventListener('userIdChange', onUserId)
        return () => window.removeEventListener('userIdChange', onUserId)
    }, [])

    const fetchNowPlaying = (page) => {
        return getNowPlaying(page ?? 1)
    }

    const fetchTrending = (page) => {
        return getTrendingNow()
    }

    const fetchPopular = (page) => {
        return getPopular(userId, page ?? 1)
    }

    const fetchTopRated = (page) => {
        return getTopTated(page ?? 1)
    }

    const fetchUpcoming = (page) => {
        return getUpcoming(page ?? 1)
    }

    const fetchComedy = (page) => {
        return getMoviesByGenre(userId, 'Comedy', page ?? 1)
    }

    const fetchAction = (page) => {
        return getMoviesByGenre(userId, 'Action', page ?? 1)
    }

    const fetchDrama = (page) => {
        return getMoviesByGenre(userId, 'Drama', page ?? 1)
    }

    const fetchHorror = (page) => {
        return getMoviesByGenre(userId, 'Horror', page ?? 1)
    }

    const fetchWatched = () => {
        return getWatchedMovies(userId)
    }

    const Landing = () => {
        return (
            <section className="app__app-content">
                {/*<LatestMovieCard />*/}
                <Movies key={`watched-${userId}`} fetchData={fetchWatched} title="Assistidos" />
                <Movies key={`reco-${userId}`} fetchData={(page) => fetchRecommendation(userId, page)} title="Sugerido" />
                <WatchedBasedRecommendations userId={userId} />
                <Movies fetchData={fetchTrending} title="Agora" />
                {/*<Movies fetchData={fetchPopular} title="Mais populares" />*/}
                <Movies fetchData={fetchComedy} title="Comédia" />
                <Movies fetchData={fetchAction} title="Ação" />
                <Movies fetchData={fetchDrama} title="Drama" />
                <Movies fetchData={fetchHorror} title="Terror" />
                {/*<Movies fetchData={fetchNowPlaying} title="Now Playing" />*/}
                {/*<Movies fetchData={fetchTopRated} title="Top Rated" />*/}
                {/*<Movies fetchData={fetchUpcoming} title="Upcoming" />*/}
            </section>
        )
    }

    // Fetch recommendation from AWS endpoint and map to TMDB movie objects
    const fetchRecommendation = async (userId, page) => {
        if (!userId) return { error: false, data: [], total_pages: 1 };
        // getRecomendation returns an array of recs with tmdbId
        const recomendation = await getRecomendation(userId);
        if (recomendation.error) return { error: true, data: [] };

        // for each recommendation, fetch TMDB details to build a consistent Movie object
        const recs = await Promise.all(
            recomendation.data.map(async (rec) => {
                try {
                    const result = await getMovieDetail(rec.tmdbId);
                    return result.data;
                } catch (err) {
                    // fallback: construct a minimal object so MovieCard doesn't crash
                    return {
                        id: rec.tmdbId,
                        title: rec.title,
                        poster_path: null,
                    }
                }
            })
        );

        return { error: false, data: recs, total_pages: 1 };
    }

    return (
        <div className="app">
            <section className="app__app-navbar">
                <Navbar />
            </section>
            {
                // if there is query return search page, if category return category page
                useQuery.get('query') ? <SearchPage /> : 
                useQuery.get('category') ? <CategoryPage /> : <Landing />
            }
        </div>
    )
}

