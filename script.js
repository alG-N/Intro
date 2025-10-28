const facts = [
    "🖌️ Digital artist & pixel doodler",
    "📚 Huge-reader of light novels",
    "🤖 Creator of the FumoBOT",
    "🎧 Has an entire playlist of JP bangers",
    "🎲 RNG master — luck is my strategy"
];

const factsList = document.getElementById('facts-list');

// Animate facts list with staggered delays
facts.forEach((fact, index) => {
    const li = document.createElement('li');
    li.textContent = fact;
    li.style.animation = `fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
    li.style.animationDelay = `${0.7 + index * 0.15}s`;
    factsList.appendChild(li);
});

// Smooth page navigation with fade effect
function navigateTo(pageId) {
    const currentPage = document.querySelector('.container:not(.hidden)');
    const targetPage = document.getElementById(pageId);
    
    if (!targetPage || currentPage === targetPage) return;
    
    // Fade out current page
    currentPage.style.opacity = '0';
    currentPage.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        // Hide current page
        currentPage.classList.add('hidden');
        currentPage.style.opacity = '';
        currentPage.style.transform = '';
        
        // Show target page with fade in
        targetPage.classList.remove('hidden');
        targetPage.style.opacity = '0';
        targetPage.style.transform = 'translateY(20px)';
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Trigger fade in animation
        requestAnimationFrame(() => {
            targetPage.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            targetPage.style.opacity = '1';
            targetPage.style.transform = 'translateY(0)';
        });
        
        // Clean up transition
        setTimeout(() => {
            targetPage.style.transition = '';
        }, 500);
    }, 300);
}

// Horizontal scroll for anime grid with mouse wheel
const animeGrid = document.querySelector('.anime-grid');

if (animeGrid) {
    animeGrid.addEventListener('wheel', function (e) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            // Smooth horizontal scroll
            animeGrid.scrollBy({
                left: e.deltaY,
                behavior: 'smooth'
            });
        }
    }, { passive: false });
}

// Cherry blossom petal effect for anime intro
const intro = document.querySelector('.anime-intro');
let petalInterval;

if (intro) {
    intro.addEventListener('mouseenter', () => {
        if (petalInterval) return;
        
        petalInterval = setInterval(() => {
            const petal = document.createElement('span');
            petal.classList.add('petal');
            petal.style.top = '-20px';
            petal.style.left = `${Math.random() * intro.offsetWidth}px`;
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;
            petal.style.animationDuration = `${5 + Math.random() * 2}s`;
            petal.style.animationDelay = `${Math.random() * 0.5}s`;
            
            intro.appendChild(petal);

            // Remove petal after animation
            setTimeout(() => {
                petal.remove();
            }, 7000);
        }, 600);
    });

    intro.addEventListener('mouseleave', () => {
        clearInterval(petalInterval);
        petalInterval = null;
    });
}

// Add parallax effect to alterGolden images on mouse move
const alterGolden = document.getElementById('alterGolden');
const alterGolden2 = document.getElementById('alterGolden2');

if (alterGolden && alterGolden2) {
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
        
        alterGolden.style.transform = `translate(${moveX}px, ${moveY}px)`;
        alterGolden2.style.transform = `translate(${-moveX}px, ${moveY}px)`;
    });
}

// Add smooth reveal animation for game cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all game cards
document.querySelectorAll('.game-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
});

// Observe anime cards
document.querySelectorAll('.anime-banner-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);