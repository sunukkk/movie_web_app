import { authService } from 'fbase';
import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

function Profile({userObj}) {
  
  const Navigate = useNavigate();

  const onLogOutClick = () =>{
    authService.signOut();
    Navigate('/')
  }
  return (
    <>
    <div><button><Link to ='/'>back</Link></button></div>
    <div><button onClick={onLogOutClick}>Logout</button></div>
    <div>TITLE Profile</div>
    <div>{userObj.displayName ? userObj.displayName : "what's your nickname?"}</div>
    <div>{userObj.photoUrl ? userObj.photoUrl : "ProfileImage"}</div>
    <ul>
    
      <li>like list here li1</li>
      <li>like list here li2</li>
      <li>like list here li3</li>

    </ul>
    </>
  )
}

export default Profile