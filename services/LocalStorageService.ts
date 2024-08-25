export class LocalStorageService {
  save(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Errore nel salvataggio su localStorage:', error);
    }
  }

  load(key: string): any {
    try {
      const data = localStorage.getItem(key);
      if (data) {
          return JSON.parse(data);
      }
    } catch (error) {
      console.error('Errore nel recupero dei dati da localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

