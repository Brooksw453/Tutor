// script.js
// Note: Insert your OpenAI API key in the apiKey variable below.
const apiKey = "YOUR_OPENAI_API_KEY_HERE";  // <-- secure this as described below

async function sendQuery(prefill) {
  const queryInput = document.getElementById('queryInput');
  const userQuery = prefill || queryInput.value.trim();
  if (!userQuery) {
    return;  // don't send empty queries
  }

  // Prepare the message payload for OpenAI API
  const messages = [
    { role: "system", content: typeof systemPrompt !== 'undefined' ? systemPrompt : "" },
    { role: "user", content: userQuery }
  ];

  // Optionally, you can clear the input after sending
  queryInput.value = "";

  // Show a placeholder or loading message in the response area
  const responseDiv = document.getElementById('response');
  responseDiv.textContent = "Thinking...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,     // limit the response length (adjust as needed)
        temperature: 0.7     // adjust creativity of the response
      })
    });
    const data = await response.json();
    if (data.error) {
      // Display error from API (e.g., invalid key or rate limit)
      responseDiv.textContent = "Error: " + data.error.message;
    } else if (data.choices && data.choices.length > 0) {
      // Put the assistant's reply into the response div
      responseDiv.textContent = data.choices[0].message.content;
    } else {
      responseDiv.textContent = "[No response]";
    }
  } catch (err) {
    // Network or other error
    console.error("Request failed:", err);
    responseDiv.textContent = "Error: " + err.message;
  }
}
