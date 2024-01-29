import { Request, Response, Express } from 'express';
import bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Database } from '../database/database';
import { Post } from './publish/blog';
import { Comment } from './publish/comment';
import { UserManagement } from './usermanagement'; 

dotenv.config(); // Lädt Umgebungsvariablen aus einer .env-Datei, falls vorhanden

export class API {
    app: Express;
    database: Database;
    post: Post;
    comment: Comment;
    userManagement: UserManagement;

    // weist der Eigenschaft app des aktuellen Objekts (this) das übergebene app-Objekt zu, um es innerhalb der Klasse nutzen zu können.
    constructor(app: Express) {
        this.app = app;
        this.database = new Database(); 
        this.post = new Post(); 
        this.comment = new Comment(); 
        this.userManagement = new UserManagement(); 

        this.app.use(bodyParser.json()); 
}
}
