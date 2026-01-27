'use client';

import { useEffect } from 'react';
import "./globals.css";

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="flex min-h-screen flex-col items-center justify-center p-24">
                <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
                <p className="mb-4 text-gray-600">The application encountered a critical error.</p>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
                >
                    Try again
                </button>
            </body>
        </html>
    );
}
