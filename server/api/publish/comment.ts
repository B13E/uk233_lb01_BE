import { Request, Response } from 'express';
import { Database } from '../../database/database';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export class Comment {
    private database: Database;

    constructor() {
        this.database = new Database();
    }

    // Methode zum Erstellen eines Kommentars
    public async createComment(postId: number, userId: number, commentText: string): Promise<void> {
        await this.database.executeSQL(
            `INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)`,
            [postId, userId, commentText]
        );
    }

    // Methode zum Bearbeiten eines Kommentars
    public async editComment(commentId: number, newCommentText: string): Promise<void> {
        await this.database.executeSQL(
            `UPDATE comments SET comment = ? WHERE id = ?`,
            [newCommentText, commentId]
        );
    }

    // Methode zum Löschen eines Kommentars
    public async deleteComment(commentId: number): Promise<void> {
        await this.database.executeSQL(
            `DELETE FROM comments WHERE id = ?`,
            [commentId]
        );
    }

    // Methode zur Überprüfung eines Tokens und Extrahierung der Benutzer-ID
    private verifyToken(token: string): string | null {
        try {
            const secretOrKey = process.env.TOKEN_SECRET || 'defaultSecret';
            const decodedToken = jwt.verify(token, secretOrKey) as JwtPayload;
            return decodedToken && decodedToken.userId;
        } catch (error) {
            return null;
        }
    }

    // Request-Handler-Methode zum Erstellen eines Kommentars
    public createCommentHandler = async (req: Request, res: Response): Promise<void> => {
        const postId = Number(req.body.postId); // Umwandlung in Number
        const commentText = req.body.commentText;
        const jwtToken = req.body.jwtToken;

        try {
            const userId = this.verifyToken(jwtToken);
            if (userId) {
                await this.createComment(postId, Number(userId), commentText);
                res.json({ message: 'Kommentar erstellt' });
            } else {
                res.status(403).json({ error: 'Nicht autorisiert' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}
