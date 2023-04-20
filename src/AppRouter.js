import Auth from "components/Auth";
import Footer from "components/Footer";
import Nav from "components/Nav"

import { Outlet, Route, Routes } from "react-router-dom";
import DetailPage from "routes/DetailPage";
import MainPage from "routes/MainPage";
import SearchPage from "routes/SearchPage";

import './styles/App.css'
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { authService } from "fbase";
import Profile from "routes/Profile";


const Layout = () =>{
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
    </div>  
  )
}

function AppRouter() {
  const [init, setInit] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(user)
        setUserObj(user)
      } else {
        setIsLoggedIn(false)
      }
      setInit(true)
    });
    
  },[]);

  if(!init){
    return (<div>initializing...</div>);  
  }

  return (
    <div className="app">
    
    {isLoggedIn ? (
          <Routes>
            <Route path = '/' element ={<Layout />}>
              <Route index element={<MainPage />} />
              <Route path=":movieId" element={<DetailPage />} />
              <Route path="search" element={<SearchPage />} />
            </Route>
            <Route path="profile" element={<Profile userObj ={userObj} />} />
          </Routes>
      ) : (
        <Auth/>
      )}

    </div>
  );
}

export default AppRouter;


      {/*
      <Nav />
      <Banner />
      <Row title='NETFLIX ORIGINALS' id='NO' fetchUrl={requests.fetchNetflixOriginals} isLargeRow/>
      <Row title='Trending Now' id='TN' fetchUrl={requests.fetchTrending} />
      <Row title='Top Rated' id='TR' fetchUrl={requests.fetchTopRated} />
      <Row title='Animation Movie' id='AM' fetchUrl={requests.fetchAnimationMovies} />
      <Row title='Family Movie' id='FM' fetchUrl={requests.fetchFamilyMovies} />
      <Row title='Adventure Movie' id='DM' fetchUrl={requests.fetchAdventureMovies} />
      <Row title='Science Fiction Movie' id='SM' fetchUrl={requests.fetchScienceFictionMovies} />
      <Row title='Action Movie' id='CM' fetchUrl={requests.fetchAction} />
      <Footer />
      */}