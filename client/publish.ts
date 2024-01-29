// Definiere, was ein Beitrag (Post) und die Antwort des Servers beinhaltet
interface Post {
  username: string;
  content: string;
}

interface PostResponse {
  allpost: Post[];
}

// Warte, bis die ganze Webseite geladen ist
document.addEventListener('DOMContentLoaded', () => {
  // Finde das Element auf der Webseite, in dem die Beiträge angezeigt werden
  const postWindow = document.getElementById('Feedwindow');

  // Funktion, um Beiträge vom Server zu laden und anzuzeigen
  async function showPosts() {
    try {
      // Sende eine Anfrage an den Server, um die Beiträge zu bekommen
      const response = await fetch('http://localhost:4200/getPost', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Wenn die Anfrage erfolgreich war, zeige die Beiträge an
      if (response.ok) {
        const result = await response.json();
        result.allpost.forEach(post => {
          const postElement = `
            <div>
              <p>${post.username}</p>
              <p>${post.content}</p>
            </div>
          `;
          postWindow.innerHTML += postElement;
        });
      } else {
        // Zeige eine Fehlermeldung, wenn etwas schiefgelaufen ist
        console.error('Fehler beim Laden der Beiträge');
      }
    } catch (error) {
      // Zeige eine Fehlermeldung, wenn ein Netzwerkfehler auftritt
      console.error('Netzwerkfehler:', error);
    }
  }

  // Lade die Beiträge, wenn die Seite aufgerufen wird
  showPosts();

  // Füge einen Event-Listener zum Post-Button hinzu
  const postButton = document.getElementById('postButton');
  postButton.addEventListener('click', async (event) => {
    event.preventDefault(); // Verhindere das Neuladen der Seite

    // Lese den Text aus dem Textfeld und das gespeicherte Token
    const postMessage = document.getElementById('postTextarea') as HTMLInputElement;
    const jwtToken = localStorage.getItem('Token');

    try {
      // Versuche, den neuen Beitrag an den Server zu senden
      const response = await fetch('http://localhost:4200/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postMessage, jwtToken }),
      });

      if (response.ok) {
        // Gib eine Erfolgsmeldung aus, wenn der Beitrag gespeichert wurde
        console.log('Beitrag erfolgreich gespeichert');
        showPosts(); // Lade die Beiträge neu, um den neuen Beitrag anzuzeigen
      } else {
        // Zeige eine Fehlermeldung, wenn das Speichern fehlschlägt
        console.error('Fehler beim Speichern des Beitrags');
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
    }
  });
});
