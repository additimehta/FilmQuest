import React, { useEffect, useState } from 'react'
import Search from './components/search.jsx'
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';

const API_BASE_URL = `https://api.themoviedb.org/3`;

const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept:'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState(' ');
  const [movieList, setmovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false );

  const fetchMovies = async (query = '') => {
    setisLoading(true);
    setErrorMsg('');
    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS); 
  

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      // parse data to json
      const data = await response.json();
      if(data.response == 'False') {
        setErrorMsg(data.Error || 'Failed to fetch movies');
        setmovieList([]);
        return;
      }

      setmovieList(data.results || []);
    } catch(error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMsg('Error fetching movies. Please try again later');
    } finally {
      setisLoading(false);
  
  
  }

  } 

  // only run this component when the dependencies load
  useEffect(() => {
    fetchMovies(searchTerm);

  },  [searchTerm]);
  return ( 
    <main>
      <div className="pattern" />
      <div className="wrappper">

        <header>
          <img src="./hero.png" alt="Hero Banner" />

          <h1>Discover <span className="text-gradient">Movies</span>You’ll Love, Effortlessly.</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) :(
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
             ))}
            </ul>


          )}
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
  
        </section>

        
        


      </div>
  
    </main>
  )
}

export default App
