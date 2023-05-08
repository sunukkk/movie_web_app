import axios from '../api/axios';
import useOnClickOutside from 'hooks/useOnClickOutside';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import "styles/MovieModal.css";

function MovieModal({ setModalOpen, id, mediaType, isLargeRow }) {
  const [movie, setMovie] = useState({});
  const ref = useRef();
  console.log('movie-----', movie)
  useOnClickOutside(ref, () => { setModalOpen(false) });
  
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {

    let url;
    if (isLargeRow == true) {
      url = `/tv/${id}`;
    } else {
      url = `/movie/${id}`;
    }

    const { data: response } = await axios.get(url, {
      params: { append_to_response: "videos" },
    });

    setMovie(response);
  };





  return (
    <div className='presentation'>
      <div className="wrapper-modal">
        <div className="modal" ref={ref}>
          <span className="modal-close" onClick={() => setModalOpen(false)}>X</span>
          <img alt={movie.title? movie.title: movie.name} className="modal__poster-img"
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} />
          <div className="modal__content">
            <p className="modal__details">
              <span className="modal__user-perc">100% for you</span> {" "}
              {movie.release_date ? movie.release_date : movie.first_air_date}
            </p>
            <h2 className="modal__title">{movie.title ? movie.title : movie.name}</h2>
            <p className="modal__details"> 평점 : {movie.vote_average}</p>
            <p className="modal__overview">{movie.overview}</p>
            <p>{movie.genres && movie.genres.map((genre, index) => (
              <span key={index}>{genre.name}</span>))}
            </p>
            {movie.videos?.results?.length ? (
              <div className="modal__video">
                <h3>Videos</h3>
                <ul>
                  {movie.videos.results.map((video, index) => (
                    <li key={index}>
                      <iframe   
                        title="Trailer Video"
                        width="560" 
                        height="315" 
                        src={`https://www.youtube.com/embed/${movie.videos.results[index].key}?autoplay=1&muted=1`}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
  
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ): null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
