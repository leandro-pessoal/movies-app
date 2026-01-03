import { useState, useEffect } from 'react'
import { getWatchedMovies, getRecomendationWatchX } from "../utils"
import { Movies } from "./"

export default function WatchedBasedRecommendations({ userId }) {
    const [watchedMovies, setWatchedMovies] = useState([])

    useEffect(() => {
        const loadWatchedMovies = async () => {
            if (!userId) return
            const result = await getWatchedMovies(userId)
            if (!result.error && result.data.length > 0) {
                setWatchedMovies(result.data.slice(0, 3))
            }
        }
        loadWatchedMovies()
    }, [userId])

    return (
        <>
            {watchedMovies.map((movie) => (
                <Movies 
                    key={`watch-x-${movie.id}-${userId}`} 
                    fetchData={() => getRecomendationWatchX(userId, movie.id)} 
                    title={`Porque você assistiu ${movie.title}`} 
                />
            ))}
        </>
    )
}