import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

import { authService, db} from '../fbase'
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';

import "styles/Auth.css";

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true); // true 회원가입, false 로그인
  const [error, setError] = useState('');

  
  const onChange = (e) => {
    const {target:{name, value}} = e;
    if(name ==='email'){
      setEmail(value);
    }else if(name === 'password'){
      setPassword(value)
    }
  } 
  
  const onSubmit = async (e) => {
    e.preventDefault();

    try{
      let data;
      if(newAccount){
        //회원가입
        data = await createUserWithEmailAndPassword(authService, email, password);
        
        const querySnapshot = await getDocs(collection(db, email));
        const docCount = querySnapshot.size; 

        await setDoc(doc(db, `${email}`, `${docCount+1}`), {
          name : 'profile',
          like : '',
          profileimage: '',
        });
        Navigate('/profileselect')
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
        Navigate('/profileselect')
      }
      
      

    } catch(error) {
      console.log('error->', error);
      switch(error.code) {
        case "auth/wrong-password":
          setError("Wrong Password !");
          break;
        case "auth/user-not-found":
          setError("Wrong Email ! Please try again !");
          break;
        case "auth/email-already-in-use":
          setError("The email is already in use !");
          break;
        case "auth/weak-password":
          setError("The password must be at least 6 characters long.")
          break;
        // 그 외의 에러일 경우
        default:
          setError("Error! Please try again !");
          break;
      }
    }
  }

  const toggleAccount = () => setNewAccount(prev => !prev)

  const onSocialClick = async (e) => {

    let provider
    const {target:{name}} = e
    if(name === "google"){
      provider = new GoogleAuthProvider();

    }else if(name === "github"){
      provider = new GithubAuthProvider();

    }
    const data = await signInWithPopup(authService, provider)

    Navigate('/profileselect')
  }

  useEffect(() => {
    if(error !== ""){
      setTimeout(() => {
        setError("");
      }, 3000); // 3초 후에 error 값을 빈 문자열로 변경
    }
  }, [error]);


  return (
    <>
    
      <div className='container'>
        <div className='content_bg'>
          <div className="content">
            <form className='login_form' onSubmit={onSubmit}>
              <div className='title_container'><div>Login</div> {error && <div className="error_msg">{error}</div>}</div>
              
              <input className='input_email' name="email" type="email" placeholder = "Email" autoComplete='off' required value={email} onChange={onChange} />
              <input className='input_password' name="password" type="password" placeholder = "Password" required value={password} onChange={onChange}/>
              <span className='toggleAccount' onClick={toggleAccount}>
              {newAccount ? "Toggle to Sign In" : " Toggle to Create Account"  }
            </span>
              <div className="input_submit_container">
                <input className='input_submit' type="submit" value = {newAccount ? "Create Account" : "Log In"}/>
              </div>
            </form>

            <div className='social_login'>
              <p>Social Login</p>
              <button className='social_login_btn' name="google" onClick={onSocialClick}><span className="btn_text"><FontAwesomeIcon icon={faGoogle} /> Continue with Google </span></button>
              <button className='social_login_btn' name="github" onClick={onSocialClick}><span className="btn_text"><FontAwesomeIcon icon={faGithub} /> Continue with GitHub</span></button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
  
}

export default Auth
