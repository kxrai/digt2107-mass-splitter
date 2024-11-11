import React from 'react';
import {useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

//Handle user login
export const handleLoginSuccess = (credentialResponse, navigate) => {
    const token = jwtDecode(credentialResponse?.credential); //decode token
    localStorage.setItem('loggedIn', true); //Store token in local storage
    localStorage.setItem('googleToken', JSON.stringify(token));
    navigate('/home'); //Redirect to home page
};
//Handle user login failure
export const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
};

function LoginPage() {
    const navigate = useNavigate();

    return (

        <div className="h-screen grid place-items-center bg-gradient-to-b from-lightBlue-400 to-peach-400">
             <div className="card bg-base-100 shadow-xl">
                <div className="w-[600px] h-[300px] card-body grid place-items-center">
                    <h1 className="card-title">Login/Sign-up with Google</h1> 
                    {/*Google sign in button*/}
                        <GoogleLogin
                            onSuccess={(response) => handleLoginSuccess(response, navigate)}
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
