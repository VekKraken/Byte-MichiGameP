async function requestJson(url, options = {}) {
    const response = await fetch(url, {
        credentials: 'include',
        ...options
    });
    const data = await response.json();
    return { response, data };
}

export async function checkAuth() {
    const { data } = await requestJson('/api/check-auth');
    return Boolean(data.authenticated);
}

export async function getSessionUser() {
    const { data } = await requestJson('/api/check-auth');
    return data.authenticated ? data.username : null;
}

export async function login(username, password) {
    return requestJson('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
}

export async function register(username, password) {
    return requestJson('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
}

export async function logout() {
    return requestJson('/api/logout');
}