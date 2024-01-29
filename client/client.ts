// Definiere, was eine erfolgreiche Login-Antwort vom Server enthält
interface LoginResponse {
  token: string;
}

// Definiere, was eine erfolgreiche Registrierungsantwort vom Server enthält
interface RegistrationResponse {
  success: boolean;
  message: string;
}

// Warte, bis die Webseite komplett geladen ist
document.addEventListener('DOMContentLoaded', () => {

  // Suche den Login-Button auf der Seite und reagiere, wenn er geklickt wird
  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    loginButton.addEventListener('click', async () => {

      // Hole den Benutzernamen und das Passwort aus den Eingabefeldern
      const loginUsername = document.getElementById('loginUsername') as HTMLInputElement;
      const loginPassword = document.getElementById('loginPassword') as HTMLInputElement;

      try {
        // Sende eine Anfrage an den Server mit Benutzername und Passwort
        const response = await fetch('http://localhost:4200/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ loginUsername, loginPassword }),
        });

        // Überprüfe, ob die Anfrage erfolgreich war
        if (response.ok) {
          // Verarbeite die Antwort des Servers
          const result = await response.json();
          console.log('Login erfolgreich. Token:', result.token);

          // Speichere das Token und gehe zur nächsten Seite
          localStorage.setItem('Token', result.token);
          window.location.href = 'publish.html';
        } else {
          // Zeige eine Fehlermeldung an, wenn etwas schiefgegangen ist
          console.error('Fehler beim Login:', response.statusText);
        }
      } catch (error) {
        // Zeige eine Fehlermeldung an, wenn ein Netzwerkfehler auftritt
        console.error('Netzwerkfehler:', error);
      }
    });
  }

  // Suche den Registrieren-Button und reagiere, wenn er geklickt wird
  const registerButton = document.getElementById('registerButton');
  if (registerButton) {
    registerButton.addEventListener('click', () => {
      // Wechsle zur Registrierungsseite
      window.location.href = 'register.html';
    });
  }
});
