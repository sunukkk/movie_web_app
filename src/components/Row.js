import axios from 'api/axios';
import React, { useEffect, useState } from 'react'
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



  useEffect(() =>{
    fetchMovieData();
  },[fetchUrl]);


  const handleClick = (movie) =>{
    setModalOpen(true)
    setMovieSelected(movie)
  }

  const fetchMovieData = async () =>{
    const request = await axios.get(fetchUrl)
    setMovies(request.data.results);
  }


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
        {/* 
        <div className='slider'>
          <div className='slider__arrow left'>
            <span className='arrow' onClick={()=>{document.getElementById(id).scrollLeft-=(window.innerWidth - 80)}}> 
              // 80은 hover했을 때 생기는 띠의 너비값
              {"<"}
            </span>
          </div>
        </div>
        */}
        <div className='row__posters' id={id}>
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <img
                className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
                onClick={() => handleClick(movie)}
                src={`https://image.tmdb.org/t/p/original${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                loading='lazy'
                alt={movie.title || movie.name || movie.original_name}
              />
            </SwiperSlide>
          ))}
          {/*
          <div className='slider__arrow right'>
            <span className='arrow' onClick={()=>{document.getElementById(id).scrollLeft+=(window.innerWidth - 80)}}>
              {">"}
            </span>
          </div>
          </div>
          */}
        </div>
      </Swiper>
      {modalOpen && (
        <MovieModal {...movieSelected} setModalOpen={setModalOpen} />
      )}
    </section>
  )
  
}

export default Row