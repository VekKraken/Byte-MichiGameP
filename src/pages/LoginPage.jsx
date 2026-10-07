import { useEffect, useState } from 'react';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { checkAuth, login, register } from '../lib/auth.js';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(new URLSearchParams(window.location.search).get('mode') === 'register');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkAuth()
            .then((authenticated) => {
                if (authenticated) window.location.replace('/michibyte.html');
            })
            .catch(() => { });
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const request = isRegistering ? register : login;
            const { response, data } = await request(username, password);
            if (response.ok && data.success) {
                window.location.assign(data.redirect || '/michibyte.html');
                return;
            }
            setError(data.error || 'No se pudo completar la solicitud');
        } catch {
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <div className="login-toolbar">
                <ThemeToggle />
            </div>
            <a className="auth-back" href="/">← Volver a MichiByte</a>
            <div className="login-layout">
                <aside className="login-visual" aria-label="Mascota gamer de MichiByte">
                    <div className="login-visual-badge">PLAYER 01</div>
                    <svg className="login-cat" viewBox="0 0 360 480" role="img" aria-label="Gato gamer de cuerpo completo con auriculares y cola">
                        <defs>
                            <linearGradient id="catBody" x1="0" x2="1" y1="0" y2="1">
                                <stop offset="0%" stopColor="#7d8ea3" />
                                <stop offset="40%" stopColor="#34465c" />
                                <stop offset="100%" stopColor="#101a2a" />
                            </linearGradient>
                            <linearGradient id="catAccent" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="#59d3d0" />
                                <stop offset="100%" stopColor="#d283a5" />
                            </linearGradient>
                        </defs>
                        <circle cx="180" cy="200" r="138" fill="rgba(89, 211, 208, 0.12)" />
                        <circle cx="180" cy="200" r="118" fill="rgba(16, 26, 42, 0.8)" stroke="rgba(89, 211, 208, 0.5)" strokeWidth="2" />
                        <path d="M108 210C88 161 95 139 119 127C140 116 166 111 180 111C194 111 220 116 241 127C265 139 272 161 252 210L235 320C228 353 198 379 180 379C162 379 132 353 125 320L108 210Z" fill="url(#catBody)" stroke="#a8b5c3" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M118 202C95 170 84 142 93 110C99 89 118 74 143 77L158 103C147 114 138 134 134 154L118 202Z" fill="url(#catBody)" stroke="#a8b5c3" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M242 202C265 170 276 142 267 110C261 89 242 74 217 77L202 103C213 114 222 134 226 154L242 202Z" fill="url(#catBody)" stroke="#a8b5c3" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M142 218C156 205 168 201 180 201C192 201 204 205 218 218L210 294C192 310 168 310 150 294L142 218Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                        <path d="M78 253C50 242 30 264 27 297C25 323 41 342 64 343L96 347C88 324 85 286 78 253Z" fill="url(#catBody)" stroke="#a8b5c3" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M282 253C310 242 330 264 333 297C335 323 319 342 296 343L264 347C272 324 275 286 282 253Z" fill="url(#catBody)" stroke="#a8b5c3" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M117 266L90 332C80 349 85 366 101 370L141 373L145 300L117 266Z" fill="#1b2837" stroke="#a8b5c3" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M243 266L270 332C280 349 275 366 259 370L219 373L215 300L243 266Z" fill="#1b2837" stroke="#a8b5c3" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M98 140L80 78L128 119Z" fill="#d68eaf" stroke="#f7d5df" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M262 140L280 78L232 119Z" fill="#d68eaf" stroke="#f7d5df" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M75 153C56 139 34 139 25 159C19 174 25 194 43 201L74 155Z" fill="#111a29" stroke="#a8b5c3" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M285 153C304 139 326 139 335 159C341 174 335 194 317 201L286 155Z" fill="#111a29" stroke="#a8b5c3" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M122 140H238L260 205C207 223 153 223 100 205L122 140Z" fill="#d6dfe5" fillOpacity="0.2" />
                        <path d="M130 214C139 193 158 182 180 182C202 182 221 193 230 214L224 236C207 247 193 251 180 251C167 251 153 247 136 236L130 214Z" fill="#f4f7f8" opacity="0.1" />
                        <ellipse cx="145" cy="162" rx="12" ry="17" fill="#0d1723" />
                        <ellipse cx="215" cy="162" rx="12" ry="17" fill="#0d1723" />
                        <ellipse cx="145" cy="162" rx="4" ry="8" fill="#59d3d0" />
                        <ellipse cx="215" cy="162" rx="4" ry="8" fill="#59d3d0" />
                        <path d="M180 179C172 184 168 191 168 199C168 206 173 212 180 212C187 212 192 206 192 199C192 191 188 184 180 179Z" fill="#dc8ca5" />
                        <path d="M160 214C170 219 175 222 180 222C185 222 190 219 200 214" fill="none" stroke="#d9e5e8" strokeWidth="4" strokeLinecap="round" />
                        <path d="M148 242C156 250 166 254 180 254C194 254 204 250 212 242" fill="none" stroke="#f5d6be" strokeWidth="4" strokeLinecap="round" />
                        <path d="M180 103L168 71L156 103" fill="none" stroke="#59d3d0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M180 103L192 71L204 103" fill="none" stroke="#59d3d0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M185 374C175 385 166 391 154 398" fill="none" stroke="#d68eaf" strokeWidth="6" strokeLinecap="round" />
                        <path d="M175 374C185 385 194 391 206 398" fill="none" stroke="#d68eaf" strokeWidth="6" strokeLinecap="round" />
                        <path d="M282 197C321 183 340 198 341 223C342 248 318 264 289 259" fill="none" stroke="#59d3d0" strokeWidth="6" strokeLinecap="round" />
                        <path d="M78 197C39 183 20 198 19 223C18 248 42 264 71 259" fill="none" stroke="#59d3d0" strokeWidth="6" strokeLinecap="round" />
                        <path d="M95 281C81 291 64 305 54 320" fill="none" stroke="url(#catAccent)" strokeWidth="6" strokeLinecap="round" />
                        <path d="M265 281C279 291 296 305 306 320" fill="none" stroke="url(#catAccent)" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                    <div className="login-visual-caption">MIAU / READY</div>
                </aside>
                <section className="login-panel" aria-labelledby="login-title">
                    <p className="login-kicker">MICHIBYTE / ACCESO DE JUGADOR</p>
                    <h1 id="login-title">{isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
                    <p className="login-copy">{isRegistering ? 'Prepara tu espacio en el lobby.' : 'Vuelve a tu territorio.'}</p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Usuario <span aria-hidden="true">*</span></label>
                        <input id="username" name="username" autoComplete="username" minLength="3" maxLength="24" required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Elige tu nombre de jugador" />
                        <label htmlFor="password">Contraseña <span aria-hidden="true">*</span></label>
                        <input id="password" name="password" type="password" autoComplete={isRegistering ? 'new-password' : 'current-password'} minLength={isRegistering ? 8 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegistering ? 'Al menos 8 caracteres' : 'Ingresa tu contraseña'} />
                        {error && <p className="login-error" role="alert">{error}</p>}
                        <button className="login-submit" type="submit" disabled={loading}>
                            {loading ? 'Un momento...' : isRegistering ? 'Crear mi cuenta' : 'Ingresar'}
                        </button>
                    </form>
                    <p className="auth-switch">
                        {isRegistering ? '¿Ya tienes cuenta?' : '¿Primera vez por aquí?'}{' '}
                        <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
                            {isRegistering ? 'Inicia sesión' : 'Crea tu cuenta'}
                        </button>
                    </p>
                    <p className="login-footnote">Tu acceso se valida de forma segura en el servidor.</p>
                </section>
            </div>
        </main>
    );
}