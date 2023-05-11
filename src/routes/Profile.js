
import Nav from 'components/Nav';
import { authService } from 'fbase';
import { updateProfile } from 'firebase/auth';

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import 'styles/Profile.css'

function Profile({userObj}) {
  
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newProfileImg, setNewProfileImg] = useState(userObj.photoURL);

  const Navigate = useNavigate();
  console.log({userObj})
  const onLogOutClick = () =>{
    authService.signOut();
    Navigate('/')
  }

  const onNameChange = e => {
    const {target: {value}} = e;
    setNewDisplayName(value);
  }

  const onNameSubmit = async () => {
    try {
      if (userObj.displayName !== newDisplayName) {
        await updateProfile(userObj, {
          displayName: newDisplayName,
          })
        };
      } catch (e) {
        console.error("Error adding document: ", e);
      }
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
      console.log(result)
      setNewProfileImg(result);
      
    }
    console.log(newProfileImg)
    reader.readAsDataURL(theFile)
  }

  const onFileSubmit = async () => {
    try {
      if (userObj.displayName !== newDisplayName) {
        await updateProfile(userObj, {
          photoURL: newProfileImg,
        })
      }console.log({userObj});
    } catch (e) {
      console.error("Error updating profile: ", e);
    }
  };

  
  



  return (
    <>
    <Nav/>
    <div className='profile_container'>
      <div className="profile_content">
        <div className='profile_btnbox'>
          <button><Link to ='/'>back</Link></button>
          <button onClick={onLogOutClick}>Logout</button>
        </div>
        <div className="profile_titlebox">
          <p className='profile_email'>{userObj.email} </p>
          <h2>Profile</h2>
        </div>
          
          <div>
            <div className="profile_image_box">
              <div className="profile_image" style={newProfileImg ? {backgroundImage: `url(${newProfileImg})`} :{backgroundImage: ''}}>
              </div>
            
            
              <form className='profile_form' onSubmit={onFileSubmit}>
                <label htmlFor="profile_file" className='profile_file'>
                <input className='profile_file' id='profile_file' type="file" accept='image/*' onChange={onFileChange}/>
                </label>
                <label htmlFor="profile_submit" className='profile_submit'>
                <input className='profile_submit' id='profile_submit' type="submit" value="Update Profile Image" />              
                </label>
                <label htmlFor="profile_remove" className='profile_remove'>
                <button className='profile_remove' id='profile_remove' /* onClick = {onRemoveClick} */> Remove </button>
                </label>
              </form>
            </div>
              
            <div className="profile_name_box">
              <input type="text" className="profile_name" placeholder="What's your name?" value={newDisplayName} onChange={onNameChange} />
              <button className='profile_name_edit' onClick = {onNameSubmit} >Edit Name</button>
            </div>
            
            
        </div>

        <ul>
          <li>like list here li1</li>
          <li>like list here li2</li>
          <li>like list here li3</li>
        </ul>
      </div>
    </div>
    </>
  )
}

export default Profile