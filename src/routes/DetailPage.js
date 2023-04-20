import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

function DetailPage() {
  const [movie, setMovie] = useState({});
  const { movieId } = useParams();

  const fetchData = async () => {
    const response = await axios.get(`/movie/${movieId}`);
    setMovie(response.data)
    console.log('movieId--->', response)
  }

  useEffect(() => {
    fetchData();
  }, [movieId]);
  


  return (
    <section>
      <img className='modal__poster-img' src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title||movie.name||movie.original_name}/>
      <h2>{movie.title}</h2>
      {movie.genres && movie.genres.map((genre, index) => (
        <span key={index}>{genre.name}</span>
      ))}
      <p>{movie.overview}</p>


    </section>
  );
}

export default DetailPage;
