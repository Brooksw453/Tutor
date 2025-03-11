const params = new URLSearchParams(window.location.search);
const subject = params.get('subject');

const subjects = {
    "Writing": {
        system: "You are a supportive writing tutor helping students with brainstorming, drafting, feedback, and citations. Do not write for students; guide them to improve their own writing.",
        suggestions: ["Help me brainstorm topics", "Give feedback on my draft", "Help me with my citations"]
    },
    "Math": {
        system: "You are a supportive math tutor assisting students with solving math problems, understanding concepts, and studying effectively. Guide them clearly step-by-step.",
        suggestions: ["Explain how to solve quadratic equations", "Help me understand derivatives", "Guide me through this algebra problem"]
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

document.getElementById('subject-title').innerText = subject + " Tutor";

const suggestionDiv = document.getElementById('suggestions');
subjects[subject].suggestions.forEach(suggestion => {
    const btn = document.createElement('button');
    btn.className = "suggestion-btn";
    btn.textContent = suggestion;
    btn.onclick = () => {
        document.getElementById('user-input').value = suggestion;
    };
    suggestionDiv.appendChild(btn);
});

document.getElementById('submit-btn').onclick = async () => {
    const prompt = document.getElementById('user-input').value;
    const responseBox = document.getElementById('response-box');
    responseBox.textContent = "Loading...";

    // ⚠️ SECURITY ALERT: Replace with your own secure backend proxy endpoint.
    const apiUrl = "tutor.brookswinchell.workers.dev";

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
};
