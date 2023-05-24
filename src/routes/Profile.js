import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ref, uploadString, getDownloadURL, deleteObject  } from "firebase/storage";
import { storage } from '../fbase';
import { db } from 'fbase';
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, } from "firebase/firestore";
import { useParams } from 'react-router-dom'

import axios from 'api/axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft ,faImage, faCheckCircle, faTrash, faPencilAlt, faTimesCircle, faInfoCircle } from '@fortawesome/fontawesome-free-solid';
import 'styles/Profile.css'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import MovieModal from 'components/MovieModal';

function Profile({isTv, userObj, setIsProfileSelect}) {
  const profileNumber = useParams();

  const [newProfileName, setProfileName] = useState("");
  const [newProfileImg, setNewProfileImg] = useState("");
  const [profileLikes, setProfileLikes] = useState([]);
  const [profileLikeData, setprofileLikeData] = useState([]);
  const Navigate = useNavigate();

  const [hoveredMovie, setHoveredMovie] = useState({})
  const [hoveredMovieId, setHoveredMovieId] = useState(null)
  const [movieSelected, setMovieSelected] = useState({})
  const nowPlaying = useRef(null)

  
  const [selectedUrl, setSelectedUrl] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [unlikeClicked, setUnlikeClicked] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileDocRef = doc(db, `${userObj.email}`, `${profileNumber.id}`);
        const profileData = (await getDoc(profileDocRef)).data();
        const profileName = profileData.name;
        const profileImageUrl = profileData.profileimage;
        const profileLikes = profileData.like;
  
        if (profileImageUrl) {
          const profileUrl = await getDownloadURL(ref(storage, profileImageUrl));
          setNewProfileImg(profileUrl);
        }
  
        setProfileName(profileName);
        setProfileLikes(profileLikes);
      } catch (error) {
        console.error('Error fetching profile name:', error);
      }
    };
  
    fetchProfileData();
    setUnlikeClicked(false);
  }, [userObj, profileNumber.id, unlikeClicked]);
  
  useEffect(() => {
    const fetchProfileLikeData = async () => {
      const profileLikeData = [];
  
      for (const url of profileLikes) {
        const { data: response } = await axios.get(url, {
          params: { append_to_response: "videos" },
        });
  
        profileLikeData.push(response);
      }
  
      setprofileLikeData(profileLikeData);
    };
  
    fetchProfileLikeData();
  }, [profileLikes]);


  const onSelectProfileClick = () =>{
    Navigate(-1)
    setIsProfileSelect(false)
  }

  const onNameChange = e => {
    setProfileName(e.target.value);
  }

  const onNameSubmit = async () => {
    try {
      const profileDocRef = doc(db, `${userObj.email}`, `${profileNumber.id}`);
      await updateDoc(profileDocRef, {
        name: newProfileName,
      });
    } catch (e) {
      console.error('Error updating document: ', e);
    }
    window.alert('프로필 이름이 변경되었습니다.')
  };
  
  const onFileChange = (e) =>{
    const {target: {files}} = e;
    const theFile = files[0]

    if(!theFile){
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) =>{
      const {currentTarget:{result}} = finishedEvent;
      setNewProfileImg(result);
      
    }
    reader.readAsDataURL(theFile)
  }

  const onFileSubmit = async e =>{
    e.preventDefault();
    
    try{
      let newProfileImgUrl = "";

      if(newProfileImg !== ""){
        const storageRef = ref(storage, `${userObj.email}/${profileNumber.id}/profileImg`);
        const response = await uploadString(storageRef, newProfileImg, 'data_url');
        newProfileImgUrl = await getDownloadURL(ref(storage, response.ref))
      }
      await updateDoc(doc(db, `${userObj.email}/${profileNumber.id}`), {
        profileimage : newProfileImgUrl
      });
      
    } catch (e){
      console.error("Error adding document: ", e);
    }
    window.alert('프로필 사진이 변경되었습니다.')
  }
  
  const onRemoveClick = async () => {
    const ok = window.confirm("프로필 사진을 삭제하시겠습니까?");
    if (ok) {
      try {
        const storageRef = ref(storage, userObj.photoURL);
        await deleteObject(storageRef);
        await updateProfile(userObj,{
          photoURL : ''
        });
        ;
      } catch (e) {
        console.error("Error deleting image: ", e);
      }
      setNewProfileImg("");
    }
  }; 

  const onMouseEnter = async (movie) => {
    setMovieSelected(movie)
    setHoveredMovieId(movie.id)
  }

  const onMouseLeave = () => {
    setHoveredMovieId(null);
    setMovieSelected({});
    if (nowPlaying.current) {
      nowPlaying.current.src = ""; 
    }
  }

  const onInfoClick = async (movie) => {
    setModalOpen(true);
    setMovieSelected(movie);
  
    let selectedUrl = '';
  
    const profileDocRef = doc(db, `${userObj.email}`, profileNumber.id);
    const docSnap = await getDoc(profileDocRef);
    const movieUrls = docSnap.data().like;
  
    for (const url of movieUrls) {
      if (url.includes(`/${movie.id}`)) {
        selectedUrl = url;
        break;
      }
    }
  
    setSelectedUrl(selectedUrl);
  };
  
  const onUnLikeClick = async (movie, userObj) => {
    try {
      const profileDocRef = doc(db, `${userObj.email}`, `${profileNumber.id}`);
      const docSnap = await getDoc(profileDocRef);
      const ListLikes = docSnap.data().like;
  
      const selectedLikeMovieId = movie.id;
  
      const updatedProfileLikes = ListLikes.filter(
        (likedMovieUrl) => !likedMovieUrl.includes(selectedLikeMovieId)
      );

      await updateDoc(profileDocRef, {
        like: updatedProfileLikes,
      });
  
      setUnlikeClicked(true);
    } catch (error) {
      console.error("error");
    }
  };
  

  const fetchProfileLikeData = async () => {
    const profileLikeData = [];
  
    for (const url of profileLikes) {
      const { data: response } = await axios.get(url, {
        params: { append_to_response: "videos" },
      });
  
      profileLikeData.push(response);
    }
  
    setprofileLikeData(profileLikeData)
    fetchProfileLikeData();;
  };
  


  return (
    <>
    <div className='profile_container'>
      <div className="profile_content">
        <div className='profile_btnbox'>
          <button onClick={onSelectProfileClick}> <FontAwesomeIcon icon={faArrowLeft} size="2xl" style={{color: "#ffffff"}} /></button> 
        </div>

        <div className="profile_titlebox">
          <h2>Profile</h2>
          <p className='profile_email'>{userObj.email} </p>
        </div>

          <div className='profile_box'>
            <div className="profile_user">
              <div className="profile_user_box">
                <div className="profile_image empty" style={newProfileImg ? {backgroundImage: `url(${newProfileImg})`} :{backgroundImage: ''}}>
                </div>
              
                <form className='profile_form' onSubmit={onFileSubmit}>
                  <label htmlFor="profile_file" className='profile_file'>
                    <FontAwesomeIcon icon={faImage} size="2xl" style={{color: "#ffffff"}} />
                  <input className='blind' id='profile_file' type="file" accept='image/*' onChange={onFileChange}/>
                  </label>

                  <label htmlFor="profile_submit" className='profile_submit'>
                    <FontAwesomeIcon icon={faCheckCircle} size="2xl" style={{color: "#ffffff"}} />
                  <input className='blind' id='profile_submit' type="submit" value="Update Profile Image" />              
                  </label>

                  <label htmlFor="profile_remove" className='profile_remove'>
                    <FontAwesomeIcon icon={faTrash} size="2xl" style={{color: "#ffffff"}} />
                  <button className='blind' id='profile_remove' onClick = {onRemoveClick}> Remove </button>
                  </label>
                </form>
              
                
                <div className="profile_name_box">
                  <input type="text" className="profile_name" placeholder="What's your name?" value = {newProfileName} onChange={onNameChange} />
                  <button className='profile_name_edit' onClick = {onNameSubmit} >
                  <FontAwesomeIcon icon={faPencilAlt} size="2xl" style={{color: "#ffffff"}} />
                  </button>
                </div>
              </div>
            </div>

          </div>
          <div className='row'>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              breakpoints={{
                1378: {
                  slidesPerView: 6,
                  slidesPerGroup: 6,
                },
                998: {
                  slidesPerView: 5,
                  slidesPerGroup: 5,
                },
                625: {
                  slidesPerView: 4,
                  slidesPerGroup: 4,
                },
                0: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                }
              }}
            >
              <div className='row__posters'>
              {profileLikeData.map((movie, index) => (
                <SwiperSlide key={index} className="profile_item">
                  <div className={`movie__poster-container ${movie.id === hoveredMovieId ? 'on' : ''}`}
                   onMouseEnter={() => onMouseEnter(movie)}
                   onMouseLeave={() => onMouseLeave()}>

                    <img
                      className={`row__poster`}
                      src={`https://image.tmdb.org/t/p/original${movie.poster_path || movie.backdrop_path }`}
                      loading='lazy'
                      alt={movie.title || movie.name || movie.original_name}/>

                    <div className='poster-detail'>{hoveredMovie.id === movie.id && hoveredMovie.videos?.results[0] && (
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
                        <button className='detail-button-like' onClick={() => onUnLikeClick(movie, userObj)}>
                        <FontAwesomeIcon icon={faTimesCircle} size="2xl" style={{color: "#e50712"}} /> 
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
              <MovieModal {...movieSelected} fetchUrl = {selectedUrl} isTv={isTv} setModalOpen={setModalOpen} />
            )}
            </div>

          

          </div>
        </div>
      </>
    );
  }

export default Profile