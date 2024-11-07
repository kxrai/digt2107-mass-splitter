import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
    const handleLoginSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse?.credential);
        window.location.href = "/HomePage";
    };

    const handleLoginFailure = (error) => {
        console.error('Login Failed:', error);
    };

    return (
        <div className="container mx-auto p-4">
             <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Login with Google</h2>
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

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#FDEADE', // Light Peach
    },
    heading: {
        color: '#4A90E2', // Light Blue
        marginBottom: '20px',
        fontFamily: 'Arial, sans-serif',
    },
};

export default LoginPage;
