// Get the current subject from URL (e.g., writing.html?subject=Writing)
const params = new URLSearchParams(window.location.search);
const subject = params.get('subject');

// Define your subjects and system prompts
const subjects = {
    "Writing": {
        system: "You are a supportive writing tutor. Assist students with brainstorming, outlining, drafting, feedback, editing, research, and citations. Do not write for them directly.",
        suggestions: ["Help me brainstorm topics", "Give feedback on my draft", "Help me with my citations"]
    },
    "Math": {
        system: "You are a supportive math tutor helping students solve math problems, understand concepts, and study effectively. Clearly guide them step-by-step without providing answers outright.",
        suggestions: ["Explain quadratic equations", "How do I find derivatives?", "Tips for solving integrals"]
    },
    "Science": {
        system: "You are a supportive science tutor assisting students in understanding scientific concepts, structuring experiments, and fostering critical thinking.",
        suggestions: ["Explain photosynthesis", "Guide me through a science experiment", "What is Newton's Second Law?"]
    },
    "Engineering": {
        system: "You are a helpful engineering tutor guiding students through engineering problems, design principles, and practical applications clearly and step-by-step.",
        suggestions: ["Explain basic circuit design", "How do I approach mechanical design problems?", "Help me understand thermodynamics"]
    }
};

// Populate suggested prompts
const suggestionDiv = document.getElementById('suggestions');
subjects[subject].suggestions.forEach(suggestion => {
    const btn = document.createElement('button');
    btn.textContent = suggestion;
    btn.classList.add('btn', 'suggestion');
    btn.onclick = () => {
        document.getElementById('user-input').value = suggestion;
        sendQuery();  // send query automatically upon clicking suggestion
    };
    suggestionDiv.appendChild(btn);
});

// Function to send query
async function sendQuery() {
    const prompt = document.getElementById('user-input').value;
    const responseBox = document.getElementById('response');

    if (!prompt) return;

    responseBox.textContent = "Thinking...";

    // Replace with your Cloudflare Worker URL
    const apiUrl = 'https://api-worker.brookswinchell.workers.dev/';

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                subject: subject,
                prompt: prompt,
                system: subjects[subject].system
            })
        });

        const data = await res.json();
        responseBox.textContent = data.response;
    } catch (err) {
        responseBox.textContent = "Error fetching response: " + err.message;
    }
}

// Attach function to submit button
document.getElementById('submit-btn').onclick = sendQuery;
