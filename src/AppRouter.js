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
import ProfileSelect from "routes/ProfileSelect";




function AppRouter() {

  const Layout = () =>{
    return (
      <div>
        <Nav isProfileSelect={isProfileSelect} setIsProfileSelect={setIsProfileSelect}/>
        <Outlet />
        <Footer />
      </div>  
    )
  }

  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileSelect, setIsProfileSelect] = useState(false);
  
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
      isProfileSelect ? (
        <Routes>
          <Route path = '/:id' element ={<Layout />}>
            <Route index element={<MainPage userObj={userObj} /> } />
            <Route path=":movieId" element={<DetailPage />} />
            
          </Route>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/:id/profile" element={<Profile userObj ={userObj} setIsProfileSelect={setIsProfileSelect} />} />
        </Routes>
       ) : (
          <ProfileSelect path="profileselect" userObj={userObj} isProfileSelect={isProfileSelect} setIsProfileSelect={setIsProfileSelect}/>
        )
        ) : (
      <Auth/>
    )}

    </div>
  );
}

export default AppRouter;