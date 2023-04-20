import axios from '../api/axios';
import useOnClickOutside from 'hooks/useOnClickOutside';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import "styles/MovieModal.css";

function MovieModal({ setModalOpen, backdrop_path, overview, release_date, first_air_date, title, name, vote_average, id, genre_ids }) {
  const [movie, setMovie] = useState({});
  const ref = useRef();

  console.log('id ---> ', id);

  const fetchData = async () => {
    const { data: response } = await axios.get(`/movie/${id}`, {
      params: { append_to_response: "videos" },
    });
    setMovie(response);
    console.log(response.data);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useOnClickOutside(ref, () => { setModalOpen(false) });

  return (
    <div className='presentation'>
      <div className="wrapper-modal">
        <div className="modal" ref={ref}>
          <span className="modal-close" onClick={() => setModalOpen(false)}>X</span>
          <img alt="title? title: name" className="modal__poster-img"
            src={`https://image.tmdb.org/t/p/original/${backdrop_path}`} />
          <div className="modal__content">
            <p className="modal__details">
              <span className="modal__user-perc">100% for you</span> {" "}
              {release_date ? release_date : first_air_date}
            </p>
            <h2 className="modal__title">{title ? title : name}</h2>
            <p className="modal__details"> 평점 : {vote_average}</p>
            <p className="modal__overview">{overview}</p>
            {movie.genres && movie.genres.map((genre, index) => (
              <span key={index}>{genre.name}</span>))}
            {movie.videos?.results?.length && (
              <div className="modal__video">
                <h3>Videos</h3>
                <ul>
                  {movie.videos.results.map((video, index) => (
                    <li key={index}>
                      <iframe 
                        title="Trailer Video"
                        width="560" 
                        height="315" 
                        src={`https://www.youtube.com/embed/${movie.videos.results[index].key}`} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;