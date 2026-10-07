/**
 * protector.js - Protector de páginas que requieren autenticación
 * 
 * Este script se ejecuta en páginas protegidas (como michibyte.html)
 * y verifica que el usuario esté autenticado. Si no, redirige a login.
 * También agrega un botón de logout funcional.
 */

(function () {
    // Verificar autenticación al cargar la página
    async function initProtection() {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
            // No autenticado, redirigir a login
            window.location.href = '/login.html';
            return;
        }

        // Autenticado, agregar botón de logout
        addLogoutButton();
    }

    // Función para agregar botón de logout al DOM
    function addLogoutButton() {
        // Crear contenedor para el botón
        const logoutContainer = document.createElement('div');
        logoutContainer.id = 'logout-container';
        logoutContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;

        // Crear botón
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.textContent = 'Cerrar Sesión';
        logoutBtn.style.cssText = `
            padding: 10px 20px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 5px 10px rgba(231, 76, 60, 0.3);
        `;

        // Evento hover
        logoutBtn.addEventListener('mouseover', () => {
            logoutBtn.style.transform = 'translateY(-2px)';
            logoutBtn.style.boxShadow = '0 8px 15px rgba(231, 76, 60, 0.4)';
        });

        logoutBtn.addEventListener('mouseout', () => {
            logoutBtn.style.transform = 'translateY(0)';
            logoutBtn.style.boxShadow = '0 5px 10px rgba(231, 76, 60, 0.3)';
        });

        // Evento click para logout
        logoutBtn.addEventListener('click', async () => {
            logoutBtn.disabled = true;
            logoutBtn.textContent = 'Cerrando sesión...';

            try {
                await handleLogout();
            } catch (error) {
                console.error('Error en logout:', error);
                // Aunque falle, redirigir a login de todas formas
                window.location.href = '/login.html';
            }
        });

        // Agregar botón al contenedor
        logoutContainer.appendChild(logoutBtn);

        // Agregar contenedor al body
        document.body.appendChild(logoutContainer);
    }

    // Ejecutar protección cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }
})();
