import { useEffect, useRef, useState } from 'react';
import { BsSearch } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import './search-input.css';
import { gsap } from 'gsap';
import { useSearchParams } from 'react-router-dom';

export default function SearchInput() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [toggleInput, setToggleInput] = useState(searchParams.get('query') ? true : false);
    const searchInput = useRef()
    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('userId') ?? '76'
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
        const v = e.target.value
        setUserId(v)
        localStorage.setItem('userId', v)
        // notify other components
        window.dispatchEvent(new CustomEvent('userIdChange', { detail: v }))
    }

    return (
        <div className="search">
            <div className="search__user-wrapper">
                <FaUser size={12} className="search__user-icon" />
                <select
                    aria-label="User ID"
                    className="search__user-select"
                    value={userId}
                    onChange={handleUserIdChange}
                >
                    <option value="01">User 01</option>
                    <option value="55">User 55</option>
                    <option value="75">User 75</option>
                    <option value="76">User 76</option>
                    <option value="111">User 111</option>
                    <option value="214">User 214</option>
                    <option value="245">User 245</option>
                    <option value="1000">User 1000</option>
                </select>
            </div>
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