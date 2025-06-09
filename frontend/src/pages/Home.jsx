import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
    const navigate = useNavigate();
    const [loggedInUser, setLoggedInUser] = useState({});
    const [submitData, setSubmitData] = useState({
        userId:'',
        reading:'',
        date: new Date()
      })

    useEffect(() => {
        const userData = localStorage.getItem('loggedInUserData');
        if (userData) {
            setLoggedInUser(JSON.parse(userData));
        }
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUserData');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        const data = {...submitData};
        data[name] = value;
        setSubmitData(data);
    }
   const handleSubmit = async (e) => {
        e.preventDefault();

        const reading = submitData.reading;
        const userId = loggedInUser?.userId;
        const date = new Date().toISOString().split('T')[0];; 

        if (!reading || reading.toString().trim() === '') {
            return handleError('Please enter the meter reading');
        }

        try {
            const url = `${import.meta.env.VITE_API_URL}auth/submit`;

            const payload = { userId, reading, date };

            const response = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
            handleSuccess(result.message);
            setSubmitData({ reading: '' });
            } else {
            handleError(result.message || 'Submission failed');
            }
        } catch (err) {
            handleError(err.message || 'An error occurred');
        }
    };


    return (
        <div className='home-container'>
            <h1>Welcome, {loggedInUser?.name}</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginTop: '20px' }}>
                    <input
                        type="number"
                        name="reading"
                        placeholder="Enter meter reading *"
                        value={submitData?.reading}
                        onChange={handleChange}
                    />
                </div>
                <button type='submit'>Submit Reading</button>
            </form>
            <button onClick={handleLogout}>Logout</button>
            <ToastContainer />
        </div>
    )
}

export default Home