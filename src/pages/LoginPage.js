import React from 'react';
import {useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function LoginPage() {
    const navigate = useNavigate();

    function handleLoginSuccess(credentialResponse) {
        const token = jwtDecode(credentialResponse?.credential); //decode token
        localStorage.setItem('loggedIn', true); //Store token in local storage
        localStorage.setItem('googleToken', token);
        navigate('/');
    };

    const handleLoginFailure = (error) => {
        console.error('Login Failed:', error);
    };

    return (

        <div class="h-screen grid place-items-center bg-gradient-to-b from-lightBlue-400 to-peach-400">
             <div className="card bg-base-100 shadow-xl">
                <div className="w-[600px] h-[300px] card-body grid place-items-center">
                    <h1 className="card-title">Login/Sign-up with Google</h1>                 
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure}
                        theme="outline"
                        size="large"
                        text="signin_with" 
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
