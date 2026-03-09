// --- PRELOADER LOGIC (Runs first to ensure it never gets blocked) ---
const hidePreloader = () => {
    document.body.classList.add("loaded");
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('opacity-0');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
};

// Hide when DOM is ready or after a max 2.5s fallback to avoid infinite loading
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(hidePreloader, 500); // small delay for smoother transition
} else {
    window.addEventListener('DOMContentLoaded', hidePreloader);
    window.addEventListener('load', hidePreloader);
}
// Fallback in case loading is stuck
setTimeout(hidePreloader, 3000);
// -----------------------

// Fix scroll restoration on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
}

// DOM Elements
const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-panel');
const navbar = document.querySelector('.glass-nav');
const revealElements = document.querySelectorAll('.reveal');
const backToTopBtn = document.getElementById('back-to-top');
const yearSpan = document.getElementById('year');

// Set current year
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Glowing Cursor Logic
const domCursor = document.querySelector(".cursor");
const glow = document.querySelector(".cursor-glow");

if (domCursor && glow && window.matchMedia("(pointer: fine)").matches) {
    let cursorTicking = false;
    document.addEventListener("mousemove", (e) => {
        if (!cursorTicking) {
            window.requestAnimationFrame(() => {
                domCursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
                glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
                cursorTicking = false;
            });
            cursorTicking = true;
        }
    });

    // Hover styling is now handled entirely in style.css using width/height animations
    // and interactive ~ cursor-glow. We do not need to manipulate transform scale in JS.
} else {
    // Hide if mobile
    if(domCursor) domCursor.style.display = 'none';
    if(glow) glow.style.display = 'none';
    document.body.style.cursor = 'auto'; // allow default touch behavior
}
// Optimized Scroll Listener using requestAnimationFrame
let isScrolling = false;
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const winScroll = window.scrollY || document.documentElement.scrollTop;
            
            // Navbar Scroll Effect
            if (navbar) {
                if (winScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            // Back to Top Button
            if (backToTopBtn) {
                if (winScroll > 500) {
                    backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
                    backToTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
                } else {
                    backToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
                    backToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
                }
            }
            
            // Scroll Progress Bar
            if (progressBar) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = height > 0 ? (winScroll / height) : 0;
                progressBar.style.transform = `scaleX(${scrolled})`;
            }
            
            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

// Back to Top Click
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// === NEW ADVANCED LOGIC: GSAP, APIs === //

// 2. GSAP Advanced Scroll Reveals (replaces Intersection Observer)
// Ensure elements start hidden if using GSAP
if (typeof gsap !== 'undefined') {
    gsap.set('.reveal', { y: 50, opacity: 0 });

    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.batch(".reveal", {
            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }),
            once: true
        });
    }
}

// Re-init tilt on new items if VanillaTilt is available
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".project-card"), { max: 15, speed: 400, glare: true, "max-glare": 0.2 });
}

// 5. Render Articles
const blogGrid = document.getElementById('blog-grid');

const articles = [
    {
        title: "How I Built My Developer Portfolio",
        preview: "Building my personal portfolio website was an exciting journey. I wanted to create a modern and interactive platform where I could showcase my projects, skills, and development experience.",
        link: "javascript:void(0)",
        tag: "Web Development",
        readTime: "3 min read"
    },
    {
        title: "My Journey to Becoming a Frontend Developer",
        preview: "My journey into web development started with curiosity about how websites work. I began learning the fundamentals of the web such as HTML, CSS, and JavaScript.",
        link: "javascript:void(0)",
        tag: "Career",
        readTime: "3 min read"
    },
    {
        title: "Top Tools I Use as a Developer",
        preview: "Modern web development requires powerful tools that help developers work efficiently. Here are some of the tools I frequently use to design and build web applications.",
        link: "javascript:void(0)",
        tag: "Productivity",
        readTime: "2 min read"
    }
];

function renderArticles() {
    if (!blogGrid) return;
    
    blogGrid.innerHTML = ''; // clear loader
    
    articles.forEach((article, index) => {
        const delayNum = index * 100;
        const cardHTML = `
            <div class="glass-panel p-6 rounded-3xl group hover:-translate-y-2 transition-all duration-300 hover:border-purple-500/50 flex flex-col justify-between border border-transparent bg-[#0f0f0f] hover:border-[#7c3aed] article-card" style="opacity: 0; transform: translateY(30px);">
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">${article.tag}</span>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                            <span><i class="fa-regular fa-clock mr-1"></i>${article.readTime}</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-3 leading-tight">${article.title}</h3>
                    <p class="text-gray-400 text-sm leading-relaxed mb-6">
                        ${article.preview}
                    </p>
                </div>
                <button onclick="openArticle(${index})" class="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-purple-400 transition-colors mt-auto w-max px-4 py-2 rounded-lg border border-[#333] hover:bg-white/5 cursor-pointer">
                    Read More <i class="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1 transition-transform"></i>
                </button>
            </div>
        `;
        blogGrid.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    // Animate newly added article cards
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.batch(".article-card", {
            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }),
            once: true
        });
        ScrollTrigger.refresh();
    }
}

// Call fetch functions
renderArticles();

// Article Modal Viewer Logic
const articleModal = document.getElementById("articleModal");
const articleTitleEl = document.getElementById("articleTitle");
const articleContentEl = document.getElementById("articleContent");
const closeBtn = document.querySelector(".close-btn");

// Extended article content mapping for modals
const articleContents = [
    "Building my developer portfolio was an exciting journey that pushed me to combine design, performance, and modern web architecture into one engaging final product.\n\nI built this single-page application using modern frontend technologies like React, JavaScript, and Tailwind CSS to create a fully responsive and interactive dark-themed UI. The core motivation was to showcase my projects, skills, and professional experience in a dynamic way that stands out.\n\nKey features include:\n\n• Custom neon UI elements and a personalized glowing cursor.\n\n• GSAP scroll animations for smooth text and card reveals.\n\n• An interactive AI Chatbot companion built in JavaScript to guide visitors.\n\n• A fully responsive layout optimized for mobile, tablet, and desktop viewing.\n\nThis project taught me a lot about CSS modularity, DOM manipulation, JS animation performance, and UX optimization.",
    "My journey into web development started with a simple curiosity: How do websites actually work?\n\nI began learning the fundamentals of the web—HTML for structure, CSS for styling, and JavaScript for interactivity. As my understanding grew, I was drawn toward the logic and problem-solving required to build dynamic applications.\n\n• Step 1: Learning the syntax and building basic, static HTML/CSS clone sites.\n\n• Step 2: Grasping core programming concepts in JavaScript (variables, arrays, functions, DOM manipulation).\n\n• Step 3: Transitioning into modern frameworks like React and mastering component-based architecture.\n\n• Step 4: Connecting frontends to backend servers, handling APIs, and working with databases like MongoDB.\n\nEvery error message was a stepping stone, and nothing beats the feeling of bringing an idea from a wireframe to a fully functional, live website.",
    "Modern web development requires powerful tools that help developers build applications faster and more efficiently.\n\nHere are some of the tools I frequently use:\n\n• VS Code – My main code editor for writing and managing projects.\n\n• Git & GitHub – Used for version control and collaboration.\n\n• Chrome DevTools – Helps debug and optimize website performance.\n\n• Postman – Useful for testing APIs during backend development.\n\nThese tools help me build scalable, maintainable, and high-performance web applications."
];

window.openArticle = function(index) {
    if(!articleModal) return;
    
    const article = articles[index];
    
    articleModal.style.display = "flex";
    articleTitleEl.innerText = article.title;
    articleContentEl.innerText = articleContents[index];
    
    // Map Meta
    const dateEl = document.getElementById("articleDate");
    const timeEl = document.getElementById("articleReadTime");
    
    if (dateEl) {
        // Fallback or dynamic generation for dates since they were removed from the card UI
        const dummyDates = ["June 15, 2025", "May 22, 2025", "April 10, 2025"];
        dateEl.innerHTML = `<i class="fa-regular fa-calendar mr-1.5"></i> ${dummyDates[index]}`;
    }
    
    if (timeEl) {
        timeEl.innerHTML = `<i class="fa-regular fa-clock mr-1.5"></i> ${article.readTime}`;
    }
    
    // prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden'; 
}

if(closeBtn) {
    closeBtn.onclick = () => {
        if(articleModal) articleModal.style.display = "none";
        // restore scrolling
        document.body.style.overflow = ''; 
    };
}

// Close modal on outside click
if(articleModal) {
    articleModal.addEventListener('click', (e) => {
        if (e.target === articleModal) {
            articleModal.style.display = "none";
            document.body.style.overflow = '';
        }
    });
}

// ==========================================
// 8. Tech Stack Interactive Modal
// ==========================================
const techModal = document.getElementById('techModal');
// Using event delegation for the close button inside techModal
if (techModal) {
    techModal.addEventListener('click', (e) => {
        // If they click the background overlay OR the close button
        if (e.target === techModal || e.target.closest('.tech-close-btn')) {
            closeTechModal();
        }
    });
}

window.openTechModal = function(title, subtitle, desc, iconHtml, glowColor) {
    if (!techModal) return;
    
    document.getElementById('techModalTitle').textContent = title;
    document.getElementById('techModalSubtitle').textContent = subtitle;
    document.getElementById('techModalDesc').innerHTML = desc;
    
    const iconContainer = document.getElementById('techModalIconContainer');
    iconContainer.innerHTML = iconHtml;
    
    // Apply dynamic glow to the icon container based on the tech
    iconContainer.style.backgroundColor = 'rgba(255,255,255,0.05)';
    iconContainer.style.boxShadow = `0 0 20px ${glowColor}`;
    iconContainer.style.border = `1px solid ${glowColor.replace('0.2)', '0.5)')}`;
    
    // Show modal
    techModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

window.closeTechModal = function() {
    if (!techModal) return;
    techModal.style.display = 'none';
    document.body.style.overflow = '';
}

// ==========================================
// 9. Auto-Rotating Hero Taglines
// ==========================================
function initRotatingTaglines() {
    const taglinesContainer = document.getElementById('taglines');
    if (!taglinesContainer) return;

    taglinesContainer.innerHTML = ''; // Keep clean

    const phrases = [
        "\"Crafting&nbsp;<strong class='text-white font-medium italic'>modern, responsive</strong>&nbsp;web experiences.\"",
        "\"Building fast and scalable applications with&nbsp;<strong class='text-white font-medium italic'>React & Next.js</strong>.\"",
        "\"Turning ideas into&nbsp;<strong class='text-white font-medium italic'>clean and interactive</strong>&nbsp;user interfaces.\"",
        "\"Developing fast, responsive, and user-friendly interfaces.\""
    ];

    let currentIndex = 0;

    // Create an h3 for each phrase, all stacked absolutely
    phrases.forEach((phrase, index) => {
        const h3 = document.createElement('h3');
        // Initial state: first phrase is visible, others are hidden and moved down slightly
        h3.className = `text-xl md:text-2xl font-light text-gray-300 italic tracking-wider leading-relaxed absolute top-0 left-0 w-full transition-all duration-1000 ease-in-out flex justify-center items-center h-full ${index === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`;
        h3.innerHTML = phrase;
        taglinesContainer.appendChild(h3);
    });

    const taglineElements = taglinesContainer.querySelectorAll('h3');

    setInterval(() => {
        // Fade out current
        taglineElements[currentIndex].classList.remove('opacity-100', 'translate-y-0');
        taglineElements[currentIndex].classList.add('opacity-0', '-translate-y-4');

        // Move to next
        currentIndex = (currentIndex + 1) % phrases.length;

        // Reset the incoming one to starting position (bottom) immediately before fading in
        taglineElements[currentIndex].classList.remove('transition-all', 'duration-1000', '-translate-y-4');
        taglineElements[currentIndex].classList.add('translate-y-4');
        
        // Force reflow to apply the starting position instantly
        void taglineElements[currentIndex].offsetWidth; 

        // Add transitions back and animate in
        taglineElements[currentIndex].classList.add('transition-all', 'duration-1000');
        taglineElements[currentIndex].classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        taglineElements[currentIndex].classList.add('opacity-100', 'translate-y-0');

    }, 3500); // Change every 3.5 seconds
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initRotatingTaglines);


