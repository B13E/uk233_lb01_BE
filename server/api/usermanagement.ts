import { Database } from '../database/database';

export class UserManagement {
  private database: Database;

  constructor() {
    this.database = new Database(); // Initialisiert eine Datenbankinstanz
  }

  // Setzt die Benutzerrolle in der Datenbank
  public async setUserRole(userId: number, role: 'user' | 'moderator' | 'admin'): Promise<void> {
    await this.database.executeSQL(`UPDATE users SET role = ? WHERE id = ?`, [role, userId]);
  }

}
