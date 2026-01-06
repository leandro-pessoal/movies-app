import SearchInput from '../search-input/SearchInput'
import logo from '/src/assets/images/symbol-ic-play.webp';  
import './navbar.css'

export default function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar__nav-brand">
                <img src={logo} className="w-12 mr-4"  />
                <h2 className="text-4xl max-sm:hidden text-ic-play">Meu streaming</h2>
            </div>
            <SearchInput />
        </div>
    )
}