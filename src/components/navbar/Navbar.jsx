import { useState, useEffect } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useSearchParams } from 'react-router-dom'
import symbolLogo from '../../assets/images/symbol-ic-play.webp'
import { getUsers, addUser } from '../../utils/users'
import './navbar.css'

export default function Navbar() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showAddUser, setShowAddUser] = useState(false)
    const [userId, setUserId] = useState(() => localStorage.getItem('userId') ?? '76')
    const [users, setUsers] = useState(getUsers())
    const [newUserId, setNewUserId] = useState('')
    const [newUserName, setNewUserName] = useState('')
    
    const currentCategory = searchParams.get('category')
    const isHomePage = !searchParams.get('query') && !currentCategory

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

    const handleAddUser = (e) => {
        e.preventDefault()
        if (!newUserId || !newUserName) return
        if (users.find(u => u.id === newUserId)) {
            alert('ID já existe!')
            return
        }
        const user = addUser(newUserId, newUserName)
        setUsers(getUsers())
        setNewUserId('')
        setNewUserName('')
        setShowAddUser(false)
        handleUserIdChange(user.id)
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
                                    <div className="profile-item" onClick={() => setShowAddUser(true)}>
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
            {showAddUser && (
                <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Adicionar Novo Usuário</h2>
                        <form onSubmit={handleAddUser}>
                            <input
                                type="text"
                                placeholder="ID do usuário"
                                className="modal-input"
                                value={newUserId}
                                onChange={(e) => setNewUserId(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Nome do usuário"
                                className="modal-input"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                required
                            />
                            <div className="modal-buttons">
                                <button type="button" className="modal-btn-cancel" onClick={() => setShowAddUser(false)}>Cancelar</button>
                                <button type="submit" className="modal-btn-submit">Adicionar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}