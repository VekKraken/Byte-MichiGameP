# Instrucciones de desarrollo seguro

## Principios generales
- Sigue las convenciones y el stack ya usado en el proyecto; evita agregar dependencias sin necesidad.
- Haz cambios pequeños y enfocados. No expongas, registres ni confirmes contraseñas, tokens, claves u otros secretos.
- Guarda la configuración sensible en variables de entorno y documenta solo nombres y ejemplos ficticios. No subas archivos `.env`.

## Validación y manejo de datos
- Valida y normaliza toda entrada no confiable en el servidor, incluyendo parámetros, cuerpo, encabezados y archivos.
- Usa consultas parametrizadas si se incorpora una base de datos; nunca construyas consultas concatenando entrada del usuario.
- Codifica o escapa los datos según el contexto antes de mostrarlos en HTML. No insertes contenido no confiable como HTML sin sanitizarlo.
- Limita tamaños y formatos de solicitudes, y rechaza los valores inválidos con respuestas claras sin revelar detalles internos.

## Autenticación y sesiones
- No implementes autenticación o autorización solo en el cliente; verifica permisos en el servidor para cada operación protegida.
- Protege cookies de sesión con `HttpOnly`, `Secure` en producción y una política `SameSite` adecuada. Evita guardar credenciales o tokens sensibles en `localStorage`.
- Si se usan cookies para autenticar operaciones que cambian datos, considera protección CSRF.

## Errores, dependencias y pruebas
- No devuelvas trazas, rutas locales, consultas ni secretos al cliente. Registra solo lo necesario y evita incluir datos sensibles en logs.
- Mantén dependencias actualizadas y revisa su origen y necesidad antes de agregarlas.
- Añade o actualiza pruebas para validar entradas inválidas, permisos y comportamiento esperado; ejecuta las comprobaciones relevantes antes de finalizar.
- No desactives controles de seguridad para hacer pasar una prueba o resolver un error.