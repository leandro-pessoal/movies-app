import PropTypes from 'prop-types';
import { IMAGE_URL_W300, putEvent } from '../../utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiImage } from 'react-icons/fi';

export default function MovieCard({ movie }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleClick = () => {
        const userId = localStorage.getItem('userId') || '76';
        putEvent(userId, movie.id);
    };

    return (
        <Link to={`/detail/${movie.id}`} className="movie-card-horizontal" onClick={handleClick}>
            {
                movie.poster_path ? (
                    <div className={`movie-card-image ${imageLoaded ? '' : 'bg-gray-600 animate-pulse'}`}>
                        <img
                            src={IMAGE_URL_W300 + movie.poster_path}
                            alt={movie.title}
                            loading='lazy'
                            className={`movie-card-img ${imageLoaded ? 'opacity-1 scale-100' : 'opacity-0 scale-75'}`}
                            onLoad={() => {
                                setImageLoaded(true)
                            }}
                        />
                    </div>
                ) : (
                    <div className="movie-card-placeholder">
                        <FiImage size={50}/>
                        <p className='p-5'>No Image</p>
                    </div>
                )
            }
            <h3 className="movie-card-title">{movie.title}</h3>
        </Link>
    )
}

MovieCard.propTypes = {
    movie: PropTypes.object.isRequired
}