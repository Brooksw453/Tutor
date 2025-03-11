// Get URL parameter for subject
const params = new URLSearchParams(window.location.search);
const subject = params.get('subject');

// Default to "Writing" if subject param is missing
const currentSubject = subjects[subject] ? subject : "Writing";

const subjects = {
    "Writing": {
        system: "You are a supportive writing tutor helping students with brainstorming, drafting, feedback, and citations. Do not write for students; guide them to improve their own writing.",
        suggestions: ["Help me brainstorm topics", "Give feedback on my draft", "Help me with my citations"]
    },
    "Math": {
        system: "You are a supportive math tutor assisting students with solving math problems, understanding concepts, and studying effectively. Guide them clearly step-by-step.",
        suggestions: ["Explain quadratic equations", "Help me understand derivatives", "Guide me through this algebra problem"]
    },
    "Science": {
        system: "You are a helpful science tutor explaining concepts, experiments, scientific methods, and guiding students through scientific topics clearly.",
        suggestions: ["Explain photosynthesis", "Describe the water cycle", "Help me design an experiment"]
    },
    "Engineering": {
        system: "You are a helpful engineering tutor guiding students through engineering concepts, problem-solving, design principles, and practical applications.",
        suggestions: ["Explain basic circuit design", "Guide me on mechanics problems", "Help me understand thermodynamics"]
    }
};

document.getElementById('subject-title').innerText = currentSubject + " Tutor";

// Corrected definition of suggestionDiv
const suggestionDiv = document.getElementById('suggestions');
suggestionDiv.innerHTML = ""; // clear existing suggestions

// Create suggestion buttons
subjects[currentSubject].suggestions.forEach(suggestion => {
    const btn = document.createElement('button');
    btn.className = "suggestion-btn";
    btn.textContent = suggestion;
    btn.onclick = () => {
        document.getElementById('user-input').value = suggestion;
        document.getElementById('submit-btn').click(); // automatically submit
    };
    suggestionDiv.appendChild(btn);
});

document.getElementById('submit-btn').onclick = async () => {
    const prompt = document.getElementById('user-input').value;
    const responseBox = document.getElementById('response-box');

    if (!prompt) {
        responseBox.textContent = "Please enter a prompt.";
        return;
    }

    responseBox.textContent = "Loading...";

    // Correct API URL with protocol (HTTPS required)
    const apiUrl = "https://api-worker.brookswinchell.workers.dev";

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subject: currentSubject,
                prompt: prompt,
                system: subjects[currentSubject].system
            })
        });

        if (!res.ok) {
            responseBox.textContent = `Server error: ${res.status}`;
            return;
        }

        const data = await res.json();

        if (data.response) {
            responseBox.textContent = data.response;
        } else {
            responseBox.textContent = "Unexpected response format from server.";
        }
    } catch (err) {
        responseBox.textContent = "Error: " + err.message;
    }
};
