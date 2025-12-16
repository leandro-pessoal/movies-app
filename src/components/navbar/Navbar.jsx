import SearchInput from '../search-input/SearchInput'
import logo from '/src/assets/images/Arch_Amazon-Personalize_64.svg';  
import './navbar.css'

export default function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar__nav-brand">
                <img src={logo} className="w-16" alt="Personalize AWS logo" />
                <h2 className="text-2xl max-sm:hidden bg-gradient-to-r from-[#6889e6] via-[#a5bdff] to-[#d6e1ff] bg-clip-text text-transparent">POC AWS Personalize</h2>
            </div>
            <SearchInput />
        </div>
    )
}