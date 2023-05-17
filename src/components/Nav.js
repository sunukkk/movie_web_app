import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import AppLogo  from '../images/MovieAppLogo.svg';

import '../styles/Nav.css'


function Nav({isProfileSelect, setIsProfileSelect}) {

  const [show, setShow] = useState("");
  const [searchValue, setSearchValue] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if(window.scrollY > 50){
        setShow(true)
      } else{
        setShow("")
      }
    });
    return () =>{
      window.removeEventListener("scroll", () => {})
    }
  }, [])
  
  const onChange = e =>{
    setSearchValue(e.target.value);
    navigate(`/search?q=${e.target.value}`);
  }

  const onProfileClick = () =>{
    setIsProfileSelect(false)
  }

  return (
    <nav className = {`nav ${show && 'nav__black'}`}>

      <img src={AppLogo} alt='App Logo' className='nav__logo' onClick={() =>{window.location.href = "/movie_web_app/"}}  />

      <input type="search" placeholder='영화를 검색해주세요' className='nav__input' onChange={onChange} value={searchValue}/>
      
      <Link to ="/profileselect" onClick={onProfileClick}>
      <p className='nav__user_logged' alt='User logged'>Profile</p>
         
      </Link>

    </nav>
  )
}

export default Nav