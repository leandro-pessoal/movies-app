import { useEffect, useRef, useState } from 'react';
import { BsSearch } from "react-icons/bs";
import './search-input.css';
import { gsap } from 'gsap';
import { useSearchParams } from 'react-router-dom';

export default function SearchInput() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [toggleInput, setToggleInput] = useState(searchParams.get('query') ? true : false);
    const searchInput = useRef()
    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('userId') ?? ''
    })

    useEffect(() => {
        gsap.from(searchInput.current, { width: 0, duration: .3, ease: 'linear' });
        searchInput.current.focus();
    }, [toggleInput])

    const handleButtonClick = () => {
        setToggleInput(true);
    };

    const handleInputBlur = (e) => {
        const query = e.target.value
        if (query.length > 0)
            return
        setToggleInput(false);
    };

    const handleSearchInput = (e) => {
        if (e.target.value)
            setSearchParams(
                {
                    query: e.target.value
                }
            )
        else
            setSearchParams()
    }

    const handleUserIdChange = (e) => {
        // keep only digits and limit to 4 chars
        const v = (e.target.value ?? '').replace(/\D/g, '').slice(0, 4)
        setUserId(v)
        if (v) {
            localStorage.setItem('userId', v)
        } else {
            localStorage.removeItem('userId')
        }
        // notify other components
        window.dispatchEvent(new CustomEvent('userIdChange', { detail: v }))
    }

    return (
        <div className="search">
            <input
                aria-label="User ID"
                className="search__user-id inline-block"
                type="text"
                inputMode="numeric"
                placeholder="ID"
                maxLength={4}
                value={userId}
                onChange={handleUserIdChange}
            />
            <div className={`search__search-wrapper ${toggleInput ? '' : 'md:hidden'}`}>
                <BsSearch size="24" className='min-w-min hidden md:block' />
                <input
                    className="search__search-input"
                    type="text"
                    placeholder="Title"
                    value={searchParams.get('query') ?? ''}
                    onInput={handleSearchInput}
                    ref={searchInput}
                    onBlur={handleInputBlur}
                />
            </div>
            <button
                className={`search__button ${toggleInput ? 'hidden' : ''}`}
                onClick={handleButtonClick}
            >
                <BsSearch size="24" />
            </button>
        </div>
    )
}