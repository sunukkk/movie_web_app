import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from 'fbase';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, authService } from '../fbase';

import 'styles/ProfileSelect.css';

function ProfileSelect({ userObj, isProfileSelect, setIsProfileSelect}) {
  console.log(isProfileSelect)
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
  

  const onDeleteProfile = async (profileId) =>{
    if (profiles.length === 1) {
      alert('프로필은 최소한 1개는 있어야 합니다.');
      return;
    }
    if(window.confirm('프로필을 삭제하시겠습니까?'));

      try{
        await deleteDoc(doc(db, userObj.email, profileId));
        
        const imageUrl = profiles.find((profile) => profile.id === profileId)?.data.profileimage;
        if (imageUrl) {
          const storageRef = ref(storage, `${userObj.email}/${profileId}/profileImg`);
          await deleteObject(storageRef);
        }
        alert('프로필이 삭제되었습니다.');

        setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== profileId));
      } catch (error){
        console.error('Error deleting profile:', error);
      }
  }

  return (
    <div className="profileselect">
      <div className="profileselect_titlebox">
        <h2 className="profileselect_title">ProfileSelect</h2>
        <button onClick={onLogOutClick}>Logout</button>
      </div>

      <div className="profileselect_users">
        {profiles.map((profile) => (
          <div className="profileselect_user" key={profile.id} onClick={handleProfileSelect}>
            <Link to={`/${profile.id}`}>
              <div className="profileselect_image empty" style={profileImages[profile.id] ? { backgroundImage: `url(${profileImages[profile.id]})` } : { backgroundImage: '' }}
                
              ></div>
              <div className="profileselect_name">{profile.data.name}</div>
            </Link>
            <button className='profile_delete_btn' onClick={() => onDeleteProfile(profile.id)}>
              Delete Profile
            </button>
          </div>
        ))}
          <button className="profile_add_btn" onClick={onAddProfile}>
            Add Profile
          </button>
      </div>

      <div className="profileselect_btn_box">

      </div>

    </div>
  );
}

export default ProfileSelect;
