import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ref, uploadString, getDownloadURL, deleteObject  } from "firebase/storage";
import { storage } from '../fbase';
import { db } from 'fbase';
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, } from "firebase/firestore";
import { useParams } from 'react-router-dom'

import 'styles/Profile.css'

function Profile({userObj},) {
  const profileNumber = useParams();
  console.log(profileNumber.id)

  const [newProfileName, setProfileName] = useState("");
  const [newProfileImg, setNewProfileImg] = useState("");

  const Navigate = useNavigate();

  useEffect(() => {
    const fetchProfileName = async () => {
      try {
        const profileDocRef = doc(db, `${userObj.email}`, `${profileNumber.id}`);
        const profileDocSnap = await getDoc(profileDocRef);
        const profileData = profileDocSnap.data();
        const profileName = profileData.name;
        const profileImageUrl = profileData.profileimage;

        if (profileImageUrl) {
          const profileUrl = await getDownloadURL(ref(storage, profileImageUrl));
          setNewProfileImg(profileUrl);
        }
        
        setProfileName(profileName);
      } catch (error) {
        console.error('Error fetching profile name:', error);
      }
    };

    fetchProfileName();
  }, [userObj]);



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
        console.log(newProfileImgUrl)
      }
      await updateDoc(doc(db, `${userObj.email}/${profileNumber.id}`), {
        profileimage : newProfileImgUrl
      });
    } catch (e){
      console.error("Error adding document: ", e);
    }
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




  return (
    <>
    <div className='profile_container'>
      <div className="profile_content">
        <div className='profile_btnbox'>
          <button><Link to ='/'>back</Link></button>

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
                  <input className='profile_file' id='profile_file' type="file" accept='image/*' onChange={onFileChange}/>
                  </label>
                  <label htmlFor="profile_submit" className='profile_submit'>
                  <input className='profile_submit' id='profile_submit' type="submit" value="Update Profile Image" />              
                  </label>
                  <label htmlFor="profile_remove" className='profile_remove'>
                  <button className='profile_remove' id='profile_remove' onClick = {onRemoveClick}> Remove </button>
                  </label>
                </form>
              </div>
                
              <div className="profile_name_box">
                <input type="text" className="profile_name" placeholder="What's your name?" value = {newProfileName} onChange={onNameChange} />
                <button className='profile_name_edit' onClick = {onNameSubmit} >Edit Name</button>
              </div>
            </div>

            <div className="profile_select">
              <Link to ="/profileselect">
                <button className="profile_select_btn">Select Profile</button>
              </Link>
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