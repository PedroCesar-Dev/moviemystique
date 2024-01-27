import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = 'c7d5d74002714d556db78df2f0903ca0';

const MovieList = ({ movies, title }) => (
  <div className="movie-list">
    <h2>{title}</h2>
    <ul>
      {movies.map((movie) => (
        <li key={movie.id} className="movie">
          <h3>{movie.title}</h3>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
              movie.title
            )} trailer`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="movie-image"
            />
          </a>
          <div>
            {movie.rating && <p className="movie-rating">Rating: {movie.rating}</p>}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const App = () => {
  const [currentMovies, setCurrentMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const fetchMovies = async (url) => {
    try {
      const response = await axios.get(url);
      const moviesWithDetails = await Promise.all(
        response.data.results.map(async (movie) => {
          const detailsResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
          );
  
          const rating = detailsResponse.data.vote_average || 'N/A';
  
          return {
            ...movie,
            rating,
          };
        })
      );
      setCurrentMovies(moviesWithDetails);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedGenre) {
      fetchMovies(selectedGenre.url);
    }
  }, [selectedGenre]);

  const handleButtonClick = (genre) => {
    setSelectedGenre(genre);
  };

  const genres = [
    {
      label: 'Most Watched Movies',
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&language=en-US&page=1`,
    },
    {
      label: 'Comedy Movies',
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35&language=en-US&page=1`,
    },
    {
      label: 'Action Movies',
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28&language=en-US&page=1`,
    },
    {
      label: 'Drama Movies',
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=18&language=en-US&page=1`,
    },
    {
      label: 'Horror Movies',
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27&language=en-US&page=1`,
    },
    {
      label: 'Romance Movies',
      url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749&language=en-US&page=1`,
    },
  ];

  return (
    <div className="container">
      <div className="label">MovieMystique</div>
      <div className="buttons-container">
        {genres.map((genre) => (
          <button key={genre.label} className="button" onClick={() => handleButtonClick(genre)}>
            {genre.label}
          </button>
        ))}
      </div><br/><br/>

      <MovieList
        movies={currentMovies}
        title={selectedGenre ? selectedGenre.label : 'Select a Movie List'}
      />
    </div>
  );
};


export default App;
