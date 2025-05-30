import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-6">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6">The page you're looking for doesn't exist.</p>
            <Link to="/home" className="text-blue-600 hover:underline">
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;