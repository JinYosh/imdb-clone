import { useState, useEffect } from "react";
import { IMAGE_BASE_URL, WATCHLIST_KEY } from "./constants";
import { getWatchListFromLocalStorage } from "./utill";
import { API_KEY } from "./constants";

function Watchlist() {
    const [watchlist, setwatchlist] = useState(getWatchListFromLocalStorage());
    const [genreMap, setGenreMap] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    //const [generSelected, setGenereSelected] = useState('All')

    let isEmptyWatchList = false
    if (watchlist.length === 0) {
        isEmptyWatchList = true;
    } else { isEmptyWatchList = false; }

    const removeMediaFromLocalStorage = (mediaId) => {
        if (watchlist.length === 1) {
            localStorage.removeItem(WATCHLIST_KEY);
            setwatchlist([])
            return;
        } else {
            let updatedWatchList = watchlist.filter((media) => media.id !== mediaId);
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchList));
            setwatchlist(updatedWatchList);
        }
    };

    const sortById = () => {
        const temp = [...watchlist]  // keeping the copy
        const updatedWatchList = temp.sort((a, b) => a.id - b.id);
        setwatchlist(updatedWatchList)
    };

    useEffect(() => {
        const getGenre = () => {
            setIsLoaded(false);
            const genreDictionaryUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY;
            const options = { method: 'GET', headers: { accept: 'application/json' } };
            fetch(genreDictionaryUrl, options)
                .then(res => res.json())
                .then((response) => {
                    const genreArr = response.genres;
                    const computeGenreMap = genreArr.reduce((acc, genreObj) => {
                        const { id, name } = genreObj;
                        return { ...acc, [id]: name }
                    }, {});
                    setGenreMap(computeGenreMap);
                })
                .catch(err => console.log("Error:", err))
                .finally(() => {
                    setIsLoaded(true);
                })
        }
        getGenre();
    }, []);

    const handleFilter = (event) => {
        const selectedGenreId = event.target.value;
        if (selectedGenreId === 'All'){
            setwatchlist(getWatchListFromLocalStorage);
        }else{
            const filteredWatchList = getWatchListFromLocalStorage().filter(({genreIds}) => 
                genreIds.includes(parseInt(selectedGenreId))
            );
            setwatchlist(filteredWatchList);

        }
    }

    const sortByRating = () => {
        const temp = [...watchlist]
        const filteredWatchList = temp.sort((a, b) => b.voteAverage - a.voteAverage);
        setwatchlist(filteredWatchList);
    }

    return (
        <div>
            {isEmptyWatchList ? (
                <div className="relative">
                    <div className=" text-gray-100 text-4xl top-40 relative">Watchlist empty</div>
                    <div className="text-8xl relative top-48 righ-48">🗑️</div>

                </div>
            ) : (
                <div className="text-white">
                    <div className="flex justify-between px-7">
                        {/* <button type="button" className="border-none px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 left-10">Filter By Genre</button> */}
                        <select name="cars" id="cars" className="border-none px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 left-10" onChange = {handleFilter}>
                        <option value="All">All</option>
                        {getWatchListFromLocalStorage().map(({genreIds = []}) => {
                            return (
                                genreIds.map(generId => <option key={generId} value={generId}>{genreMap[generId]}</option>)
                            )
                        })}
                        
                            
                        </select>

                        <button type="button" onClick={sortByRating} className="border-none px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 right-10">Sort By Rating</button>

                        <button type="button" onClick={sortById} className="border-none px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 right-10">Sort By ID</button>
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                        <table className="w-full text-sm text-left rtl:text-right text-white-500">
                            <thead className="text-xs uppercase bg-white-50 ">
                                <tr>

                                    <th scope="col" className="px-6 py-3">
                                        Poster
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Average rating
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Genre(s)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {watchlist.map((movie) => {
                                    const { id = "", title = "", releaseDate = "N/A", voteAverage = "", name = "", posterPath: posterLink, genreIds = [] } = movie;
                                    return (
                                        <tr key={id} className="border-b text-white">
                                            <td className="flex space-x-1 px-6 py-4 items-center">
                                                <img className="w-[120px] h-[30vh] min-h-[200px] rounded-xl m-4 md:h-[45vh] md:w-[180px]" src={`${IMAGE_BASE_URL}/${posterLink}`} alt={title || name} />
                                            </td>
                                            <td className="px-6 py-4">
                                                {title || name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {voteAverage}
                                            </td>
                                            <td className="px-6 py-4">
                                                {genreIds.map(genreId => genreMap[genreId]).join(", ")}
                                            </td>

                                            <td onClick={() => removeMediaFromLocalStorage(id)} className="space-x-1 px-6 py-4 text-right hover:text-red-500">
                                                <span>Delete</span>
                                                <span>🗑️</span>
                                            </td>
                                            {/* <td onClick={removeMediaFromLocalStorage(id)} className="px-6 py-4 text-right hover:text-red-500">
                                        Delete🗑️
                                    </td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex mx-[20px] mb-[12px] flex-wrap text-white">
                        {watchlist.map((movie, index) => {
                            const { title = "", name = "", posterPath } = movie; // if there is no title in the map
                            return (
                                <div>
                                    <div key={index}
                                        className="relative w-[160px] h-[30vh] block bg-cover rounded-xl m-4 md:h-[45vh] md:w-[180px] hover:scale-110 duration-300 cursor-pointer "
                                        style={{ backgroundImage: "url(" + IMAGE_BASE_URL + posterPath + ")" }}>
                                        <div onClick={() => removeMediaFromLocalStorage(movie.id)} className="p-2 right-2 absolute text-sm bg-gray-900 bg-opacity-60 rounded-b-md hover:bg-red-800">🗑️</div>
                                        <div className="absolute bottom-0 text-sm bg-gray-900 bg-opacity-60 p-2 text-white w-full align-middle">{title || name}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>

    );
}

export default Watchlist; 