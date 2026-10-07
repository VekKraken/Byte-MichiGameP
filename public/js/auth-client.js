/**
 * auth-client.js - Cliente seguro para autenticación
 * 
 * Funciones de utilidad para manejo de autenticación desde el cliente.
 * Las credenciales siempre se validan en el servidor.
 * Las cookies httpOnly nunca son accesibles desde JavaScript.
 */

// Función para verificar si hay sesión activa
async function checkAuth() {
    try {
        const response = await fetch('/api/check-auth', {
            credentials: 'include' // Incluir cookies
        });
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
}

// Función para hacer logout
async function handleLogout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'GET',
            credentials: 'include' // Incluir cookies
        });
        const data = await response.json();

        if (data.success) {
            // Redireccionar a login
            window.location.href = data.redirect;
        }
    } catch (error) {
        console.error('Error en logout:', error);
        window.location.href = '/login.html';
    }
}

// Función para redirigir a login si no está autenticado
async function redirectToLoginIfNotAuthenticated() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        window.location.href = '/login.html';
    }
}
