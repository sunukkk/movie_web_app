import axios from 'api/axios';
import React, { useEffect, useRef, useState } from 'react'
import MovieModal from './MovieModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import 'styles/Row.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Row({isLargeRow, title, id, fetchUrl}) {
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false)
  const [movieSelected, setMovieSelected] = useState({})
  const [hoveredMovie, setHoveredMovie] = useState({})
  const [hoveredMovieId, setHoveredMovieId] = useState(null)
  const nowPlaying = useRef(null)
  
  
  const handleClick = (movie) =>{
    setModalOpen(true)
    setMovieSelected(movie)
  }

  const fetchMovieData = async () =>{
    const request = await axios.get(fetchUrl)
    setMovies(request.data.results);
  }
  
  const onMouseEnter = async (movie) =>{
    setMovieSelected(movie)
    setHoveredMovieId(movie.id)

    let url = `/movie/${movie.id}`;
    if (isLargeRow) {
      url = `/tv/${movie.id}`;
    }
    const { data: response } = await axios.get(url, {
      params: { append_to_response: "videos" },
    });
    setHoveredMovie(response);
    
    if (nowPlaying.current && response.videos.results[0]) {
      nowPlaying.current.src = `https://www.youtube.com/embed/${response.videos.results[0].key}?autoplay=1`;
    } else if (nowPlaying.current) {
      nowPlaying.current.src = "";
    }
  }

    const onMouseLeave = () => {
      setHoveredMovieId(null)
      setMovieSelected({})
      if (nowPlaying.current) {
        nowPlaying.current.src = ""; 
      }
    }

    useEffect(() =>{
      fetchMovieData();
      console.log('fetchUrl: ', fetchUrl);
    }, [fetchUrl]);
    
    useEffect(() => {
      console.log('movies: ', movies);
    }, [movies]);

  return (
    <section className='row' key={id}>
      <h2>{title}</h2>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation // 애로우버튼 사용 유무
        pagination={{ clickable: true }} // 페이지 버튼 보이게 할지 여부
        loop={true}
        breakpoints={{
          1378:{
            slidesPerView: 6,  //한번에 보일 슬라이드 갯수
            slidesPerGroup: 6  //한번에 이동할 슬라이드 갯수
          },
          998:{
            slidesPerView: 5,  
            slidesPerGroup: 5  
          },
          625:{
            slidesPerView: 4,  
            slidesPerGroup: 4  
          },
          0:{
            slidesPerView: 3,  
            slidesPerGroup: 3  
          }
        }} 

      >
        <div className='row__posters' id={id}>
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div className={`movie__poster-container ${movie.id === hoveredMovieId ? 'on' : ''}`}
                   onMouseEnter={() => onMouseEnter(movie)}
                   onMouseLeave={() => onMouseLeave()}>
                
                <img className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
                     onClick={() => handleClick(movie)}
                     src={`https://image.tmdb.org/t/p/original${ isLargeRow ? movie.poster_path : movie.backdrop_path }`}
                     loading='lazy'
                     alt={movie.title || movie.name || movie.original_name}/>
              

                <div className='poster-detail'>
                  {hoveredMovie.id === movie.id && hoveredMovie.videos?.results[0] && (
                    <p className="movie-detail-trailor">
                      <iframe 
                        onClick={() => handleClick(movie)}
                        ref={nowPlaying}
                        title="Trailer Video"
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${hoveredMovie.videos.results[0].key}?autoplay=1`} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </p>
                  )}
                  <div className="poster-detail-text" onClick={() => handleClick(movie)}>
                    <p className='poster-detail-title'>{movie.title || movie.name || movie.original_name}</p>
                    <p className='poster-detail-overview'>{movie.overview.length > 50 ? `${movie.overview.slice(0, 80)}...` : movie.overview}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
      {modalOpen && (
        <MovieModal {...movieSelected} fetchUrl={fetchUrl} isLargeRow={isLargeRow} setModalOpen={setModalOpen} />
      )}
    </section>
  );
}

export default Row