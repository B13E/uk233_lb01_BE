// Importiere das mariadb-Modul, um eine Verbindung zur MariaDB-Datenbank herzustellen
import mariadb from 'mariadb';

export class Database {
  private _pool;

  constructor() {
    // Erstelle eine Verbindungspool-Instanz für die Datenbank
    this._pool = mariadb.createPool({
      database: 'minitwitter', // Name der Datenbank
      host: 'localhost', // Adresse des Datenbankservers
      user: 'minitwitter', // Benutzername für die Datenbank
      password: 'supersecret123', // Passwort für die Datenbank
      connectionLimit: 5 // Maximale Anzahl gleichzeitiger Verbindungen
    });
  }

  // Methode, um eine SQL-Anweisung auf der Datenbank auszuführen
  public async executeSQL(query: string, values?: any[]): Promise<any> {
    try {
      const conn = await this._pool.getConnection(); // Holt eine Verbindung aus dem Pool
      const res = await conn.query(query, values); // Führt die SQL-Anweisung aus
      conn.release(); // Gibt die Verbindung zurück in den Pool
      return res; // Gibt das Ergebnis der Anfrage zurück
    } catch (err) {
      console.error('Fehler bei der Ausführung der SQL-Anweisung:', err);
      throw err; // Gibt den Fehler weiter
    }
  }
}
