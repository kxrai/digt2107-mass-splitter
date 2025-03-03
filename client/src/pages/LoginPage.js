import React from 'react';
import {useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


//Handle user login failure
export const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
};
// Handle user login
export const handleLoginSuccess = async (credentialResponse, navigate, location) => {
    const token = jwtDecode(credentialResponse?.credential); // Decode token
    const userExists = await checkUser(token);

    if (userExists) {
        localStorage.setItem('loggedIn', true); // Store logged-in status
        navigate(location.state?.from || '/home'); // Redirect user
    }
};

// Check user in database
export async function checkUser(token) {
    try {
        const email = token.email;
        const response = await fetch(`http://localhost:3000/api/users/email/${email}`, { method: 'GET' });
        const data = await response.json();

        if (response.ok) {
            // Save user info in localStorage
            const userInfo = { id: data.user_id, name: data.username, email: data.email, picture: token.picture };
            localStorage.setItem('googleToken', JSON.stringify(userInfo));
            console.log('User found and stored:', userInfo);
            return true;
        } else {
            // User not found, create new user
            const createResponse = await fetch('/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: token.name,
                    email: token.email,
                    phone_number: '',
                    password: '',
                }),
            });

            if (createResponse.ok) {
                const newUser = await createResponse.json();
                const userInfo = { id: newUser.userId, name: token.name, email: token.email, picture: token.picture };
                localStorage.setItem('googleToken', JSON.stringify(userInfo));
                console.log('New user created and stored:', userInfo);
                return true;
            } else {
                const error = await createResponse.json();
                alert(`Error creating user: ${error.error}`);
                return false;
            }
        }
    } catch (error) {
        console.error('Failed to connect to the server:', error);
        return false;
    }
}


function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();


    return (

        <div className="h-screen grid place-items-center bg-gradient-to-b from-lightBlue-400 to-peach-400">
             <div className="card bg-base-100 shadow-xl">
                <div className="w-[600px] h-[300px] card-body grid place-items-center">
                    <h1 className="card-title">Login/Sign-up with Google</h1> 
                    {/*Google sign in button*/}
                        <GoogleLogin
                            onSuccess={(response) => handleLoginSuccess(response, navigate, location)}
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