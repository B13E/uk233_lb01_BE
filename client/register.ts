// Warte, bis die gesamte Webseite geladen ist
document.addEventListener('DOMContentLoaded', () => {
  // Suche den Login-Button auf der Webseite
  const loginButton = document.getElementById('loginNavigationButton');
  if (loginButton) {
    // Wenn der Login-Button geklickt wird, gehe zur Registrierungsseite
    loginButton.addEventListener('click', () => {
      window.location.href = 'register.html';
    });
  }

  // Suche das Registrierungsformular auf der Webseite
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    // Wenn das Formular abgeschickt wird, führe die folgenden Schritte aus
    registrationForm.addEventListener('submit', async (event) => {
      // Verhindere, dass die Seite neu geladen wird
      event.preventDefault();

      // Hole die eingegebenen Daten aus den Formularfeldern
      const usernameInput = document.getElementById('username') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const username = usernameInput.value;
      const password = passwordInput.value;

      try {
        // Sende die eingegebenen Daten an den Server
        const response = await fetch('http://localhost:4200/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        // Überprüfe, ob die Registrierung erfolgreich war
        if (response.ok) {
          console.log('Registrierung erfolgreich.');
        } else {
          console.error('Fehler bei der Registrierung:', response.statusText);
        }
      } catch (error) {
        console.error('Netzwerkfehler:', error);
      }
    });
  }
});
