// // src/index.js
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css'; // Import Tailwind CSS styles
// import App from './App';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId="584206264281-4udrb623en2sg85nq3b58eevjm8elf0r.apps.googleusercontent.com">
//     <App />
//     </GoogleOAuthProvider>
//   </React.StrictMode>
// );

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Root() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  );
}

export default Root;
