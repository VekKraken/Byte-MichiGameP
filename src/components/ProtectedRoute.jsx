import { cloneElement, useEffect, useState } from 'react';
import { getSessionUser } from '../lib/auth.js';

export default function ProtectedRoute({ children }) {
    const [username, setUsername] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let active = true;

        getSessionUser()
            .then((currentUsername) => {
                if (!active) return;
                if (!currentUsername) {
                    window.location.replace('/login.html');
                    return;
                }
                setUsername(currentUsername);
            })
            .catch(() => {
                if (active) window.location.replace('/login.html');
            })
            .finally(() => {
                if (active) setChecking(false);
            });

        return () => {
            active = false;
        };
    }, []);

    if (checking || !username) {
        return <main className="auth-check" aria-live="polite">Comprobando sesión...</main>;
    }

    return cloneElement(children, { username });
}