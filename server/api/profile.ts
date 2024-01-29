// Importiere das Database-Modul für die Datenbankverbindung
import { Database } from '../database/database';

export class Profile {
    private database: Database;

    constructor() {
        // Erstelle eine Verbindung zur Datenbank
        this.database = new Database();
    }

    // Methode zum Aktualisieren des Benutzernamens in der Datenbank
    public async updateUsername(userId: number, newUsername: string): Promise<void> {
        // Führe eine SQL-Abfrage aus, um den Benutzernamen zu aktualisieren
        await this.database.executeSQL(`UPDATE users SET username = ? WHERE id = ?`, [newUsername, userId]);
    }

    // Methode zum Aktualisieren des Passworts in der Datenbank
    public async updatePassword(userId: number, newPassword: string): Promise<void> {
        // Einfachheitshalber wird hier auf die Passwortverschlüsselung verzichtet
        // Im echten Einsatz sollte das Passwort immer verschlüsselt werden!
        await this.database.executeSQL(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, userId]);
    }

    // Funktion zum Aktualisieren des Benutzernamens über eine Webanfrage
    public updateUsernameHandler = async (req, res) => {
        // Hole die Daten aus der Anfrage
        const userId = req.body.userId;
        const newUsername = req.body.newUsername;
        try {
            // Aktualisiere den Benutzernamen
            await this.updateUsername(userId, newUsername);
            // Sende eine Erfolgsmeldung zurück
            res.json({ message: 'Benutzername aktualisiert.' });
        } catch (error) {
            // Sende eine Fehlermeldung, wenn etwas schiefgeht
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
