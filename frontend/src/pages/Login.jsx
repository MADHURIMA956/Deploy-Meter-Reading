import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../utils';

function Login() {
  const navigate = useNavigate();
  const [adminLogin, setAdminLogin] =useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loginData, setLoginData] = useState({
    superkey:'',
    email:'',
    password:'',
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    const copyLoginData = {...loginData};
    copyLoginData[name] = value;
    setLoginData(copyLoginData);
  }

  const handleToggle = () => {
    if (!adminLogin) {
      setAdminLogin(true); 
    } else {
      setAdminLogin(false); 
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const {superkey,email,password} = loginData;
   if (
       !email?.trim() ||
       !password?.trim() ||
         (adminLogin && !superkey?.trim())
       ) {
         return handleError('Please enter the required credentials');
       }
       setIsDisabled(true);
    try{
      const url = `${import.meta.env.VITE_API_URL}auth/login`
      const response = await fetch(url , {
        method: "POST",
        headers:{
          'content-type' : 'application/json'
        },
        body: JSON.stringify(loginData)
      })
      const result =await response.json();
      const {success, message, jwtToken, name,error,userId,superAdmin} = result;
      if(success){
        setIsDisabled(false);
        handleSuccess(message);
        if(superAdmin){
          localStorage.setItem('superAdmin',1)
        }
        localStorage.setItem('token',jwtToken);
        localStorage.setItem(
          'loggedInUserData',
          JSON.stringify({ name: name, userId: userId})
        );
        setTimeout(() => {
          if(superAdmin == 1){
             navigate('/dashboard')
             return;
          }
          navigate('/home')
        }, 1000);
      }else if(error){
        const details = error?.details[0].message
        handleError(details);
      }else if(!success){
        handleError(message);
      }
    }
    catch (err){
      setIsDisabled(false);
      handleError(err)
    }finally {
      setIsDisabled(false);
    // Always reset loginData at the end regardless of the result
    setLoginData({
      superkey: '',
      email: '',
      password: '',
    });
}

  }
  return (
    <div className='container'>
      <div className="header-row">
      <h1> {adminLogin ? "Login as Admin" : "Login as User"}</h1>
        <a
          href="#"
          className="admin-btn"
          onClick={(e) => {
            e.preventDefault();
            handleToggle();
          }}
        >
          {adminLogin ? "User Login" : "Admin Login"}
        </a>
      </div>
      <form onSubmit={handleLogin}>
        {adminLogin ?
        <div>
          <label htmlFor="name">Admin Super Key <span>*</span></label>
          <input 
            onChange={handleChange}
            type="password"
            name='superkey'
            placeholder='Enter Admin super key...'
            value={loginData.superkey}
          />
        </div>
        : null }
        <div>
          <label htmlFor="email">Email <span>*</span></label>
          <input 
            onChange={handleChange}
            type="email"
            name='email'
            placeholder='Enter your email...'
            value={loginData.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password <span>*</span></label>
          <input 
            onChange={handleChange}
            type="password"
            name='password'
            autoFocus
            placeholder='Enter your password...'
            value={loginData.password}
          />
        </div>
        <button type='submit' className={isDisabled ?'disabled' : ''}>Login</button>
        <span>Don't have an account ?
          <Link to="/signup">Signup</Link>
        </span>
      </form>
      <ToastContainer/>
    </div>
  )
}

export default Login
