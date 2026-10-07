import ThemeToggle from '../components/ThemeToggle.jsx';

export default function LandingPage() {
    return (
        <div className="landing-page">
            <div className="page-shell">
                <header className="site-header">
                    <a className="brand" href="/" aria-label="MichiByte, inicio">
                        <span className="brand-mark" aria-hidden="true">M</span>
                        <span>MICHIBYTE</span>
                    </a>
                    <nav className="site-nav" aria-label="Navegación principal">
                        <a href="#universo">El universo</a>
                        <a className="landing-login" href="/login.html">Iniciar sesión <span aria-hidden="true">↗</span></a>
                        <ThemeToggle />
                    </nav>
                </header>

                <main>
                    <section className="landing-hero" aria-labelledby="landing-title">
                        <div className="landing-copy">
                            <p className="eyebrow"><span className="online-dot" aria-hidden="true" />Tu próximo checkpoint</p>
                            <h1 id="landing-title">Juega a tu<br /><span>manera.</span></h1>
                            <p className="landing-lede">Un rincón para compartir partidas, guardar tu perfil y volver a la aventura justo donde la dejaste.</p>
                            <div className="hero-actions">
                                <a className="button" href="/login.html?mode=register">Crear mi cuenta <span aria-hidden="true">↗</span></a>
                                <a className="button button-secondary" href="/login.html">Ya tengo cuenta</a>
                            </div>
                            <p className="landing-caption"><span aria-hidden="true">✦</span> Tu espacio gamer empieza aquí</p>
                        </div>

                        <div className="landing-art" aria-label="Ilustración de un gato gamer en un portal neón">
                            <div className="orbit orbit-one" />
                            <div className="orbit orbit-two" />
                            <div className="landing-console">
                                <span className="console-label">PLAYER 01 <span>● ONLINE</span></span>
                                <img
                                    className="landing-cat"
                                    src="/cat-landing.png"
                                    alt="Gato negro neon con ojos verdes"
                                />

                                <div className="console-status"><span className="status-bars"><i /><i /><i /><i /></span><span>LOBBY LISTO</span><span>LV. 09</span></div>
                            </div>
                            <span className="art-chip chip-top">SAVE POINT <b>01</b></span>
                            <span className="art-chip chip-bottom">RESPAWN · REPEAT</span>
                        </div>
                    </section>

                    <section className="landing-features" id="universo" aria-label="Lo que encontrarás en MichiByte">
                        <article className="feature-card">
                            <span className="feature-index">01 / TU PERFIL</span>
                            <span className="feature-icon" aria-hidden="true">◈</span>
                            <h2>Tu identidad, tu lobby</h2>
                            <p>Arma tu ficha de jugador y ten tus datos a mano cuando vuelvas.</p>
                        </article>
                        <article className="feature-card">
                            <span className="feature-index">02 / TU RITMO</span>
                            <span className="feature-icon" aria-hidden="true">⌁</span>
                            <h2>Sin perder el progreso</h2>
                            <p>Tus cambios se guardan como borrador mientras preparas tu perfil.</p>
                        </article>
                        <article className="feature-card">
                            <span className="feature-index">03 / TU PARTIDA</span>
                            <span className="feature-icon" aria-hidden="true">✧</span>
                            <h2>Vuelve cuando quieras</h2>
                            <p>Inicia sesión y continúa desde el punto en que lo dejaste.</p>
                        </article>
                    </section>
                </main>

                <footer className="landing-footer">
                    <span>GG, ronroneo y nos vemos en el lobby.</span>
                    <a href="/login.html?mode=register">Entrar al universo <span aria-hidden="true">↗</span></a>
                </footer>
            </div>
        </div>
    );
}
