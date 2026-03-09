// Chatbot Elements
const botAvatar = "./assets/images/rabbito.png";
const chatToggleBtn = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChatBtn = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const suggestionBtns = document.querySelectorAll('.chat-suggestion-btn');

// // State for Local Smart Assistant
let lastTopic = null;
let idleTimer = null;

const greetings = [
    "Hi! I'm Rabbitto 🐰\nYour AI guide to Esa's portfolio.\n\nWhat would you like to see?",
    "Hello there! 🐰 Need help exploring the portfolio?",
    "Hey! I'm Rabbitto! 🐰 I can show you Esa's projects, skills, or help you contact him! 🚀"
];

function randomGreeting() {
    return greetings[Math.floor(Math.random() * greetings.length)];
}

const idleMessage = "You might want to explore:\n\n🚀 Best Projects\n💻 Technical Skills\n📄 Download Resume\n📬 Contact Esa";

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        if (chatWindow.classList.contains('active')) {
            addBotMessage(idleMessage);
        }
    }, 15000); 
}

// Keyword Intents
const intents = [
    {
        keywords: ["project", "projects", "work", "portfolio", "built", "made", "best projects"],
        reply: "Sure! Let me show you Esa's best projects 🚀",
        action: () => {
            const projs = document.getElementById('projects');
            if (projs) projs.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('close-chat').click();
        },
        topic: "projects"
    },
    {
        keywords: ["best project", "featured", "latest", "recommend"],
        reply: "Esa's featured projects highlight modern UI and frontend interaction. I recommend starting there! 🚀",
        action: () => {
            const projs = document.getElementById('projects');
            if (projs) projs.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('close-chat').click();
        },
        topic: "projects"
    },
    {
        keywords: ["skills", "technology", "tech stack", "framework", "language", "technical skills", "tech"],
        reply: "Esa works with modern web technologies like HTML, CSS, JavaScript, React, Tailwind CSS and Next.js. 💻",
        action: () => {
            const skills = document.getElementById('skills');
            if (skills) skills.scrollIntoView({ behavior: 'smooth' });
        },
        topic: "skills"
    },
    {
        keywords: ["experience", "job", "work experience", "role"],
        reply: "Esa builds experience through modern frontend projects and UI experiments. He has worked as a Junior Executive and an Engineer Assistant! ✨",
        action: () => {
            const exp = document.getElementById('experience');
            if (exp) exp.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('close-chat').click();
        },
        topic: "experience"
    },
    {
        keywords: ["education", "school", "college", "degree"],
        reply: "**Higher Secondary Certificate (HSC)**\nGovt Bangla College, Dhaka (2023–2024)\n\n**Secondary School Certificate (SSC)**\nChiriakhana Botanical High School (2023)"
    },
    {
        keywords: ["contact", "email", "reach", "message", "contact esa", "hire"],
        reply: "You can easily reach Esa through the contact section 📬",
        action: () => {
            const contact = document.getElementById('contact');
            if (contact) contact.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('close-chat').click();
        }
    },
    {
        keywords: ["download cv", "resume", "cv", "download resume"],
        reply: "You can download Esa's resume here 📄",
        action: () => {
            window.open("esa_mia_resume.html", "_blank");
        }
    },
    {
        keywords: ["who limit", "about", "esa mia", "background", "bio", "who are you"],
        reply: "Esa is an aspiring frontend developer passionate about building modern UI and interactive web experiences. ✨"
    },
    {
        keywords: ["article", "blog", "articles"],
        reply: "Here are Esa's latest developer articles. Feel free to give them a read! 📝",
        action: () => {
            const blog = document.getElementById('blog');
            if (blog) blog.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('close-chat').click();
        }
    },
    {
        keywords: ["available for work", "looking for a job", "open to work", "freelance", "remote", "remote job"],
        reply: "Yes! Esa is open to remote frontend opportunities and collaborations.\n\nYou can contact him through the contact section! 🚀"
    },
    {
        keywords: ["hire you", "collaborate", "team"],
        reply: "Great choice! 😎\n\nEsa is open to collaboration. Let's build something amazing together!\nYou can contact Esa directly from the contact section."
    },
    {
        keywords: ["why should i hire you", "why hire you", "why hire"],
        reply: "Esa focuses on modern UI, clean code, and interactive web experiences using React.\n\nHe is passionate about creating smooth user experiences! 🚀"
    },
    {
        keywords: ["ui", "design", "interface"],
        reply: "Esa enjoys creating clean, modern, and engaging user interfaces! ✨"
    },
    {
        keywords: ["responsive", "mobile"],
        reply: "Absolutely! All projects are designed to be fully responsive for mobile and desktop."
    },
    {
        keywords: ["tools", "software"],
        reply: "Esa uses tools like VS Code, Git, GitHub and modern frontend frameworks like React and Next.js."
    },
    {
        keywords: ["react"],
        reply: "React is one of Esa's main frontend frameworks for building fast and interactive UIs."
    },
    {
        keywords: ["next", "next.js", "nextjs"],
        reply: "Next.js helps Esa build fast, SEO-friendly, and optimized web applications."
    },
    {
        keywords: ["goal", "future", "achievement"],
        reply: "Esa focuses on improving his skills every day, aiming to become an elite professional frontend developer. 🚀"
    },
    {
        keywords: ["github", "code"],
        reply: "You can check out all the source code on Esa's GitHub profile. Link is in the hero section! 💻"
    },
    {
        keywords: ["rabbitto", "are you ai"],
        reply: "I'm a smart portfolio assistant built to guide visitors! 🤖\nI can show you around Esa's work."
    },
    {
        keywords: ["tour"],
        reply: "Welcome to Esa's portfolio! 🚀\nFirst, let's check out the projects section to see his work.",
        action: () => {
            setTimeout(() => {
                const projs = document.getElementById('projects');
                if (projs) projs.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('close-chat').click();
            }, 800);
        }
    },
    
    // --- 🎮 EASTER EGGS ---
    {
        keywords: ["who is feroz", "feroz"],
        reply: "Feroz is a vondo amette 😄"
    },
    {
        keywords: ["what"],
        reply: "Faaaahh 😆"
    },
    {
        keywords: ["tell me a joke", "dev joke"],
        reply: "Why do developers love dark mode? Because light attracts bugs 🐛😆"
    },
    {
        keywords: ["who made you", "who created you"],
        reply: "I was created by Esa, a frontend developer building cool web experiences 🚀"
    },
    {
        keywords: ["rabbitto secret"],
        reply: "🐰 Secret unlocked! You're officially a Rabbitto explorer."
    },
    {
        keywords: ["coffee", "need coffee"],
        reply: "Developers run on coffee ☕ and JavaScript."
    },
    {
        keywords: ["i hate bugs", "debugging"],
        reply: "Debugging: being the detective in a crime movie where you are also the criminal 🔍😆"
    },
    {
        keywords: ["are you ai", "are you real"],
        reply: "I'm Rabbitto 🐰, a smart portfolio assistant here to guide you."
    },
    {
        keywords: ["hire you", "i want to hire you"],
        reply: "Great choice 😎 Let's build something amazing together! Check the contact section."
    },
    {
        keywords: ["motivate me", "developer motivation"],
        reply: "Every great developer started with 'Hello World' 💻🚀"
    },
    {
        keywords: ["rabbitto power"],
        reply: "🐰 Rabbitto power activated! Now exploring portfolio at maximum speed ⚡"
    },
    {
        keywords: ["hi", "hello", "hey", "greetings", "start"],
        reply: () => randomGreeting()
    }
];

// Toggle Chat Window
function toggleChat() {
    chatWindow.classList.toggle('active');
    // Swap icon states on toggle visually
    const icons = chatToggleBtn.querySelectorAll('i');
    icons.forEach(i => i.classList.toggle('hidden'));
    icons.forEach(i => i.classList.toggle('group-hover:block'));
    icons.forEach(i => i.classList.toggle('group-hover:hidden'));
    
    if (chatWindow.classList.contains('active')) {
        resetIdleTimer();
    } else {
        clearTimeout(idleTimer);
    }
}

chatToggleBtn.addEventListener('click', toggleChat);
closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    // Restore button icon
    const iconOpen = chatToggleBtn.querySelector('.fa-comment-dots');
    const iconClose = chatToggleBtn.querySelector('.fa-xmark');
    
    iconOpen.classList.remove('hidden');
    iconOpen.classList.add('group-hover:hidden');
    
    iconClose.classList.add('hidden');
    iconClose.classList.add('group-hover:block');
    
    clearTimeout(idleTimer);
});

// Auto Scroll to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add User Message
function addUserMessage(text) {
    const msgHTML = `
        <div class="flex gap-3 max-w-[85%] self-end ms-auto">
            <div class="bg-purple-600 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white shadow-sm">
                <p>${text}</p>
            </div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
}

// Add Bot Message with typing effect simulation
function addBotMessage(text, postAction = null) {
    // Show typing indicator
    const typingID = 'typing-' + Date.now();
    const typingHTML = `
        <div id="${typingID}" class="flex gap-3 max-w-[85%]">
            <div class="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center border border-purple-500/50 mt-1 overflow-hidden">
                <img src="${botAvatar}" alt="Rabbito" loading="lazy" class="w-full h-full object-cover">
            </div>
            <div class="bg-surface border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 flex flex-col justify-center min-h-[40px]">
                <p class="text-[10px] text-purple-400 mb-1 leading-none">Rabbitto is typing...</p>
                <div class="typing-indicator flex items-center">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.insertAdjacentHTML('beforeend', typingHTML);
    scrollToBottom();

    // Replace typing indicator with actual text after delay
    setTimeout(() => {
        const typingElement = document.getElementById(typingID);
        if(typingElement) typingElement.remove();

        // Convert simple markdown bold and newlines to HTML
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>');
        formattedText = formattedText.replace(/\n/g, '<br>');

        const msgHTML = `
            <div class="flex gap-3 max-w-[85%] animate-[fadeIn_0.3s_ease-out]">
                <div class="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center border border-purple-500/50 mt-1 overflow-hidden">
                    <img src="${botAvatar}" alt="Rabbito" loading="lazy" class="w-full h-full object-cover">
                </div>
                <div class="bg-surface border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-300 overflow-wrap-anywhere">
                    <p class="leading-relaxed whitespace-pre-line">${formattedText}</p>
                </div>
            </div>
        `;
        chatMessages.insertAdjacentHTML('beforeend', msgHTML);
        scrollToBottom();
        
        if (postAction) {
            setTimeout(postAction, 800);
        }
    }, 800); // Fixed 800ms delay for consistent AI feel
}

// AI logic processing
function processInput(input) {
    resetIdleTimer();
    let message = input.toLowerCase();

    // Conversation Memory Feature
    if (lastTopic === "projects" && (message.includes("more") || message.includes("show me") || message.includes("detail"))) {
        let reply = "Here's a featured project:\n\n🚀 **AeroSaaS Landing Page**\nTech: HTML, CSS, JavaScript\n<a href='https://github.com/MD-ESA-MIA' target='_blank' class='bot-link'>[Live Demo]</a>  <a href='https://github.com/MD-ESA-MIA' target='_blank' class='bot-link'>[GitHub]</a>";
        addBotMessage(reply);
        lastTopic = null; // reset
        return;
    }

    // Match Keywords
    for (const intent of intents) {
        for (const word of intent.keywords) {
            if (message.includes(word)) {
                if (intent.topic) lastTopic = intent.topic;
                
                let replyText = typeof intent.reply === 'function' ? intent.reply() : intent.reply;
                addBotMessage(replyText, intent.action);
                return;
            }
        }
    }

    // Fallback logic
    addBotMessage("I'm Rabbitto 🐰.\nAsk me about projects, skills, or contact info!");
}

// Handle Form Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    
    // 1. Show user msg
    addUserMessage(text);
    
    // 2. Clear input
    chatInput.value = '';
    
    // 3. Process logic and respond
    processInput(text);
});

// Handle Quick Suggestions
suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.textContent;
        addUserMessage(text);
        processInput(text);
    });
});
