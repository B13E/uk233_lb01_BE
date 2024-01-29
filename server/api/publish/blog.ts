// Importiere benötigte Module und Definitionen
import { Database } from '../../database/database';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

// Definiere die Struktur für Post-Daten
interface PostData {
    post_id: number;
    username: string;
    content: string;
}

// Klasse für die Verwaltung von Beiträgen
export class Post {
    database: Database; // Datenbankinstanz

    constructor() {
        // Erstelle eine neue Datenbankverbindung
        this.database = new Database();
    }

    // Methode zum Speichern eines neuen Beitrags in der Datenbank
    public async savePost(message: string, token: string): Promise<void> {
        // Standardgeheimcode, falls kein spezieller Geheimcode vorhanden ist
        const secretOrKey = process.env.TOKEN_SECRET || 'defaultSecret';
        // Entschlüssle das JWT, um den Benutzernamen zu erhalten
        const decodedToken = jwt.verify(token, secretOrKey) as JwtPayload;
        const username = decodedToken.username;

        // Suche in der Datenbank nach dem Benutzer
        const userResult = await this.database.executeSQL(`SELECT id FROM users WHERE username = ?`, [username]);
        if (userResult.length > 0) {
            // Speichere den neuen Beitrag, wenn der Benutzer gefunden wird
            const userId = userResult[0].id;
            await this.database.executeSQL(`INSERT INTO posts (user_id, content) VALUES (?, ?)`, [userId, message]);
        } else {
            // Fehler, wenn kein Benutzer gefunden wird
            throw new Error('Benutzer nicht gefunden');
        }
    }

    // Methode zum Abrufen aller Beiträge aus der Datenbank
    public async getPost(): Promise<PostData[]> {
        // Abfrage zur Erhaltung aller Beiträge
        const postData = await this.database.executeSQL(
            `SELECT posts.id AS post_id, users.username AS username, posts.content AS content FROM posts JOIN users ON users.id = posts.user_id`
        );
        return postData as PostData[];
    }

    // Methode zum Bearbeiten eines Beitrags
    public async editPost(postId: number, newContent: string): Promise<void> {
        // Aktualisiere den Beitrag in der Datenbank
        await this.database.executeSQL(`UPDATE posts SET content = ? WHERE id = ?`, [newContent, postId]);
    }

    // Methode zum Löschen eines Beitrags
    public async deletePost(postId: number): Promise<void> {
        // Lösche den Beitrag aus der Datenbank
        await this.database.executeSQL(`DELETE FROM posts WHERE id = ?`, [postId]);
    }
}
