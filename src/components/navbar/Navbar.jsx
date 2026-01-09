import { useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useSearchParams } from 'react-router-dom'
import symbolLogo from '../../assets/images/symbol-ic-play.webp'
import './navbar.css'

export default function Navbar() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [userId, setUserId] = useState(() => localStorage.getItem('userId') ?? '76')
    
    const currentCategory = searchParams.get('category')
    const isHomePage = !searchParams.get('query') && !currentCategory

    const users = [
        { id: '01', name: 'User 01', avatar: '01', color: 'green' },
        { id: '55', name: 'User 55', avatar: '55', color: 'blue' },
        { id: '75', name: 'User 75', avatar: '75', color: 'purple' },
        { id: '76', name: 'User 76', avatar: '76', color: 'pink' },
        { id: '111', name: 'User 111', avatar: '111', color: 'yellow' },
        { id: '214', name: 'User 214', avatar: '214', color: 'red' },
        { id: '245', name: 'User 245', avatar: '245', color: 'indigo' },
        { id: '1000', name: 'User 1000', avatar: '1K', color: 'gray' }
    ]

    const currentUser = users.find(user => user.id === userId) || users[3]

    const handleSearchInput = (e) => {
        if (e.target.value)
            setSearchParams({ query: e.target.value })
        else
            setSearchParams()
    }

    const handleUserIdChange = (newUserId) => {
        setUserId(newUserId)
        localStorage.setItem('userId', newUserId)
        window.dispatchEvent(new CustomEvent('userIdChange', { detail: newUserId }))
        setShowUserMenu(false)
    }

    return (
        <div className="navbar-new">
            <div className="navbar-content">
                <div className="navbar-left">
                    <div className="navbar-brand">
                        <h1>ItaúCultural</h1>
                        <img src={symbolLogo} alt="play" className="navbar-logo" />
                        <span>play</span>
                    </div>
                    <nav className="navbar-nav">
                        <a href="/" className={`nav-link ${isHomePage ? 'active' : ''}`}>Início</a>
                        <a href="/category?category=Comédia" className={`nav-link ${currentCategory === 'Comédia' ? 'active' : ''}`}>Comédia</a>
                        <a href="/category?category=Ação" className={`nav-link ${currentCategory === 'Ação' ? 'active' : ''}`}>Ação</a>
                        <a href="/category?category=Drama" className={`nav-link ${currentCategory === 'Drama' ? 'active' : ''}`}>Drama</a>
                        <a href="/category?category=Terror" className={`nav-link ${currentCategory === 'Terror' ? 'active' : ''}`}>Terror</a>
                    </nav>
                </div>
                <div className="navbar-right">
                    <div className="search-container">
                        <BsSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar filmes e séries"
                            className="search-input"
                            value={searchParams.get('query') ?? ''}
                            onChange={handleSearchInput}
                        />
                    </div>
                    <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
                        <div className={`user-avatar ${currentUser.color}`}>{currentUser.avatar}</div>
                        {showUserMenu && (
                            <div className="user-menu">
                                <div className="menu-section">
                                    <h3>Minha conta</h3>
                                    <div className="menu-item">📋 Minhas listas</div>
                                    <div className="menu-item">⚙️ Minha conta</div>
                                    <div className="menu-item">↗️ Sair</div>
                                </div>
                                <div className="menu-section">
                                    <h3>Perfis</h3>
                                    {users.map(user => (
                                        <div key={user.id} className="profile-item" onClick={() => handleUserIdChange(user.id)}>
                                            <div className={`profile-avatar ${user.color}`}>{user.avatar}</div>
                                            <span>{user.name}</span>
                                        </div>
                                    ))}
                                    <div className="profile-item">
                                        <div className="profile-avatar gray">+</div>
                                        <span>Adicionar novo</span>
                                    </div>
                                    <div className="menu-item">👥 Gerenciar perfis</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}