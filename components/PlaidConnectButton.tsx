'use client'

import React, { useState } from 'react';
import { PlaidLink } from 'react-plaid-link';
import axios from 'axios';

const ConnectPlaidButton = () => {
    const [linkToken, setLinkToken] = useState(null);
    const userId = 'user_id_here'; // Replace this with the actual user ID

    // Function to create a link token
    const createLinkToken = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/plaid/create_link_token/', {
                user_id: userId,
            });
            setLinkToken(response.data.link_token); // Set the received link token
        } catch (error) {
            console.error('Error creating link token:', error);
        }
    };

    // Use the Plaid Link hook
    const onSuccess = (public_token, metadata) => {
        // Send the public token to your backend to exchange it for an access token
        axios.post('/api/plaid/exchange_public_token/', {
            public_token,
            user_id: userId, // Optionally send user ID
        }).then(response => {
            console.log('Access token:', response.data.access_token);
            // Handle successful access token exchange
        }).catch(error => {
            console.error('Error exchanging public token:', error);
        });
    };

    const plaidLinkOptions = {
        token: linkToken,
        onSuccess,
    };

    // Call the function to create a link token when the component mounts or button is clicked
    const handleClick = () => {
        createLinkToken();
    };

    return (
        <div>
            <button onClick={handleClick}>Connect to Plaid</button>
            {linkToken && (
                <PlaidLink {...plaidLinkOptions}>
                    Open Plaid Link
                </PlaidLink>
            )}
        </div>
    );
};

export default ConnectPlaidButton;
