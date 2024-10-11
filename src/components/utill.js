import { WATCHLIST_KEY } from "./constants";

export const getWatchListFromLocalStorage = () => {
    let watchlist = localStorage.getItem(WATCHLIST_KEY);
    let value;
    if (watchlist){
        value = JSON.parse(watchlist);
    }else{
        value = [];
    }
    return value;
};
