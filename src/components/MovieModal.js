import axios from '../api/axios';
import axiosimage from '../api/axiosimage'
import useOnClickOutside from 'hooks/useOnClickOutside';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import "styles/MovieModal.css";


function MovieModal({ setModalOpen, id, fetchUrl, isTv }) {
  

  const [movie, setMovie] = useState({});
  const ref = useRef();
  const [koposters, setKoposters] = useState([])
  useOnClickOutside(ref, () => { setModalOpen(false) });
 

  useEffect(() => {
    fetchData();
  }, [id, fetchUrl]);

  const fetchData = async () => {
    setMovie({})
    /* ::: ex) https://api.themoviedb.org/3/tv/119051?api_key={api_key}}&append_to_response=videos,images ::: */
    let url;
    if (fetchUrl) {
      url = fetchUrl;
    } else {
      url = isTv ? `/tv/${id}` : `/movie/${id}`;
    }

    const { data: response } = await axios.get(url, {
      params: { append_to_response: "videos" },
    });
    
    const { data: image_response } = await axiosimage.get(url, {
      params: { append_to_response: "images"}
    });
    const movieData = { ...response, images: image_response.images }

    const koposters = image_response.images.posters.filter(
      (poster) => poster.iso_639_1 === 'ko'
    );
  
    setMovie(movieData);
    setKoposters(koposters);
  };

  return (
    <div className='presentation'>
      <div className="wrapper-modal">
        <div className="modal" ref={ref}>
          <span className="modal-close" onClick={() => setModalOpen(false)}>X</span>
          <img alt={movie.title? movie.title: movie.name} className="modal__poster-img"
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} />
          <div className="modal__content">
            <p className="modal__details">
              <span className="modal__user-perc">100% for you</span> {" "}
              {movie.release_date ? movie.release_date : movie.first_air_date}
            </p>
            <div className='title_genres'>
              <h2 className="modal__title">{movie.title ? movie.title : movie.name}</h2>
              <p>{movie.genres && movie.genres.map((genre, index) => (
                <span key={index}>{genre.name} </span>))}
              </p>
            </div>
            <p className="modal__details"> 평점 : {movie.vote_average}</p>
            <p className="modal__overview">{movie.overview}</p>

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
                        src={`https://www.youtube.com/embed/${movie.videos.results[index].key}?autoplay=0&mute=1`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {koposters.length ? (
              <div className="modal__posters">
                <h3>Posters</h3>
                <ul>
                  {koposters.map((poster, index) => (
                    <li key={index}>
                      <img
                        src={`https://image.tmdb.org/t/p/original/${poster.file_path}`}
                        alt="Poster"
                        width="100%"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
