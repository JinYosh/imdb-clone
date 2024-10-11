import './App.css';
import Header from "./components/header";
import Banner from "./components/banner";
import Movies from "./components/movies";
import Watchlist from './components/watchList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <Movies />
            </>
          }
          />
          <Route path="/watchlist" element={
            <>
              <Watchlist />
            </>
          }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
