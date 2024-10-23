'use client'

import React, { useState } from 'react';
import { PlaidLink } from 'react-plaid-link';
import axios from 'axios';
// import { getCookie, getCookies } from 'typescript-cookie';
import getCookie from '../../utils/getCookie'
import { useAppSelector } from '@/redux/hooks';
import { Plaid } from 'react-plaid-link';
import { Helmet } from 'react-helmet';

const ConnectPlaidButton = ({user}) => {
    // const [linkToken, setLinkToken] = useState(null);
//     const userId = user.users_id
    
//     // Function to connect plaid
//     const linkPlaid = async () => {
//         const access = getCookie('access');
//             const csrftoken = getCookie('csrftoken'); // Get CSRF token from cookie
//             const callHeaders = {
//                 'X-CSRFToken': csrftoken, // Set the CSRF token in headers
//                 'Authorization': `Bearer ${access}`
//             }

//         const getLinkToken = async() => {
//             // fetch link token
//             const response = await fetch("/http://127.0.0.1:8000/api/plaid/create_link_token", {
//                 method: "POST",
//                 credentials: "same-origin",
//                 headers: callHeaders,
//                 body: user
//               });
//             // const response = await axios.post('http://127.0.0.1:8000/api/plaid/create_link_token/',
//             //     {
//             //         user, // Your request body
//             //     }, 
//             //     {
//             //         headers: {
//             //             'X-CSRFToken': csrftoken, // Set the CSRF token in headers
//             //             // 'credentials': 'include',
//             //             'Authorization': `Bearer ${access}`
//             //         },
//             //         withCredentials: true,  // Ensure cookies like CSRF are sent with the request
//             //     }
            
//             console.log('plaid link token fetch was a success!', response)
//             return response.json().link_token;
//         }
        
//         const plaidLinkOptions = {
//             token: await getLinkToken(),
//             onSuccess: async function (public_token, metadata) {
//                 // 2a. Send the public_token to your app server.
//                 // The onSuccess function is called when the user has successfully
//                 // authenticated and selected an account to use.

//                 await fetch("api/plaid/get_access_token", {
//                     method: "POST",
//                     headers: {
//                     "Content-Type": "text/plain",
//                     "X-CSRFToken": csrftoken,
//                     },
//                     body: JSON.stringify({
//                     public_token: public_token,
//                     accounts: metadata.accounts,
//                     }),
//                 });
//                 },
//             onExit: async function(err, metadata){
//                 // 2b. Gracefully handle the invalid link token error. A link token
//                 // can become invalidated if it expires, has already been used
//                 // for a link session, or is associated with too many invalid logins.
//                 if (err != null && err.error_code === "INVALID_LINK_TOKEN") {
//                     linkHandler.destroy();
//                     linkHandler = Plaid.create({
//                     ...configs,
//                     token: await fetchLinkToken(),
//                     });
//                 }
//                 if (err != null) {
//                     // Handle any other types of errors.
//                 }
//                 },
//             };
//             Plaid.create()
//             var linkHandler = Plaid.create(configs);
//             linkHandler.open();
//         };



//     // Call the function to create a link token when the component mounts or button is clicked
//     const handleClick = async () => {
//         createLinkToken();
//     };

//     return (
//         <>
//             <Helmet>
//                 <script src='https://cdn.plaid.com/link/v2/stable/link-initialize.js' />
//             </Helmet>
//             <div>
//                 <button onClick={handleClick}>
//                     <PlaidLink {...plaidLinkOptions}>
//                             Open Plaid Link
//                     </PlaidLink>
//                 </button>
                
//             </div>
//         </>
//     );
// };

// export default ConnectPlaidButton;
