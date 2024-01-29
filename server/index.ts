// Importieren der notwendigen Module und Klassen.
// Express wird für die Webserver-Funktionalität verwendet.
import express, { Express, Request, Response } from 'express'
import { API } from './api/api'
import http from 'http'
import { resolve, dirname } from 'path'
import { Database } from './database/database'

// Definition der Backend-Klasse, die als Kern des Backends dient.
class Backend {
  // Deklaration privater Variablen für die Express-App, API, Datenbank und Umgebungsvariablen.
  private _app: Express
  private _api: API
  private _database: Database
  private _env: string

  // Getter-Methoden für den Zugriff auf die App, API und Datenbankinstanzen von außerhalb der Klasse.
  public get app(): Express {
    return this._app
  }

  public get api(): API {
    return this._api
  }

  public get database(): Database {
    return this._database
  }

  // Konstruktor, der bei der Erstellung einer Instanz der Backend-Klasse aufgerufen wird.
  constructor() {
    // Initialisierung der Express-App, der Datenbank und der API.
    this._app = express()
    this._database = new Database()
    this._api = new API(this._app)
    // Festlegen der Umgebungsvariablen auf den Wert der Systemumgebung oder 'development', falls nicht gesetzt.
    this._env = process.env.NODE_ENV || 'development'

    // Aufruf von Methoden zum Einrichten der Serverkonfiguration.
    this.setupStaticFiles()
    this.setupRoutes()
    this.startServer()
  }

  // Methode zum Einrichten eines Verzeichnisses für statische Dateien, hier 'client'.
  private setupStaticFiles(): void {
    this._app.use(express.static('client'))
  }

  // Methode zum Einrichten von Routen, hier eine einfache Route für die Root-URL.
  private setupRoutes(): void {
    this._app.get('/', (req: Request, res: Response) => {
      // Verwendung von 'resolve' und 'dirname' zur Ermittlung des Pfades zur Index-HTML-Datei.
      const __dirname = resolve(dirname(''))
      res.sendFile(__dirname + '/client/index.html')
    })
  }

  // Methode zum Starten des HTTP-Servers, wenn die App im Produktionsmodus läuft.
  private startServer(): void {
    if (this._env === 'production') {
      // Erstellen und Starten eines HTTP-Servers auf Port 3000.
      http.createServer(this.app).listen(3000, () => {
        console.log('Server is listening!')
      })
    }
  }
}

// Erstellen einer Backend-Instanz und Exportieren der Express-App für eventuelle weitere Verwendungen.
const backend = new Backend()
export const viteNodeApp = backend.app
