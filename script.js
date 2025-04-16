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

const animeGrid = document.querySelector('.anime-grid');

animeGrid.addEventListener('wheel', function (e) {
    if (e.deltaY !== 0) {
        e.preventDefault(); // Prevent vertical scroll
        animeGrid.scrollLeft += e.deltaY; // Scroll horizontally instead
    }
}, { passive: false });
  
const intro = document.querySelector('.anime-intro');
let petalInterval;

intro.addEventListener('mouseenter', () => {
    if (petalInterval) return; // Prevent multiple intervals
    petalInterval = setInterval(() => {
        const petal = document.createElement('span');
        petal.classList.add('petal');
        petal.style.top = '-20px';
        petal.style.left = `${Math.random() * 500}px`; // random horizontal spread within ~100px of top-left
        petal.style.transform = `rotate(${Math.random() * 360}deg)`; // random initial rotation
        petal.style.animationDuration = `${5 + Math.random() * 2}s`; // slow, gentle fall        
        intro.appendChild(petal);

        // Remove petal after its animation ends
        setTimeout(() => {
            petal.remove();
        }, 6000);
    }, 900); // controls how often petals spawn
});

intro.addEventListener('mouseleave', () => {
    clearInterval(petalInterval);
    petalInterval = null;
});