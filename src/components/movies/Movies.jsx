/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import { Waypoint } from 'react-waypoint';
import PropTypes from 'prop-types';

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Movies({ title, fetchData, isHasRecommendation }) {
    const [movies, setMovies] = useState([]);
    const [pages, setPage] = useState(
        {
            total_pages: null,
            page: 1,
        }
    );

    const cardList = useRef(null);

    useEffect(() => {
        // fetch by pages, if null value assigned to 1
        fetchData(pages.page ?? 1).then(({ data, total_pages }) => {
            // set total pages after init fetch data
            if (!pages.total_pages)
                setPage(prev => {
                    return {
                        ...prev,
                        total_pages: total_pages
                    }
                })

            // set movies state data
            setMovies(prev => [...prev, ...data])
            // returning a boolean value into parent
            if (isHasRecommendation != null)
                isHasRecommendation(data.length > 0)
        })
    }, [pages.page])

    const scrollLeft = () => {
        if (cardList.current) {
            cardList.current.scrollLeft -= 500;
        }
    };

    const scrollRight = () => {
        if (cardList.current) {
            cardList.current.scrollLeft += 500;
        }
    };

    // return nothing when theres no movies
    if (movies.length == 0)
        return null;

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <h1 className='font-bold text-lg md:text-2xl'>{title}</h1>
                <span 
                    className='text-sm text-gray-400 cursor-pointer hover:text-white'
                    onClick={() => window.location.href = `/category?category=${encodeURIComponent(title)}`}
                >
                    Ver todos ›
                </span>
            </div>
            <div className="relative">
                <MdChevronLeft className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-70 transition-all" size={40} onClick={scrollLeft}/>
                <div className="card__card-list-horizontal scrollbar__hidden" ref={cardList}>
                    {
                        movies.map(movie => {
                            return (
                                <MovieCard movie={movie} key={movie.id} />
                            );
                        })
                    }
                    <Waypoint horizontal={true} onEnter={() => {
                        // do the increment of the page if page < total pages
                        if (pages.page < pages.total_pages)
                            setPage(prev => {
                                return {
                                    page: prev.page++,
                                    ...prev
                                }
                            })
                    }} />
                </div>
                <MdChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-black bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-70 transition-all" size={40} onClick={scrollRight}/>
            </div>
        </>
    )
}

Movies.propTypes = {
    title: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
    isHasRecommendation: PropTypes.func
}