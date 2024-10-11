import { NavLink } from "react-router-dom";
function Header(){
    return (
        <header className="flex space-x-8 justify-between item-center py-3 px-10 bg-gray-900 text-white">
            <div className="flex space-x-4 text-xl font-extrabold">
                <NavLink to="/" className="cursor-pointer">Movies</NavLink>
                <NavLink to="/watchlist" className="cursor-pointer">Watchlist</NavLink>
            </div>
            <div className="bg-gray-900">
                <input className="rounded-xl px-4 py-0.5 text-black border-0 outline-none font-normal" placeholder="Search"/>
            </div>
        </header>
    );
}

export default Header;