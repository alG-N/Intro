const facts = [
    "🖌️ Digital artist & pixel doodler",
    "📚 Huge-reader of light novels",
    "🤖 Creator of the FumoBOT",
    "🎧 Has an entire playlist of JP bangers",
    "🎲 RNG master — luck is my strategy"
];

const factsList = document.getElementById('facts-list');

facts.forEach((fact, index) => {
    const li = document.createElement('li');
    li.textContent = fact;
    li.style.animation = `fadeIn 1s ease forwards`;
    li.style.animationDelay = `${0.7 + index * 0.2}s`;
    factsList.appendChild(li);
});

function hideApp() {
    document.getElementById('app-container').classList.add('hidden');
}

function showFumo() {
    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('fumobot-page').classList.remove('hidden');
}


function goBack() {
    document.getElementById('fumobot-page').classList.add('hidden');
    document.getElementById('main-page').classList.remove('hidden');
}

function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.container').forEach(container => {
        container.classList.add('hidden');
    });

    // Show the selected one
    document.getElementById(pageId).classList.remove('hidden');
}


  
