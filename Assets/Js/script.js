const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const loadingSpinner = document.getElementById('loading');

sendButton.addEventListener('click', async () => {
  const userMessage = chatInput.value.trim();
  if (userMessage) {
    addMessage(userMessage, 'user');
    chatInput.value = '';
    loadingSpinner.style.display = 'block';

    try {
      const botResponse = await getBotResponse(userMessage);
      addMessage(botResponse, 'bot');
    } catch (error) {
      addMessage("Error: Unable to fetch response.", 'bot');
    } finally {
      loadingSpinner.style.display = 'none';
    }
  }
});

async function getBotResponse(prompt) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "contents": [
      {
        "parts": [
          {
            "text": prompt
          }
        ]
      }
    ]
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
    ModelID: "tunedModels/astra-health-9gl1utcfn1bm"
  };

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAwPKz6B2XoMNZB0IdMHhSDc8JQ7aIN1hE",
    requestOptions
  );

  if (!response.ok) {
    throw new Error("Failed to fetch response");
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No valid response received.";
}

function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}