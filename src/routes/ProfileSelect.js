import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from 'fbase';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, authService } from '../fbase';

import 'styles/ProfileSelect.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt, faPlusCircle } from '@fortawesome/fontawesome-free-solid';

function ProfileSelect({ userObj, isProfileSelect, setIsProfileSelect, likeMovies, setLikeMovies}) {
 
  const [profiles, setProfiles] = useState([]);
  const [profileImages, setProfileImages] = useState({});
  
  const Navigate = useNavigate();

  const handleProfileSelect = () => {
    setIsProfileSelect(true);
  };

  const onLogOutClick = () =>{
    setIsProfileSelect(false);
    authService.signOut();
    Navigate('/')
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      const querySnapshot = await getDocs(collection(db, userObj.email));
      const profilesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setProfiles(profilesData);

      const images = {};
      for (const profile of profilesData) {
        const imageUrl = profile.data.profileimage;
        if (imageUrl) {
          const downloadUrl = await getDownloadURL(ref(storage, imageUrl));
          images[profile.id] = downloadUrl;
        }
      }
      setProfileImages(images);
    };

    fetchProfiles();
  }, [userObj]);



  const onAddProfile = async (e) => {
    e.preventDefault();
  
    if (profiles.length > 4) {
      alert('프로필은 최대 5개까지 추가할 수 있습니다.');
      return;
    }
  
    try {
      const newProfileId = profiles.length + 1;
      await setDoc(doc(db, userObj.email, `${newProfileId}`), {
        name: 'profile',
        like: '',
        profileimage: '',
      });
      setProfiles((prevProfiles) => [
        ...prevProfiles,
        { id: `${newProfileId}`, data: { name: 'profile', like: '', profileimage: '' } },
      ]);
    } catch (error) {
      console.error('Error adding profile:', error);
    }
  };
  
  const onDeleteProfile = async (profileId) => {
    
    if (profiles.length === 1) {
      alert('프로필은 최소한 1개는 있어야 합니다.');
      return;
    }
  
    if (window.confirm('프로필을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, userObj.email, profileId));
  
        const imageUrl = profiles.find((profile) => profile.id === profileId)?.data.profileimage;
        if (imageUrl) {
          const storageRef = ref(storage, `${userObj.email}/${profileId}/profileImg`);
          await deleteObject(storageRef);
        }
        alert('프로필이 삭제되었습니다.');
  
        setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== profileId));
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };
  

  return (
    <div className="profileselect">
      <div className="profileselect_titlebox">
        <h2 className="profileselect_title">ProfileSelect</h2>
        <button onClick={onLogOutClick}>Logout</button>
      </div>

      <div className="profileselect_users">
        {profiles.map((profile) => (
          <div className="profileselect_user" key={profile.id} >
            <Link to={{ pathname:`/${profile.id}`}}>
              <div className="profileselect_image empty" onClick={handleProfileSelect} style={profileImages[profile.id] ? { backgroundImage: `url(${profileImages[profile.id]})` } : { backgroundImage: '' }}>
              </div>
              </Link>
            <div className="profileselect_user_box">
              <div className="profileselect_name">{profile.data.name}</div>
              <div className="profile_btn_box">
              <button className='profile_delete_btn' onClick={() => onDeleteProfile(profile.id)}>
                <FontAwesomeIcon icon={faCircleXmark} size="2xl" style={{color: "#ffffff"}} />
              </button>
            
              <Link to={`/${profile.id}/profile`}>
                <button className='profile_edit_btn' onClick={handleProfileSelect}>
                <FontAwesomeIcon icon={faPencilAlt} size="2xl" style={{color: "#ffffff"}} />
              </button>
              </Link>
            </div>
          </div>
          </div>
        ))}
          <button className="profile_add_btn" onClick={onAddProfile}>
          <FontAwesomeIcon icon={faPlusCircle} size="3x" style={{color: "#ffffff"}} />
          </button>
      </div>
    </div>
  );
}

export default ProfileSelect;
