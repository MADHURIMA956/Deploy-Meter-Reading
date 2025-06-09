import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Dashboard() {
    const [loggedInUser, setLoggedInUser] = useState({});
    const [userData, setUserData] =useState([]);
    const navigate = useNavigate();
    useEffect(() => {
         const user = localStorage.getItem('loggedInUserData');
        if (user) {
            setLoggedInUser(JSON.parse(user));
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

    const fetchData = async () => {
        try{
            const url = `${import.meta.env.VITE_API_URL}userdata`
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url,headers);
            const result = await response.json();
            console.log("reslu",result)
            setUserData(result)
            if(!result){
                handleError("User data not found")
            }
        }catch(err){
            handleError(err);
        }
    }

    useEffect(()=>{
        fetchData();
    },[])

    return (
        <div>
            <h1>Hello Admin, {loggedInUser?.name}</h1>
            <h3>Welcome to Dashboard</h3>
            <div className="table-container">
                <table className="data-table">
                <thead>
                    <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Reading</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {userData && userData.length > 0 ? (
                    userData.map(({ userId, name, reading, date }) => (
                        <tr key={userId + date}>
                        <td>{userId.slice(-4)}</td>
                        <td>{name}</td>
                        <td>{reading}</td>
                        <td>{new Date(date).toLocaleDateString()}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="4" className="no-data">
                        No data available
                        </td>
                    </tr>
                    )}
                    {/* <tr >
                        <td>"userId"</td>
                        <td>"userId"</td>
                        <td>"userId"</td>
                        <td>"userId"</td>
                        </tr> */}
                </tbody>
                </table>
            </div>
        <button onClick={handleLogout}>Logout</button>
        <ToastContainer />
        </div>
    )
}

export default Dashboard
