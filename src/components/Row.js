import axios from 'api/axios';
import React, { useEffect, useRef, useState } from 'react'
import MovieModal from './MovieModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { doc, updateDoc, getDoc } from "firebase/firestore";

import 'styles/Row.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { useLocation } from 'react-router-dom';
import { db } from 'fbase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimesCircle, faInfoCircle } from '@fortawesome/fontawesome-free-solid';

function Row({ isTv, title, id, fetchUrl, userObj }) {

  const [likeMovies, setLikeMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false)
  const [movieSelected, setMovieSelected] = useState({})
  const [hoveredMovie, setHoveredMovie] = useState({})
  const [hoveredMovieId, setHoveredMovieId] = useState(null)
  const nowPlaying = useRef(null)

  const [profileNumber, setProfileNumber] = useState({})
  const location = useLocation();
  const currentURL = location.pathname;

  useEffect(() => {
    const fetchMovieData = async (userObj) => {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
  
        const docRef = doc(db, `${userObj.email}`, `${profileNumber}`);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setLikeMovies(docSnap.data().like);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
  
    setProfileNumber(currentURL);
    fetchMovieData(userObj);
  }, [fetchUrl, userObj, profileNumber, currentURL]);
  

  const onInfoClick = (movie) => {
    setModalOpen(true);
    setMovieSelected(movie);
  };

  const onLikeClick = async (movie, userObj) => {
  let url;
  if (isTv) {
    url = `/tv/${movie.id}`;
  } else {
    url = `/movie/${movie.id}`;
  }

  try {
    const profileDocRef = doc(db, `${userObj.email}`, `${profileNumber}`);

    // 이미 좋아요한 영화인지 확인
    if (likeMovies.includes(url)) {
      // 이미 좋아요한 영화 - 좋아요 취소
      const updatedLikeMovies = likeMovies.filter(
        (likedMovieUrl) => likedMovieUrl !== url
      );
      setLikeMovies(updatedLikeMovies);

      // Firestore 문서 업데이트 - 좋아요한 영화 목록에서 해당 URL 제거
      await updateDoc(profileDocRef, {
        like: updatedLikeMovies,
      });
      console.log(updatedLikeMovies)
    } else {
      // 좋아요한 영화 목록에 추가
      const updatedLikeMovies = [...likeMovies, url];
      setLikeMovies(updatedLikeMovies);

      // Firestore 문서 업데이트 - 좋아요한 영화 목록에 해당 URL 추가
      await updateDoc(profileDocRef, {
        like: updatedLikeMovies,
      });
      console.log(updatedLikeMovies)
    }
    
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  const onMouseEnter = async (movie) => {
    setMovieSelected(movie)
    setHoveredMovieId(movie.id)
    
    let url = `/movie/${movie.id}`;
    if (isTv) {
      url = `/tv/${movie.id}`;
    }
    const { data: response } = await axios.get(url, {
      params: { append_to_response: "videos" },
    });
    
    
    setHoveredMovie(response);
    console.log(hoveredMovieId)
  
    
    if (nowPlaying.current && response.videos.results[0]) {
      nowPlaying.current.src = `https://www.youtube.com/embed/${response.videos.results[0].key}?autoplay=1&mute=1`;
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

    return (
    <section className='row' key={id}>
      <h2 className='row_title'>{title}</h2>
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
                   
                <img className={`row__poster ${isTv && 'row__posterLarge'}`}
                     onClick={() => onInfoClick(movie)}
                     src={`https://image.tmdb.org/t/p/original${ isTv ? movie.poster_path : movie.backdrop_path }`}
                     loading='lazy'
                     alt={movie.title || movie.name || movie.original_name}/>

                <div className='poster-detail'>
                  {hoveredMovie.id === movie.id && hoveredMovie.videos?.results[0] && (
                    <div className="movie-detail-trailor">
                      <iframe 
                        ref={nowPlaying}
                        title="Trailer Video"
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${hoveredMovie.videos.results[0].key}?autoplay=1&mute=1&controls=0`} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </div>
                  )}
                    <div className="poster-detail-text">
                      <p className='poster-detail-title'>{movie.title || movie.name || movie.original_name} </p>
                      <p className='poster-detail-overview'>{movie.overview.length > 50 ? `${movie.overview.slice(0, 70)}...` : movie.overview}</p>
                      <div className='poster-detail-btnbox'>
                        <button className='detail-button-info' onClick={() => onInfoClick(movie)}>
                          <FontAwesomeIcon icon={faInfoCircle} size="2xl" style={{color: "#ffffff"}} />  
                        </button>
                        <button className='detail-button-like' onClick={() => onLikeClick(movie, userObj)}>
                          {likeMovies.includes(`/movie/${movie.id}`) || likeMovies.includes(`/tv/${movie.id}`) ?
                          <FontAwesomeIcon icon={faTimesCircle} size="2xl" style={{color: "#e50712"}} /> :
                          <FontAwesomeIcon icon={faHeart} size="2xl" style={{color: "#e50712"}} />
                           }
                       </button>
                      </div>
                    </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
      {modalOpen && (
        <MovieModal {...movieSelected} isTv={isTv} setModalOpen={setModalOpen} />
      )}
    </section>
  );
}

export default Row