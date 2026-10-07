import { useEffect, useState } from 'react';
import { logout } from '../lib/auth.js';

const games = [
    { name: 'Call of Duty: Zombies', role: 'Zombies · caza de hordas', mark: 'COD', style: 'callofduty' },
    { name: 'Bloodborne', role: 'Soulslike · caza nocturna', mark: 'BB', style: 'bloodborne' },
    { name: 'Helldivers 2', role: 'Co-op · misión imposible', mark: 'HD2', style: 'helldivers' },
    { name: 'GTA 6', role: 'Mundo abierto · caos total', mark: 'GTA', style: 'gta' },
    { name: 'Fortnite', role: 'Construcción · finales brutales', mark: 'FN', style: 'fortnite' },
    { name: 'R de Rancho', role: 'Rural · caos y humor', mark: 'RR', style: 'rancho' }
];

const profileFields = [
    { label: 'Alias', value: 'Kraken-V9' },
    { label: 'Plataforma', value: 'PC + PS5' },
    { label: 'Estilo', value: 'Cazador del caos' },
    { label: 'Estado', value: 'En línea' },
    { label: 'Main', value: 'Duelista' },
    { label: 'Mood', value: 'Nocturno' }
];

const defaultProfile = Object.fromEntries(profileFields.map(({ label, value }) => [label, value]));

export default function ProfilePage({ username }) {
    const [loggingOut, setLoggingOut] = useState(false);
    const [profile, setProfile] = useState(defaultProfile);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [draftCanSave, setDraftCanSave] = useState(false);
    const [saveState, setSaveState] = useState('loading');
    const draftKey = `michibyte-profile-draft:${encodeURIComponent(username)}`;

    useEffect(() => {
        try {
            const storedDraft = window.localStorage.getItem(draftKey);
            if (storedDraft) {
                const parsedDraft = JSON.parse(storedDraft);
                if (parsedDraft && typeof parsedDraft === 'object' && !Array.isArray(parsedDraft)) {
                    const restoredProfile = { ...defaultProfile };
                    for (const field of profileFields) {
                        if (typeof parsedDraft[field.label] === 'string') {
                            restoredProfile[field.label] = parsedDraft[field.label];
                        }
                    }
                    setProfile(restoredProfile);
                    setDraftCanSave(true);
                    setSaveState('restored');
                } else {
                    throw new Error('El borrador guardado no tiene un formato válido.');
                }
            } else {
                setDraftCanSave(true);
                setSaveState('saved');
            }
        } catch (error) {
            console.error('No se pudo recuperar el borrador del perfil:', error);
            setSaveState('error');
        } finally {
            setDraftLoaded(true);
        }
    }, [draftKey]);

    useEffect(() => {
        if (!draftLoaded || !draftCanSave) return;
        try {
            window.localStorage.setItem(draftKey, JSON.stringify(profile));
            setSaveState('saved');
        } catch (error) {
            console.error('No se pudo guardar el borrador del perfil:', error);
            setSaveState('error');
        }
    }, [draftKey, draftCanSave, draftLoaded, profile]);

    function updateProfile(field, value) {
        setProfile((currentProfile) => ({ ...currentProfile, [field]: value }));
        setDraftCanSave(true);
        setSaveState('saving');
    }

    async function handleLogout() {
        setLoggingOut(true);
        try {
            const { data } = await logout();
            window.location.assign(data.redirect || '/login.html');
        } catch {
            window.location.assign('/login.html');
        }
    }

    return (
        <div className="page-shell">
            <header className="site-header">
                <a className="brand" href="#perfil" aria-label="MichiByte, inicio"><span className="brand-mark" aria-hidden="true">M</span><span>MICHIBYTE</span></a>
                <nav className="site-nav" aria-label="Navegación principal">
                    <a className="nav-link" href="#perfil-info">Perfil</a>
                    <a className="nav-link" href="#juegos">Juegos</a>
                    <a className="nav-link" href="#agenda">Horarios</a>
                    <a className="live-link" href="#agenda"><span className="live-dot" aria-hidden="true" />Al acecho</a>
                    <button className="logout-button" type="button" onClick={handleLogout} disabled={loggingOut} aria-label="Cerrar sesión">{loggingOut ? 'Saliendo...' : 'Salir'}</button>
                </nav>
            </header>
            <main>
                <section className="hero" id="perfil" aria-labelledby="player-name">
                    <div className="hero-copy">
                        <div className="eyebrow"><span className="online-dot" aria-hidden="true" />Gata gamer · cazadora de rangos</div>
                        <h1 id="player-name">Michi<span>Byte</span></h1>
                        <p>Persigo estrellas, busco el MVP y reclamo el teclado entre partidas. Trae snacks; este lobby ya tiene gata.</p>
                        <div className="hero-actions">
                            <a className="button" href="#juegos">Ver mi territorio <span aria-hidden="true">↘</span></a>
                            <a className="button button-secondary" href="https://www.twitch.tv/" target="_blank" rel="noreferrer">Ven al stream <span aria-hidden="true">↗</span></a>
                        </div>
                    </div>
                    <div className="hero-art" role="img" aria-label="MichiByte en un medallón cósmico rodeado por colas negras de gato">
                        <svg className="cthulhu-frame" viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <circle className="frame-line" cx="220" cy="220" r="198" opacity=".48" />
                            <circle className="frame-line" cx="220" cy="220" r="176" strokeDasharray="1 10" opacity=".56" />
                            <g className="cat-tail tail-left"><path className="tail-shape" d="M145 343c-39 19-82 1-86-34-4-27 13-48 36-47 20 1 31 18 23 33-6 12-22 14-30 4-6-8-2-18 6-21-16 1-24 17-19 34 7 24 35 33 66 18z" /><path className="tail-fur" d="M139 341c-33 11-63-5-67-31-2-12 2-23 10-29" /></g>
                            <g className="cat-tail tail-right"><path className="tail-shape" d="M295 343c39 19 82 1 86-34 4-27-13-48-36-47-20 1-31 18-23 33 6 12 22 14 30 4 6-8 2-18-6-21 16 1 24 17 19 34-7 24-35 33-66 18z" /><path className="tail-fur" d="M301 341c33 11 63-5 67-31 2-12-2-23-10-29" /></g>
                        </svg>
                        <div className="cat-medallion">
                            <svg className="cat-mascot" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <defs><radialGradient id="space" cx="35%" cy="28%"><stop stopColor="#263e58" /><stop offset="1" stopColor="#10182c" /></radialGradient><linearGradient id="fur" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#333d50" /><stop offset="0.55" stopColor="#151c2c" /><stop offset="1" stopColor="#080d18" /></linearGradient></defs>
                                <rect width="160" height="160" fill="url(#space)" />
                                <g fill="#d9f8f4"><circle cx="21" cy="31" r="2" /><circle cx="133" cy="39" r="1.5" /><circle cx="24" cy="112" r="1.5" /><circle cx="139" cy="119" r="2" /></g>
                                <path d="M26 113c-16 3-18-13-7-19 7-5 15-2 17 4" fill="none" stroke="#54c5bb" strokeLinecap="round" strokeWidth="4" />
                                <path d="m36 64-5-39c-1-8 5-11 11-5l28 27m20 0 28-27c6-6 12-3 11 5l-5 39" fill="url(#fur)" stroke="#65748a" strokeWidth="2.5" strokeLinejoin="round" />
                                <path d="m39 51-2-23 21 20m63 3 2-23-21 20" fill="#bc728d" />
                                <path d="M28 75c0-22 23-37 52-37s52 15 52 37v14c0 31-23 52-52 52S28 120 28 89z" fill="url(#fur)" stroke="#65748a" strokeWidth="2.5" />
                                <path d="M42 78c7-11 19-12 28-2-7 13-20 16-28 2Zm76 0c-7-11-19-12-28-2 7 13 20 16 28 2Z" fill="#a8e8df" />
                                <g className="mascot-eyes" fill="#10202a"><ellipse cx="56" cy="78" rx="3.2" ry="8" /><ellipse cx="104" cy="78" rx="3.2" ry="8" /></g>
                                <g fill="#fff"><circle cx="57" cy="75" r="1.8" /><circle cx="105" cy="75" r="1.8" /></g>
                                <path d="m75 94 5-4 5 4-5 5z" fill="#dc8ca5" /><path d="M80 99c-4 7-10 7-13 3m13-3c4 7 10 7 13 3" fill="none" stroke="#d9cbd2" strokeLinecap="round" strokeWidth="2" />
                                <g fill="none" stroke="#9ba9b9" strokeLinecap="round" strokeWidth="1.5"><path d="M47 96 20 91m28 11-27 4m92-10 27-5m-28 11 27 4" /></g>
                                <path className="mascot-star" d="m127 25 2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#f2d58a" />
                            </svg>
                        </div>
                    </div>
                </section>
                <section className="stats" aria-label="Estadísticas de MichiByte">
                    <div className="stat"><span className="stat-value">2.4K</span><span className="stat-label">Seguidores</span></div>
                    <div className="stat"><span className="stat-value">340+</span><span className="stat-label">Horas despierta</span></div>
                    <div className="stat"><span className="stat-value">PLAT II</span><span className="stat-label">Rango actual</span></div>
                    <div className="stat"><span className="stat-value">100%</span><span className="stat-label">Actitud felina</span></div>
                </section>
                <section className="profile-panel" id="perfil-info" aria-labelledby="profile-title">
                    <div className="profile-identity">
                        <div className="avatar-frame" aria-hidden="true">
                            <svg className="avatar-svg" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <radialGradient id="avatar-space" cx="35%" cy="28%">
                                        <stop stopColor="#274f50" />
                                        <stop offset="1" stopColor="#07151b" />
                                    </radialGradient>
                                    <linearGradient id="avatar-creature" x1="0" y1="0" x2="1" y2="1">
                                        <stop stopColor="#668d79" />
                                        <stop offset="0.52" stopColor="#294d4a" />
                                        <stop offset="1" stopColor="#101d27" />
                                    </linearGradient>
                                    <linearGradient id="avatar-tentacle" x1="0" y1="0" x2="0" y2="1">
                                        <stop stopColor="#91b79a" />
                                        <stop offset="1" stopColor="#315553" />
                                    </linearGradient>
                                </defs>
                                <rect width="160" height="160" rx="28" fill="url(#avatar-space)" />
                                <g fill="none" stroke="#739c84" strokeWidth="5" strokeLinecap="round">
                                    <path d="M51 69C34 61 31 44 22 35m20 36C25 72 18 63 12 54m95 15c17-8 20-25 29-34m-20 36c17 1 24-8 30-18" />
                                </g>
                                <path d="M51 67c-6-14-4-31 7-41 8-8 18-9 22-19 5 10 16 11 24 19 11 10 13 27 7 41l-7 30H58z" fill="url(#avatar-creature)" stroke="#9ab89b" strokeWidth="2" />
                                <path d="M65 44c5-9 10-12 15-19 5 7 10 10 15 19-8-3-11-4-15-4s-7 1-15 4z" fill="#4a7770" stroke="#a1c6a6" strokeWidth="1.5" />
                                <path d="M71 50c-5 5-6 11-4 17 4 4 9 4 13 1 4 3 9 3 13-1 2-6 1-12-4-17-5 3-13 3-18 0z" fill="#13252a" />
                                <g fill="#8ff0cf">
                                    <ellipse cx="72" cy="59" rx="3.5" ry="2.6" />
                                    <ellipse cx="88" cy="59" rx="3.5" ry="2.6" />
                                </g>
                                <path d="M80 67c-4 6-9 12-10 22m10-22c4 7 9 12 10 22" fill="none" stroke="#172b30" strokeWidth="3" strokeLinecap="round" />
                                <g fill="none" stroke="url(#avatar-tentacle)" strokeWidth="7" strokeLinecap="round">
                                    <path className="avatar-tentacle tentacle-left" d="M66 78c-2 13-14 15-15 27-1 8 4 13 11 15" />
                                    <path className="avatar-tentacle tentacle-inner-left" d="M75 80c-1 13-7 17-6 29 1 7 5 11 11 14" />
                                    <path className="avatar-tentacle tentacle-inner-right" d="M85 80c1 13 7 17 6 29-1 7-5 11-11 14" />
                                    <path className="avatar-tentacle tentacle-right" d="M94 78c2 13 14 15 15 27 1 8-4 13-11 15" />
                                </g>
                                <g fill="#a9d4aa">
                                    <circle cx="51" cy="107" r="2" /><circle cx="65" cy="110" r="2" />
                                    <circle cx="95" cy="110" r="2" /><circle cx="109" cy="107" r="2" />
                                </g>
                                <path d="M30 140c14-10 30-12 50-12s36 2 50 12v20H30z" fill="#101e27" opacity=".9" />
                                <path d="M47 129c9 4 20 7 33 7s24-3 33-7" fill="none" stroke="#80c8a1" strokeWidth="1.5" opacity=".8" />
                            </svg>
                        </div>
                        <div className="profile-copy">
                            <span className="section-kicker">Perfil</span>
                            <h2 id="profile-title">Datos del jugador</h2>
                            <span className={`draft-status draft-status-${saveState}`} role="status">
                                {saveState === 'loading' ? 'Recuperando borrador...' :
                                    saveState === 'restored' ? 'Borrador anterior recuperado' :
                                        saveState === 'saving' ? 'Guardando cambios...' :
                                            saveState === 'error' ? 'No se pudo guardar el borrador' : 'Borrador guardado automáticamente'}
                            </span>
                        </div>
                    </div>
                    <form className="profile-grid" onSubmit={(event) => event.preventDefault()}>
                        {profileFields.map((field, index) => (
                            <label key={field.label} className="profile-item" htmlFor={`profile-field-${index}`}>
                                <span className="profile-label">{field.label}</span>
                                <input
                                    id={`profile-field-${index}`}
                                    className="profile-input"
                                    name={field.label}
                                    maxLength={48}
                                    value={profile[field.label]}
                                    onChange={(event) => updateProfile(field.label, event.target.value)}
                                    disabled={!draftLoaded}
                                />
                            </label>
                        ))}
                    </form>
                </section>
                <section className="section" id="juegos" aria-labelledby="games-title">
                    <div className="section-heading"><div><span className="section-kicker">Mis territorios</span><h2 id="games-title">Juegos favoritos</h2></div><span className="section-note">RONRONEO ACTIVO / 03</span></div>
                    <div className="games-grid">{games.map((game, index) => <article className="game-card" key={game.name}><div className={`game-art ${game.style}`} aria-hidden="true"><strong>{game.mark}</strong></div><div className="game-info"><div><span className="game-title">{game.name}</span><span className="game-role">{game.role}</span></div><span className="game-index">0{index + 1}</span></div></article>)}</div>
                </section>
                <section className="section" id="agenda" aria-labelledby="schedule-title">
                    <div className="section-heading"><div><span className="section-kicker">Cuando despierta la gata</span><h2 id="schedule-title">Rondas nocturnas</h2></div><span className="section-note">HORA DEL LOBBY</span></div>
                    <ul className="schedule">
                        <li className="schedule-row"><span className="schedule-day">Martes</span><span className="schedule-game">Call of Duty · ranked nocturno</span><time className="schedule-time">20:00 — 22:30</time></li>
                        <li className="schedule-row"><span className="schedule-day">Jueves</span><span className="schedule-game">Helldivers 2 · misión de la noche</span><time className="schedule-time">21:00 — 23:00</time></li>
                        <li className="schedule-row"><span className="schedule-day">Sábado</span><span className="schedule-game">Bloodborne · caza en la oscuridad</span><time className="schedule-time">22:00 — 01:00</time></li>
                    </ul>
                </section>
            </main>
            <footer className="site-footer"><span className="footer-note">GG, ronroneo y hasta la próxima.</span><nav className="socials" aria-label="Redes sociales"><a href="https://www.twitch.tv/" target="_blank" rel="noreferrer">Twitch ↗</a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube ↗</a><a href="https://discord.com/" target="_blank" rel="noreferrer">Discord ↗</a></nav></footer>
        </div>
    );
}