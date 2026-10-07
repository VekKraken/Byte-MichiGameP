import { useEffect, useState } from 'react';

const THEME_KEY = 'michibyte-theme';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'dark';
        const saved = window.localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    });

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        window.localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    return (
        <div className="theme-toggle" aria-label="Selector de tema">
            <button
                type="button"
                className={`theme-option ${theme === 'dark' ? 'is-active' : ''}`}
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
                aria-label="Modo oscuro"
            >
                <span className="theme-cat cat-dark" aria-hidden="true">
                    <span className="theme-ear theme-ear-left" />
                    <span className="theme-ear theme-ear-right" />
                    <span className="theme-eye theme-eye-left" />
                    <span className="theme-eye theme-eye-right" />
                </span>
                <span className="theme-label">Oscuro</span>
            </button>
            <button
                type="button"
                className={`theme-option ${theme === 'light' ? 'is-active' : ''}`}
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
                aria-label="Modo claro"
            >
                <span className="theme-cat cat-light" aria-hidden="true">
                    <span className="theme-ear theme-ear-left" />
                    <span className="theme-ear theme-ear-right" />
                    <span className="theme-eye theme-eye-left" />
                    <span className="theme-eye theme-eye-right" />
                </span>
                <span className="theme-label">Claro</span>
            </button>
        </div>
    );
}
