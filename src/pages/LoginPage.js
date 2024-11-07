import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function LoginPage(){
    function handleLoginSuccess(credentialResponse) {
        const decoded = jwtDecode(credentialResponse?.credential);
        window.location.href = "/";
    };

    const handleLoginFailure = (error) => {
        console.error('Login Failed:', error);
    };

    return (
        <div class="h-screen grid place-items-center bg-gradient-to-b from-lightBlue-400 to-peach-400">
             <div className="card bg-base-100 shadow-xl">
                <div className="w-[600px] h-[300px] card-body">
                    <h1 className="card-title text-center">Login/Sign-up with Google</h1>
                    <GoogleOAuthProvider clientId="584206264281-4udrb623en2sg85nq3b58eevjm8elf0r.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginFailure}
                            theme="outline"
                            size="large"
                            text="signin_with"
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
