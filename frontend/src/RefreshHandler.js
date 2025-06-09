import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function RefrshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const superAdmin = localStorage.getItem('superAdmin');
        const isAuthPage = ['/', '/login', '/signup'].includes(location.pathname);

        if (token) {
            setIsAuthenticated(true);

            if (isAuthPage) {
            const destination = superAdmin == 1 ? '/dashboard' : '/home';
            navigate(destination, { replace: false });
            }
        }
    }, [location.pathname, navigate, setIsAuthenticated])

    return (
        null
    )
}

export default RefrshHandler