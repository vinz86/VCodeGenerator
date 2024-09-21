export class CookieService {

    public save(key: string, value: string, days: number = 7): void {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${key}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; Secure; HttpOnly; SameSite=Lax`;
        } catch (error) {
            console.error(`Errore nel salvataggio del cookie ${key}:`, error);
        }
    }

    public load(key: string): string | null {
        try {
            const matches = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
            return matches ? decodeURIComponent(matches[1]) : null;
        } catch (error) {
            console.error(`Errore nel recupero del cookie ${key}:`, error);
            return null;
        }
    }

    public remove(key: string): void {
        try {
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax`;
        } catch (error) {
            console.error(`Errore nella rimozione del cookie ${key}:`, error);
        }
    }
}
