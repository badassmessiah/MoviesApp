export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function saveToSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

export function saveToCookies(key, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${key}=${encodeURIComponent(value)};${expires};path=/`;
}

export function getFromCookies(key) {
    const name = key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}