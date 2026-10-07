require('dotenv').config({ override: true });
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, 'public');
const buildDirectory = path.join(__dirname, 'dist');
const appEntry = path.join(buildDirectory, 'index.html');

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Almacenamiento de sesiones en memoria
const sessions = new Map();
const loginAttempts = new Map();
const usersFile = process.env.USERS_FILE || path.join(__dirname, 'data', 'users.json');

function loadUsers() {
    if (!fs.existsSync(usersFile)) return new Map();

    const savedUsers = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    if (!Array.isArray(savedUsers)) {
        throw new Error('El archivo de usuarios debe contener una lista.');
    }

    const loadedUsers = new Map();
    for (const user of savedUsers) {
        if (
            !user ||
            typeof user.username !== 'string' ||
            typeof user.salt !== 'string' ||
            typeof user.passwordHash !== 'string' ||
            !/^[a-f0-9]{32}$/.test(user.salt) ||
            !/^[a-f0-9]{128}$/.test(user.passwordHash)
        ) {
            throw new Error('El archivo de usuarios contiene datos inválidos.');
        }

        const usernameKey = user.username.toLowerCase();
        if (loadedUsers.has(usernameKey)) {
            throw new Error('El archivo de usuarios contiene nombres duplicados.');
        }
        loadedUsers.set(usernameKey, user);
    }
    return loadedUsers;
}

function saveUsers(nextUsers) {
    const directory = path.dirname(usersFile);
    fs.mkdirSync(directory, { recursive: true });

    const temporaryFile = `${usersFile}.${process.pid}.tmp`;
    fs.writeFileSync(temporaryFile, JSON.stringify([...nextUsers.values()], null, 2), { mode: 0o600 });
    fs.renameSync(temporaryFile, usersFile);
}

const users = loadUsers();

// Configuración de credenciales (desde .env)
const VALID_USERNAME = process.env.USERNAME || 'admin';
const VALID_PASSWORD = process.env.PASSWORD || 'password123';

// Función para generar ID de sesión
function generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
}

// Función para obtener IP del cliente
function getClientIp(req) {
    return req.ip || req.connection.remoteAddress || '0.0.0.0';
}

// Función para verificar si está bloqueado por brute force
function isBlockedByBruteForce(ip) {
    const attempts = loginAttempts.get(ip);
    if (!attempts) return false;

    const now = Date.now();
    const timeSinceLastAttempt = now - attempts.lastAttempt;

    // Si han pasado más de 30 segundos, reiniciar contador
    if (timeSinceLastAttempt > 30000) {
        loginAttempts.delete(ip);
        return false;
    }

    // Si hay 5+ intentos fallidos, está bloqueado
    return attempts.count >= 5;
}

// Función para registrar intento fallido
function recordFailedAttempt(ip) {
    const now = Date.now();
    const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(ip, attempts);
}

// Función para limpiar intentos fallidos tras login exitoso
function clearFailedAttempts(ip) {
    loginAttempts.delete(ip);
}

function createSession(username, res) {
    const sessionId = generateSessionId();
    sessions.set(sessionId, { username, createdAt: Date.now() });
    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000
    });
}

// Ruta: Verificar autenticación actual
app.get('/api/check-auth', (req, res) => {
    const sessionId = req.cookies.sessionId;
    const session = sessions.get(sessionId);

    if (session) {
        return res.json({ authenticated: true, username: session.username });
    }

    return res.json({ authenticated: false });
});

// Ruta: Login POST
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const clientIp = getClientIp(req);

    // Verificar si está bloqueado por brute force
    if (isBlockedByBruteForce(clientIp)) {
        return res.status(429).json({
            error: 'Demasiados intentos fallidos. Intente más tarde.'
        });
    }

    const registeredUser = typeof username === 'string' ? users.get(username.toLowerCase()) : null;
    let validCredentials = username === VALID_USERNAME && password === VALID_PASSWORD;

    if (!validCredentials && registeredUser && typeof password === 'string') {
        const candidateHash = crypto.scryptSync(password, registeredUser.salt, 64);
        validCredentials = crypto.timingSafeEqual(candidateHash, Buffer.from(registeredUser.passwordHash, 'hex'));
    }

    if (validCredentials) {
        // Limpiar intentos fallidos
        clearFailedAttempts(clientIp);
        createSession(registeredUser ? registeredUser.username : username, res);

        return res.json({
            success: true,
            message: 'Login exitoso',
            redirect: '/michibyte.html'
        });
    }

    // Credenciales inválidas
    recordFailedAttempt(clientIp);

    // Mensaje genérico (no revela si usuario existe)
    return res.status(401).json({
        error: 'Credenciales inválidas'
    });
});

// Ruta: Crear cuenta
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== 'string' || !/^[a-zA-Z0-9_-]{3,24}$/.test(username)) {
        return res.status(400).json({
            error: 'El usuario debe tener entre 3 y 24 caracteres: letras, números, guion o guion bajo.'
        });
    }

    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
        return res.status(400).json({ error: 'La contraseña debe tener entre 8 y 128 caracteres.' });
    }

    const usernameKey = username.toLowerCase();
    if (usernameKey === VALID_USERNAME.toLowerCase() || users.has(usernameKey)) {
        return res.status(409).json({ error: 'Ese nombre de usuario ya está en uso.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');
    const nextUsers = new Map(users);
    nextUsers.set(usernameKey, { username, salt, passwordHash });
    saveUsers(nextUsers);
    users.set(usernameKey, { username, salt, passwordHash });
    createSession(username, res);

    return res.status(201).json({
        success: true,
        message: 'Cuenta creada',
        redirect: '/michibyte.html'
    });
});

// Ruta: Logout GET
app.get('/api/logout', (req, res) => {
    const sessionId = req.cookies.sessionId;

    // Destruir sesión en servidor
    if (sessionId) sessions.delete(sessionId);

    // Limpiar cookie
    res.clearCookie('sessionId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });

    return res.json({
        success: true,
        message: 'Logout exitoso',
        redirect: '/login.html'
    });
});

// Keep previous profile URLs working while MichiByte is the canonical profile URL.
app.get('/login.html', (req, res) => {
    res.sendFile(appEntry);
});

app.get('/michibyte.html', (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (sessions.has(sessionId)) {
        return res.sendFile(appEntry);
    }

    // No autenticado, redirigir a login
    return res.redirect('/login.html');
});

app.get('/perfil-gamer.html', (req, res) => {
    res.redirect('/michibyte.html');
});

app.get('/formulario-registro.html', (req, res) => {
    res.redirect('/login.html?mode=register');
});

app.use(express.static(buildDirectory));
app.use(express.static(publicDirectory));

app.get('*', (req, res, next) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) {
        return next();
    }

    return res.sendFile(appEntry);
});

app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Ruta API no encontrada' });
});

// Servidor iniciado
app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════╗
  ║     Login System - Servidor Iniciado     ║
  ║                                          ║
  ║  URL: http://localhost:${PORT}            ║
  ║  Login: http://localhost:${PORT}/login.html   ║
  ║  MichiByte: http://localhost:${PORT}/michibyte.html           ║
  ║                                          ║
  ║  CREDENCIALES (en .env):                 ║
  ║  Usuario: ${VALID_USERNAME}                    ║
  ║  Contraseña: [oculta en servidor]       ║
  ╚══════════════════════════════════════════╝
  `);
});
