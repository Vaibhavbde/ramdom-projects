// Complete JavaScript for BhashaBandhu - Indian Language Exchange App

// ============================================
// STATE MANAGEMENT
// ============================================
let currentPage = 'discover';
let selectedChat = null;
let filteredUsers = [...users];
let favoriteUsers = [];
let currentUserProfile = { ...userProfile };

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 BhashaBandhu initialized!');
    
    initializeNavigation();
    initializeTheme();
    renderDiscoverPage();
    renderMessagesPage();
    renderSessionsPage();
    renderProfilePage();
    animateCounters();
    addStaggerAnimation();
    startBackgroundAnimations();
    
    // Show welcome toast after a delay
    setTimeout(() => {
        showToast('नमस्ते! Welcome to BhashaBandhu! 🙏', 4000);
    }, 1000);
    
    // Show random fact after 30 seconds
    setTimeout(showRandomFact, 30000);
});

// ============================================
// THEME & UI INITIALIZATION
// ============================================
function initializeTheme() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('bhasha-theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
}

// ============================================
// NAVIGATION SYSTEM
// ============================================
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMobile = document.querySelector('.nav-mobile');

    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
            
            // Close mobile menu
            if (navMobile) {
                navMobile.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
            }
            
            // Track navigation
            trackEvent('Navigation', 'Page Change', page);
        });
    });

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMobile.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
}

function navigateTo(page) {
    // Hide all pages with fade out
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.opacity = '0';
    });
    
    // Show selected page with fade in
    setTimeout(() => {
        const targetPage = document.getElementById(`${page}-page`);
        targetPage.classList.add('active');
        targetPage.style.opacity = '1';
        
        // Re-animate page-specific elements
        if (page === 'sessions') {
            animateCounters();
        }
        if (page === 'discover') {
            addStaggerAnimation();
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === page) {
            btn.classList.add('active');
        }
    });
    
    currentPage = page;
}

// ============================================
// ANIMATION UTILITIES
// ============================================
function addStaggerAnimation() {
    const elements = document.querySelectorAll('.user-card, .session-item, .card-hover, .chat-item');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateValue(counter, 0, target, 2000);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function startBackgroundAnimations() {
    // Parallax effect on mouse move
    let ticking = false;
    
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax(e);
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateParallax(e) {
    const circles = document.querySelectorAll('.decoration-circle');
    const mandalas = document.querySelectorAll('.decoration-mandala');
    
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 30;
        const xMove = x * speed;
        const yMove = y * speed;
        circle.style.transform = `translate(${xMove}px, ${yMove}px)`;
    });
    
    mandalas.forEach((mandala, index) => {
        const speed = (index + 1) * 15;
        const xMove = x * speed;
        const yMove = y * speed;
        const rotation = x * 180;
        mandala.style.transform = `translate(${xMove}px, ${yMove}px) rotate(${rotation}deg)`;
    });
}

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Play sound effect (if available)
    playNotificationSound();
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function playNotificationSound() {
    // Placeholder for notification sound
    // Can implement Web Audio API here
}

// ============================================
// DISCOVER PAGE FUNCTIONALITY
// ============================================
function renderDiscoverPage() {
    const usersGrid = document.getElementById('users-grid');
    const searchInput = document.getElementById('search-input');
    const languageFilter = document.getElementById('language-filter');
    const levelFilter = document.getElementById('level-filter');

    if (!usersGrid) return;

    // Initial render
    renderUsers();

    // Event listeners for filters
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterUsers, 300));
    }

    if (languageFilter) {
        languageFilter.addEventListener('change', filterUsers);
    }

    if (levelFilter) {
        levelFilter.addEventListener('change', filterUsers);
    }

    function renderUsers() {
        usersGrid.innerHTML = '';
        
        if (filteredUsers.length === 0) {
            usersGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                    <i class="fas fa-search" style="font-size: 4rem; color: var(--gray); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--dark-gray); margin-bottom: 0.5rem;">No learners found</h3>
                    <p style="color: var(--dark-gray);">Try adjusting your search filters</p>
                </div>
            `;
            return;
        }
        
        filteredUsers.forEach((user, index) => {
            const userCard = createUserCard(user);
            userCard.style.animationDelay = `${index * 0.08}s`;
            usersGrid.appendChild(userCard);
        });
    }

    function filterUsers() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const selectedLanguage = languageFilter?.value.toLowerCase() || 'all';
        const selectedLevel = levelFilter?.value || 'All Levels';

        filteredUsers = users.filter(user => {
            const matchesSearch = 
                user.name.toLowerCase().includes(searchTerm) || 
                user.city.toLowerCase().includes(searchTerm) ||
                user.state.toLowerCase().includes(searchTerm);
            
            const matchesLanguage = 
                selectedLanguage === 'all' || 
                user.native.toLowerCase() === selectedLanguage;
            
            const matchesLevel = 
                selectedLevel === 'All Levels' || 
                user.level === selectedLevel;
            
            return matchesSearch && matchesLanguage && matchesLevel;
        });

        renderUsers();
        
        // Show result count
        showToast(`Found ${filteredUsers.length} language partners 🎯`, 2000);
    }
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.setAttribute('data-user-id', user.id);
    
    const isFavorite = favoriteUsers.includes(user.id);
    
    card.innerHTML = `
        <div class="user-card-header">
            <div class="user-info">
                <div class="avatar ${user.online ? 'online' : ''}">${user.avatar}</div>
                <div>
                    <div class="user-name">${user.name}</div>
                    <div class="user-country">
                        <i class="fas fa-map-marker-alt"></i> ${user.city}, ${user.state}
                    </div>
                </div>
            </div>
            <button class="heart-btn ${isFavorite ? 'liked' : ''}" onclick="toggleLike(this, ${user.id})">
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
            </button>
        </div>
        
        <div class="user-details">
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-globe"></i> Native:</span>
                <span class="detail-value">${user.native}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-book"></i> Learning:</span>
                <span class="detail-value">${user.learning}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-chart-line"></i> Level:</span>
                <span class="badge-level ${
                    user.level === 'Intermediate' ? 'badge-intermediate' : 
                    user.level === 'Beginner' ? 'badge-beginner' : ''
                }">${user.level}</span>
            </div>
        </div>
        
        <div class="user-stats">
            <div class="rating">
                <i class="fas fa-star"></i>
                <span>${user.rating}</span>
            </div>
            <span class="sessions-count">${user.sessions} sessions</span>
        </div>
        
        <div class="user-actions">
            <button class="btn-primary" onclick="connectUser('${user.name}', ${user.id})">
                <i class="fas fa-handshake"></i> Connect
            </button>
            <button class="icon-btn" onclick="messageUser('${user.name}', ${user.userId})">
                <i class="fas fa-comment-dots"></i>
            </button>
        </div>
    `;

    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });

    return card;
}

// ============================================
// USER INTERACTION FUNCTIONS
// ============================================
window.toggleLike = function(btn, userId) {
    const icon = btn.querySelector('i');
    const isLiked = icon.classList.contains('fas');
    
    if (isLiked) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.classList.remove('liked');
        favoriteUsers = favoriteUsers.filter(id => id !== userId);
        showToast('Removed from favorites 💔', 2000);
    } else {
        icon.classList.add('fas');
        icon.classList.remove('far');
        btn.classList.add('liked');
        favoriteUsers.push(userId);
        showToast('Added to favorites! ❤️', 2000);
        
        // Trigger heart animation
        createHeartBurst(btn);
    }
    
    // Save to localStorage
    localStorage.setItem('bhasha-favorites', JSON.stringify(favoriteUsers));
};

function createHeartBurst(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart';
        heart.style.position = 'fixed';
        heart.style.left = rect.left + rect.width / 2 + 'px';
        heart.style.top = rect.top + rect.height / 2 + 'px';
        heart.style.color = '#E91E63';
        heart.style.fontSize = '1rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.animation = `heartBurst${i} 1s ease-out forwards`;
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 1000);
    }
}

window.connectUser = function(name, userId) {
    showToast(`🎉 Connection request sent to ${name}!`, 3000);
    
    // Simulate adding to messages
    setTimeout(() => {
        showToast(`${name} accepted your request! Start chatting! 💬`, 3000);
    }, 2000);
    
    trackEvent('User Action', 'Connect', name);
};

window.messageUser = function(name, userId) {
    navigateTo('messages');
    showToast(`Opening chat with ${name}... 💬`, 2000);
    trackEvent('User Action', 'Message', name);
};

// ============================================
// MESSAGES PAGE FUNCTIONALITY
// ============================================
function renderMessagesPage() {
    const chatListContent = document.getElementById('chat-list-content');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');

    if (!chatListContent) return;

    renderChatList();

    // Send message handlers
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Typing indicator
        messageInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                showTypingIndicator();
            }
        });
    }

    function renderChatList() {
        chatListContent.innerHTML = '';
        messages.forEach((msg, index) => {
            const chatItem = createChatItem(msg);
            chatItem.style.animationDelay = `${index * 0.05}s`;
            chatListContent.appendChild(chatItem);
        });
    }

    function sendMessage() {
        if (!messageInput || !selectedChat) return;
        
        const text = messageInput.value.trim();
        if (!text) return;

        const newMessage = {
            id: Date.now(),
            type: 'sent',
            text: text,
            time: new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };

        if (!chatMessages[selectedChat.userId]) {
            chatMessages[selectedChat.userId] = [];
        }
        chatMessages[selectedChat.userId].push(newMessage);

        renderChatMessages();
        messageInput.value = '';
        
        // Play send sound
        playMessageSound();
        
        // Auto-reply simulation
        setTimeout(() => simulateReply(), 2000);
    }
    
    function simulateReply() {
        if (!selectedChat) return;
        
        const replies = [
            "That's great! 😊",
            "I understand! Let's continue...",
            "Very good! Keep practicing!",
            "Excellent! 🎉",
            "Yes, exactly!"
        ];
        
        const reply = {
            id: Date.now(),
            type: 'received',
            text: replies[Math.floor(Math.random() * replies.length)],
            time: new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
        
        chatMessages[selectedChat.userId].push(reply);
        renderChatMessages();
    }
}

function createChatItem(msg) {
    const item = document.createElement('button');
    item.className = 'chat-item';
    if (selectedChat && selectedChat.id === msg.id) {
        item.classList.add('active');
    }
    
    item.innerHTML = `
        <div class="chat-item-content">
            <div class="avatar ${msg.online ? 'online' : ''}">${msg.avatar}</div>
            <div class="chat-item-info">
                <div class="chat-item-header">
                    <span class="chat-item-name">${msg.name}</span>
                    ${msg.unread > 0 ? `<span class="unread-badge">${msg.unread}</span>` : ''}
                </div>
                <div class="chat-item-message">${msg.lastMessage}</div>
                <div class="chat-item-time">${msg.time}</div>
            </div>
        </div>
    `;

    item.addEventListener('click', function() {
        selectChat(msg);
    });

    return item;
}

function selectChat(msg) {
    selectedChat = msg;
    
    // Update UI
    document.getElementById('chat-empty').style.display = 'none';
    document.getElementById('chat-active').style.display = 'flex';
    
    // Update chat header
    const chatAvatar = document.getElementById('chat-avatar');
    const chatName = document.getElementById('chat-name');
    
    chatAvatar.textContent = msg.avatar;
    chatAvatar.className = `avatar ${msg.online ? 'online' : ''}`;
    chatName.textContent = msg.name;
    
    // Update active state
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.chat-item').classList.add('active');
    
    // Mark as read
    msg.unread = 0;
    
    renderChatMessages();
    
    trackEvent('Messages', 'Chat Opened', msg.name);
}

function renderChatMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer || !selectedChat) return;
    
    const userMessages = chatMessages[selectedChat.userId] || [];
    
    messagesContainer.innerHTML = '';
    userMessages.forEach((msg, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.type}`;
        messageDiv.style.animationDelay = `${index * 0.05}s`;
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-text">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
    });
    
    // Smooth scroll to bottom
    setTimeout(() => {
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

function showTypingIndicator() {
    // Placeholder for typing indicator
}

function playMessageSound() {
    // Placeholder for message sound
}

// ============================================
// SESSIONS PAGE FUNCTIONALITY
// ============================================
function renderSessionsPage() {
    const sessionsList = document.getElementById('sessions-list');
    if (!sessionsList) return;
    
    sessionsList.innerHTML = '';
    
    if (upcomingSessions.length === 0) {
        sessionsList.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-calendar-times" style="font-size: 4rem; color: var(--gray); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--dark-gray); margin-bottom: 0.5rem;">No upcoming sessions</h3>
                <p style="color: var(--dark-gray);">Start connecting with language partners!</p>
                <button class="btn-primary" onclick="navigateTo('discover')" style="margin-top: 1rem;">
                    <i class="fas fa-search"></i> Find Partners
                </button>
            </div>
        `;
        return;
    }
    
    upcomingSessions.forEach((session, index) => {
        const sessionItem = createSessionItem(session);
        sessionItem.style.animationDelay = `${index * 0.1}s`;
        sessionsList.appendChild(sessionItem);
    });
}

function createSessionItem(session) {
    const item = document.createElement('div');
    item.className = 'session-item';
    
    item.innerHTML = `
        <div class="session-info">
            <div class="avatar">${session.partnerAvatar}</div>
            <div class="session-details">
                <h4>${session.partnerName}</h4>
                <p><i class="fas fa-language"></i> ${session.language}</p>
                <p><i class="fas fa-book-open"></i> ${session.topic}</p>
                <p><i class="fas fa-clock"></i> ${session.time} • ${session.duration}</p>
            </div>
        </div>
        <div class="session-actions">
            <button class="btn-primary" onclick="joinSession('${session.partnerName}', ${session.id})">
                <i class="fas fa-video"></i> Join
            </button>
            <button class="icon-btn" onclick="rescheduleSession('${session.partnerName}', ${session.id})">
                <i class="fas fa-calendar-alt"></i>
            </button>
        </div>
    `;

    return item;
}

window.joinSession = function(name, sessionId) {
    showToast(`🎬 Starting video session with ${name}...`, 2000);
    
    setTimeout(() => {
        showToast('📹 Session started! Enjoy your learning! 🎓', 3000);
    }, 2000);
    
    trackEvent('Sessions', 'Join', name);
};

window.rescheduleSession = function(name, sessionId) {
    showToast(`📅 Opening calendar to reschedule with ${name}...`, 2000);
    trackEvent('Sessions', 'Reschedule', name);
};

// ============================================
// PROFILE PAGE FUNCTIONALITY
// ============================================
function renderProfilePage() {
    const editBtn = document.querySelector('.btn-primary.btn-gradient');
    if (editBtn && !editBtn.hasAttribute('data-listener')) {
        editBtn.setAttribute('data-listener', 'true');
        editBtn.addEventListener('click', function() {
            showToast('✏️ Profile editing coming soon! ✨', 3000);
        });
    }
    
    const editAvatarBtn = document.querySelector('.btn-edit-avatar');
    if (editAvatarBtn && !editAvatarBtn.hasAttribute('data-listener')) {
        editAvatarBtn.setAttribute('data-listener', 'true');
        editAvatarBtn.addEventListener('click', function() {
            showToast('📸 Upload new profile picture...', 2000);
        });
    }
    
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        if (!tag.hasAttribute('data-listener')) {
            tag.setAttribute('data-listener', 'true');
            tag.addEventListener('click', function() {
                const interest = this.textContent.trim();
                showToast(`🔍 Finding partners interested in ${interest}...`, 2000);
            });
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showRandomFact() {
    if (currentPage === 'discover') {
        const fact = languageFacts[Math.floor(Math.random() * languageFacts.length)];
        showToast(`💡 ${fact}`, 6000);
    }
    
    // Schedule next fact
    setTimeout(showRandomFact, 45000);
}

function trackEvent(category, action, label) {
    console.log(`📊 Event: ${category} - ${action} - ${label}`);
    // Future: Send to analytics service
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', function(e) {
    // Alt + Number for quick navigation
    if (e.altKey && !e.shiftKey && !e.ctrlKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                navigateTo('discover');
                break;
            case '2':
                e.preventDefault();
                navigateTo('messages');
                break;
            case '3':
                e.preventDefault();
                navigateTo('sessions');
                break;
            case '4':
                e.preventDefault();
                navigateTo('profile');
                break;
        }
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        const navMobile = document.querySelector('.nav-mobile');
        if (navMobile && navMobile.classList.contains('active')) {
            navMobile.classList.remove('active');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
        }
    }
});

// ============================================
// RIPPLE EFFECT ON CLICKS
// ============================================
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary, .icon-btn, .nav-btn')) {
        const button = e.target.closest('button');
        createRipple(e, button);
    }
});

function createRipple(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-effect 0.6s ease-out;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes heartBurst0 { to { transform: translate(30px, -30px); opacity: 0; } }
    @keyframes heartBurst1 { to { transform: translate(-30px, -30px); opacity: 0; } }
    @keyframes heartBurst2 { to { transform: translate(30px, 30px); opacity: 0; } }
    @keyframes heartBurst3 { to { transform: translate(-30px, 30px); opacity: 0; } }
    @keyframes heartBurst4 { to { transform: translate(40px, 0); opacity: 0; } }
    @keyframes heartBurst5 { to { transform: translate(-40px, 0); opacity: 0; } }
    @keyframes heartBurst6 { to { transform: translate(0, 40px); opacity: 0; } }
    @keyframes heartBurst7 { to { transform: translate(0, -40px); opacity: 0; } }
`;
document.head.appendChild(style);

// ============================================
// LOAD SAVED DATA
// ============================================
window.addEventListener('load', function() {
    // Load favorites
    const saved = localStorage.getItem('bhasha-favorites');
    if (saved) {
        favoriteUsers = JSON.parse(saved);
    }
});

// ============================================
// EXPORT API
// ============================================
window.BhashaBandhu = {
    navigateTo,
    showToast,
    trackEvent,
    version: '1.0.0'
};

console.log('✨ BhashaBandhu v1.0.0 loaded successfully!');