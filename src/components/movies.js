// import avatar from "./Avatar.jpg";
// import movie_1 from "./Movie_1.jfif";
// import movie_2 from "./Movie_2.jfif";
// import movie_3 from "./Movie_3.jfif";
// import movie_4 from "./Movie_4.jfif";
import {API_KEY, IMAGE_BASE_URL, WATCHLIST_KEY} from "./constants.js";
import {useState, useEffect} from "react";
import {getWatchListFromLocalStorage} from "./utill.js"
function Movies() {
    const [movies, setMovies] = useState([]); 
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoaded, setIsLoaded] = useState(true);
    const [showPrevNext, setShowPrevNext] = useState(false);
    const [watchlist, setwatchlist] = useState(getWatchListFromLocalStorage());
    const [searchQuery, setSerchQuery] = useState("");

    var newPage = 0;
    const handleNextPage = () => {
        setShowPrevNext(false);
        setPageNumber(() => {
            if ((pageNumber + 1) > 500) {
                newPage = 500
            }else{
                newPage = pageNumber + 1;
            }
            return newPage;
        });
    }
    const handlePrevPage = () => {
        setShowPrevNext(false);
        setPageNumber(() => {        
            if ((pageNumber - 1) <= 1) {
                newPage = 1;
            }else{
                newPage = pageNumber - 1;
            }
            return newPage;
        });
    }

    const removeMediaAlreadyPresentInWatchList = (movie, watchlistMovies) => {
        const index = watchlistMovies.findIndex((watchmov) => watchmov.id === movie.id);
        watchlistMovies.splice(index, 1);
        return watchlistMovies
    }

    const isMediaALreadyPresentInWatchList = (movieId, watchlistMovies) => {
        return watchlistMovies.find((movie) => movie.id === movieId)
    }
    const saveToLocalStorage = (moviesObj) => {
        let currentWatchList = getWatchListFromLocalStorage();

        if (isMediaALreadyPresentInWatchList(moviesObj.id, currentWatchList)) {
            currentWatchList = removeMediaAlreadyPresentInWatchList(moviesObj, currentWatchList);
        } else {
            currentWatchList = [...currentWatchList,
            {
                id: moviesObj.id,
                title: moviesObj.title,
                name: moviesObj.name,
                posterPath: moviesObj.poster_path,
                releaseDate: moviesObj.release_date,
                voteAverage: moviesObj.vote_average,
                genreIds: moviesObj.genre_ids,
            },
            ];
        }
        //console.log("currentWatchList:", currentWatchList);
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(currentWatchList));
        setwatchlist(currentWatchList);    
    }

    useEffect(() => {
        //console.log("Page:",pageNumber)
        //const trendingMovieUrl = 'https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=' + API_KEY + "&page=" + pageNumber;
        const trendingMovieUrl = 'https://api.themoviedb.org/3/trending/movie/week?language=en-US&api_key=' + API_KEY + "&page=" + pageNumber;
        const searchMovieUrl = 'https://api.themoviedb.org/3/search/movie?language=en-US&api_key=' + API_KEY + "&query=" + searchQuery + "&page=" + pageNumber;
        const options = { method: 'GET', headers: { accept: 'application/json' } };
        const getMovies = () => {
            setIsLoaded(false);
        
            fetch(trendingMovieUrl, options)
                .then(res => res.json())
                .then(json => setMovies(() => {return json.results;}))
                .catch(err => console.error('error:' + err))
                .finally(()=>{
                    setShowPrevNext(true);
                    setIsLoaded(true);
                });
        }
        const searchMovie = (searchText) => {
            setIsLoaded(false);
            setShowPrevNext(false);
            fetch(searchMovieUrl, options)
                .then(res => res.json())
                .then(json => setMovies(() => {return json.results;}))
                .catch(err => console.error('error:' + err))
                .finally(()=>{
                    setShowPrevNext(true);
                    setIsLoaded(true);
                });
        }
        if (searchQuery){
            searchMovie(searchQuery);
        }else{
            getMovies();
        }
    }, [pageNumber, searchQuery]);
    
    return (
        <div className="bg-gray-900 text-white">
            <div className="text-2xl md-8 pb-4 text-white font-extrabold text-left pt-10 pl-10">Tending movies</div>
            <div className="flex justify-end px-12">
            <input className="rounded-xl px-4 py-0.5 text-black border-0 outline-none font-normal" value={searchQuery} onChange={(e) => setSerchQuery(e.target.value)} placeholder="Search"/>
            </div>
            {!isLoaded ? (
                <div class="text-center">
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="flex mx-[20px] mb-[12px] flex-wrap">
                    {movies.map((movie, index) => {
                        const { title = "", name = "", poster_path: posterPath } = movie // if there is no title in the map
                        return (
                            <div>
                                <div key={index}
                                    className="w-[160px] h-[30vh] block bg-cover rounded-xl m-4 md:h-[45vh] md:w-[180px] hover:scale-110 duration-300 cursor-pointer relative"
                                    onClick={() => saveToLocalStorage(movie)} style={{ backgroundImage: "url(" + IMAGE_BASE_URL + posterPath + ")" }}>
                                    <div className="p-2 right-2 absolute text-sm bg-gray-900 bg-opacity-60 rounded-b-md">
                                        {isMediaALreadyPresentInWatchList(movie.id, watchlist) ? "❤️" : "🤍"}
                                    </div>
                                    <div className=" text-sm bg-gray-900 bg-opacity-60 p-2 text-white w-full align-middle absolute bottom-0 rounded-br-lg">{title || name}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showPrevNext ? (
                <div id="pagination" className="flex justify-around space-x-2">
                    <button disabled={pageNumber === 1 || !isLoaded} onClick={handlePrevPage}>Previous</button>
                    <h3>{pageNumber}</h3>
                    <button disabled={pageNumber >= 500 || !isLoaded} onClick={handleNextPage}>Next</button>
                </div>
            ) : (<div></div>)
            }
            
        </div>
    );
}

export default Movies;