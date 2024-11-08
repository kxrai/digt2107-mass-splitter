import React from 'react';
import { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function LoginPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    function handleLoginSuccess(credentialResponse) {
        const decoded = jwtDecode(credentialResponse?.credential);
        setUser(decoded);
        navigate('/');
    };

    const handleLoginFailure = (error) => {
        console.error('Login Failed:', error);
    };

    const handleLogout = () => {
        googleLogout(); // Log out from Google
        setUser(null); // Clear user state
        navigate('/login'); // Redirect to login page
      };

    return (

        <div class="h-screen grid place-items-center bg-gradient-to-b from-lightBlue-400 to-peach-400">
             <div className="card bg-base-100 shadow-xl">
                <div className="w-[600px] h-[300px] card-body grid place-items-center">
                    {user ? (
                        <><h1 className="card-title">Logout</h1><button class='primary' onClick ={handleLogout}>Logout</button></>
                    ) : 
                    (<><h1 className="card-title">Login/Sign-up with Google</h1><GoogleOAuthProvider clientId="584206264281-4udrb623en2sg85nq3b58eevjm8elf0r.apps.googleusercontent.com">
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={handleLoginFailure}
                                theme="outline"
                                size="large"
                                text="signin_with" />
                        </GoogleOAuthProvider></>
                    )};
                    
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
