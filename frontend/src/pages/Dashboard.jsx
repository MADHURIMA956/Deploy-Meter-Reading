import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Dashboard() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUserData'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUserData');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    return (
        <div>
            <h1>Hello Admin {loggedInUser?.name}</h1>
            <h3>Welcome to Dashboard</h3>
            <button onClick={handleLogout}>Logout</button>
            <div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Dashboard
