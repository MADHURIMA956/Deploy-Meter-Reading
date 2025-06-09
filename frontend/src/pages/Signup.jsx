import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../utils';

function Signup() {
  const navigate = useNavigate();
  const [adminLogin, setAdminLogin] =useState(false)
  const [signupData, setSignupData] = useState({
    superkey:'',
    name:'',
    email:'',
    password:'',
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    const copySignupInfo = {...signupData};
    copySignupInfo[name] = value;
    setSignupData(copySignupInfo);
  }

   const handleToggle = () => {
    if (!adminLogin) {
      setAdminLogin(true); 
    } else {
      setAdminLogin(false); 
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const {superkey,name,email,password} = signupData;
    if (
    !name?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
      (adminLogin && !superkey?.trim())
    ) {
      return handleError('Please enter the required credentials');
    }
    try{
      const url = `${import.meta.env.VITE_API_URL}auth/signup`
      const response = await fetch(url , {
        method: "POST",
        headers:{
          'content-type' : 'application/json'
        },
        body: JSON.stringify(signupData)
      })
      const result =await response.json();
      const {success, message,error,superAdmin} = result;
      if(success){
        handleSuccess(message);
        if(superAdmin){
          localStorage.setItem('superAdmin',1)
        }
        setTimeout(() => {
          navigate('/login')
        }, 1000);
      }else if(error){
        const details = error?.details[0].message
        handleError(details);
      }else if(!success){
        handleError(message);
      }
    }catch (err){
      handleError(err)
    }finally {
      // Always reset SignupData at the end regardless of the result
      setSignupData({
          superkey:'',
          name:'',
          email:'',
          password:'',
      });
    } 
  }
  return (
    <div className='container'>
      <div className="header-row">
      <h1> {adminLogin ? "Signup as Admin" : "Signup as User"}</h1>
        <a
          href="#"
          className="admin-btn"
          onClick={(e) => {
            e.preventDefault();
            handleToggle();
          }}
        >
          {adminLogin ? "User Signup" : "Admin Signup"}
        </a>
      </div>
      <form onSubmit={handleSignup}>
        {adminLogin ?
        <div>
          <label htmlFor="name">Admin Super Key <span>*</span></label>
          <input 
            onChange={handleChange}
            type="password"
            name='superkey'
            placeholder='Enter Admin super key...'
            value={signupData.superkey}
          />
        </div>
        : null }
        <div>
          <label htmlFor="name">Name <span>*</span></label>
          <input 
            onChange={handleChange}
            type="text"
            name='name'
            autoFocus
            placeholder='Enter your name...'
            value={signupData.name}
          />
        </div>
        <div>
          <label htmlFor="email">Email <span>*</span></label>
          <input 
            onChange={handleChange}
            type="email"
            name='email'
            placeholder='Enter your email...'
            value={signupData.email}
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
            value={signupData.password}
          />
        </div>
        <button type='submit'>Signup</button>
        <span>Already has an account ?
          <Link to="/login"> Login</Link>
        </span>
      </form>
      <ToastContainer/>
    </div>
  )
}

export default Signup
