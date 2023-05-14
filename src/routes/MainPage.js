import React, { useState } from 'react';
import requests from 'api/requests';
import ProfileSelect from './ProfileSelect';
import Banner from 'components/Banner';
import Row from 'components/Row';

function MainPage({ userObj }) {

  const [isProfileSelect, setIsProfileSelect] = useState(false);
 
  return (
    <div>
      {!isProfileSelect ? (
        <>
          <Banner />
          <Row title='NETFLIX ORIGINALS' id='NO' fetchUrl={requests.fetchNetflixOriginals} isTv userObj={userObj} />
          <Row title='Trending Now' id='TN' fetchUrl={requests.fetchTrending} userObj={userObj} />
          <Row title='Top Rated' id='TR' fetchUrl={requests.fetchTopRated} userObj={userObj} />
          <Row title='Animation Movie' id='AM' fetchUrl={requests.fetchAnimationMovies} userObj={userObj}  />
          <Row title='Family Movie' id='FM' fetchUrl={requests.fetchFamilyMovies} userObj={userObj} />
          <Row title='Adventure Movie' id='DM' fetchUrl={requests.fetchAdventureMovies} userObj={userObj} />
          <Row title='Science Fiction Movie' id='SM' fetchUrl={requests.fetchScienceFictionMovies} userObj={userObj} />
          <Row title='Action Movie' id='CM' fetchUrl={requests.fetchAction} userObj={userObj} />
        </>
      ) : (
        <ProfileSelect userObj={userObj} setIsProfileSelect={setIsProfileSelect} />
      )}
    </div>
  );
}

export default MainPage;
