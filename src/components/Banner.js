import React, { useEffect, useState } from 'react';
import axios from 'api/axios';
import requests from 'api/requests';
import 'styles/Banner.css';
import styled from 'styled-components';
import MovieModal from './MovieModal';

function Banner() {
  const [movie, setMovie] = useState({});
  const [isClicked, setIsClicked] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState({});

  const fetchData = async () => {
    const request = await axios.get(requests.fetchNowPlaying);

    const movieId = request.data.results[
      Math.floor(Math.random() * request.data.results.length + 0)
    ].id;

    //특정 영화의 더 상세한 정보 가져오기(tmdb api 공식문서참고)
    const { data: movieDetail } = await axios.get(`/movie/${movieId}`, {
      params: { append_to_response: "videos" },
    });
    setMovie(movieDetail);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const handleClick = (movie) => {
    setModalOpen(true);
    setMovieSelected(movie);
  };

  if (!isClicked) {
    return (
      <header
        className='banner'
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
          backgroundPosition: 'top center',
          backgroundSize: 'cover',
        }}
      >
        <div className='banner__contents'>
          <h1 className='banner__title'>
            {movie.title || movie.name || movie.original_name}
          </h1>
          <div className='banner__buttons'>
            <button
              className='banner__button play'
              onClick={() => setIsClicked(true)}
            >
              play
            </button>
            <button
              className='banner__button info'
              onClick={() => handleClick(movie)}
            >
              More Information
            </button>
          </div>
          <p className='banner__description'>
            {truncate(movie.overview, 100)}
          </p>
        </div>
        <div className='banner--fadeBottom'></div>
        {modalOpen && (
      <MovieModal {...movieSelected} setModalOpen={setModalOpen}
      />
    )}
      </header>
      
    );
  } else {
    return (
      <Container>
        <HomeContainer>
          <Iframe
            src={`https://www.youtube.com/embed/${movie.videos.results[0]?.key}?controls=0&autoplay=1&loop=1&mute=1&playlist=${movie.videos.results[0]?.key}`}
            width='640'
            height='360'
            frameborder='0'
            allow='autoplay; fullscreen;'
          ></Iframe>
        </HomeContainer>
        
      </Container>
    );

  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const HomeContainer = styled.div`
  width:100%;
  height:100%;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.65;
  border:none;

  &::after{
    content:'';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

`
export default Banner;
