export class LocalStorageService {
  save(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Errore nel salvataggio su localStorage:', error);
    }
  }

  load(key: string): any {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Errore nel parsing dei dati da localStorage:', error);
        return null;
      }
    }
    return null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

