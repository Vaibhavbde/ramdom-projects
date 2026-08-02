class FriendshipGreetingApp {
    constructor() {
        this.currentEffect = null;
        this.currentStyle = 'classic';
        this.currentAnimation = null;
        this.uploadedFiles = [];
        this.effectInterval = null;
        this.currentGreetingId = null;
        this.quotes = [
            "Friendship is born at that moment when one person says to another, 'What! You too?'",
            "A real friend is one who walks in when the rest of the world walks out.",
            "Friends are the family you choose."
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startDefaultEffect();
        this.checkForSharedGreeting();
    }

    generateGreetingId() {
        return 'greeting_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    saveGreeting(greetingData) {
        const greetingId = this.generateGreetingId();
        const greetings = JSON.parse(localStorage.getItem('friendshipGreetings') || '{}');
        greetings[greetingId] = {
            ...greetingData,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('friendshipGreetings', JSON.stringify(greetings));
        return greetingId;
    }

    loadGreeting(greetingId) {
        const greetings = JSON.parse(localStorage.getItem('friendshipGreetings') || '{}');
        return greetings[greetingId] || null;
    }

    checkForSharedGreeting() {
        const urlParams = new URLSearchParams(window.location.search);
        const greetingId = urlParams.get('greeting');
        
        if (greetingId) {
            const greetingData = this.loadGreeting(greetingId);
            if (greetingData) {
                this.loadGreetingFromData(greetingData);
                this.currentGreetingId = greetingId;
                
                // Hide unnecessary elements for shared view
                document.querySelector('.header').style.display = 'none';
                document.querySelector('.form-section').style.display = 'none';
                document.querySelector('.footer').style.display = 'none';
                
                // Style the preview section for shared view
                document.querySelector('.preview-section').style.width = '100%';
                document.querySelector('.preview-section').style.maxWidth = '600px';
                document.querySelector('.preview-section').style.margin = '0 auto';
                document.querySelector('.main-content').style.gridTemplateColumns = '1fr';
                document.querySelector('.main-content').style.justifyContent = 'center';
                document.querySelector('.main-content').style.minHeight = '100vh';
                document.querySelector('.main-content').style.alignItems = 'center';
                document.querySelector('.main-content').style.display = 'flex';
                
                // Style the container for better centering
                document.querySelector('.container').style.padding = '20px';
                document.querySelector('.container').style.minHeight = '100vh';
                document.querySelector('.container').style.display = 'flex';
                document.querySelector('.container').style.alignItems = 'center';
                document.querySelector('.container').style.justifyContent = 'center';
                
                // Hide unnecessary action buttons in shared view
                document.getElementById('resetBtn').style.display = 'none';
                document.getElementById('downloadBtn').style.display = 'none';
                document.getElementById('shareBtn').style.display = 'none';
                
                // Add a "Create Your Own" button
                this.addCreateOwnButton();
                
                // Show notification about shared greeting
                this.showNotification('You are viewing a shared greeting! Create your own below.', 'info');
            } else {
                // If greeting data not found, show error and redirect
                this.showNotification('Greeting not found. Redirecting to create a new one...', 'error');
                setTimeout(() => {
                    window.location.href = window.location.origin + window.location.pathname;
                }, 3000);
            }
        }
    }

    loadGreetingFromData(data) {
        // Update form fields
        document.getElementById('friendName').value = data.friendName || '';
        document.getElementById('memories').value = data.memories || '';
        document.getElementById('message').value = data.message || '';
        
        // Set effects and styles
        this.currentEffect = data.effect || 'hearts';
        this.currentStyle = data.style || 'classic';
        this.currentAnimation = data.animation || 'bounce';
        
        // Update the greeting display
        this.updateFriendName(data.friendName || '');
        this.updateMemories(data.memories || '');
        this.updateMessage(data.message || '');
        this.setEffect(this.currentEffect);
        this.setStyle(this.currentStyle);
        this.setAnimation(this.currentAnimation);
        
        // Handle uploaded files if any
        if (data.uploadedFiles && data.uploadedFiles.length > 0) {
            // Restore uploaded media in shared greetings
            const mediaContainer = document.getElementById('mediaContainer');
            mediaContainer.innerHTML = '<div class="media-grid"></div>';
            
            data.uploadedFiles.forEach(fileData => {
                const mediaItem = document.createElement('div');
                mediaItem.className = 'media-item';
                
                if (fileData.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = fileData.isLocal ? fileData.data : fileData.url;
                    img.alt = 'Uploaded image';
                    img.style.width = '100%';
                    img.style.height = '200px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '8px';
                    mediaItem.appendChild(img);
                } else if (fileData.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = fileData.data;
                    video.controls = true;
                    video.style.width = '100%';
                    video.style.height = '200px';
                    video.style.objectFit = 'cover';
                    video.style.borderRadius = '8px';
                    mediaItem.appendChild(video);
                }
                
                mediaContainer.querySelector('.media-grid').appendChild(mediaItem);
            });
        }
    }

    addCreateOwnButton() {
        // Check if button already exists
        if (document.getElementById('createOwnBtn')) return;
        
        const actionButtons = document.querySelector('.action-buttons');
        const createOwnBtn = document.createElement('button');
        createOwnBtn.id = 'createOwnBtn';
        createOwnBtn.className = 'create-own-btn';
        createOwnBtn.innerHTML = '<i class="fas fa-magic"></i> Create Your Own Greeting';
        
        // Enhanced styling for full width and animations
        createOwnBtn.style.cssText = `
            width: 100%;
            padding: 18px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 15px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            animation: pulseGlow 2s infinite;
            margin-top: 20px;
            position: relative;
            overflow: hidden;
        `;
        
        // Add hover effects
        createOwnBtn.addEventListener('mouseenter', () => {
            createOwnBtn.style.transform = 'translateY(-3px) scale(1.02)';
            createOwnBtn.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
        });
        
        createOwnBtn.addEventListener('mouseleave', () => {
            createOwnBtn.style.transform = 'translateY(0) scale(1)';
            createOwnBtn.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
        });
        
        createOwnBtn.addEventListener('click', () => {
            // Add click animation
            createOwnBtn.style.transform = 'scale(0.98)';
            setTimeout(() => {
                createOwnBtn.style.transform = 'scale(1)';
            }, 150);
            
            // Remove the greeting parameter from URL and reload
            const url = new URL(window.location);
            url.searchParams.delete('greeting');
            window.location.href = url.toString();
        });
        
        actionButtons.appendChild(createOwnBtn);
    }

    bindEvents() {
        // Form inputs
        document.getElementById('friendName').addEventListener('input', (e) => {
            this.updateFriendName(e.target.value);
        });

        document.getElementById('memories').addEventListener('input', (e) => {
            this.updateMemories(e.target.value);
        });

        document.getElementById('message').addEventListener('input', (e) => {
            this.updateMessage(e.target.value);
        });

        document.getElementById('photoUpload').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Effect buttons
        document.querySelectorAll('.effect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setEffect(e.target.dataset.effect);
                this.setActiveButton(e.target, '.effect-btn');
            });
        });

        // Style buttons
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setStyle(e.target.dataset.style);
                this.setActiveButton(e.target, '.style-btn');
            });
        });

        // Animation buttons
        document.querySelectorAll('.animation-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setAnimation(e.target.dataset.animation);
                this.setActiveButton(e.target, '.animation-btn');
            });
        });

        // Action buttons
        document.getElementById('createGreeting').addEventListener('click', () => {
            this.createGreeting();
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadCard();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareGreeting();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetForm();
        });
    }

    setActiveButton(clickedBtn, selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });
        clickedBtn.classList.add('active');
    }

    updateFriendName(name) {
        const displayName = document.getElementById('displayName');
        displayName.textContent = name || "Your Friend's Name";
        
        if (this.currentAnimation) {
            this.applyTextAnimation(displayName, this.currentAnimation);
        }
    }

    updateMemories(memories) {
        const displayMemories = document.getElementById('displayMemories');
        const p = displayMemories.querySelector('p');
        p.textContent = memories || "Your memories will appear here...";
    }

    updateMessage(message) {
        const displayMessage = document.getElementById('displayMessage');
        const p = displayMessage.querySelector('p');
        p.textContent = message || "Your message will appear here...";
    }

    async handleFileUpload(files) {
        const uploadPreview = document.getElementById('uploadPreview');
        const mediaContainer = document.getElementById('mediaContainer');
        
        uploadPreview.innerHTML = '';
        mediaContainer.innerHTML = '';
        this.uploadedFiles = [];

        if (files.length === 0) {
            mediaContainer.innerHTML = `
                <div class="placeholder-media">
                    <i class="fas fa-images"></i>
                    <p>Photos/Videos will appear here</p>
                </div>
            `;
            return;
        }

        // Show uploading notification
        this.showNotification('Uploading images... 📤', 'info');

        for (let index = 0; index < Math.min(files.length, 6); index++) {
            const file = files[index];
            const isVideo = file.type.startsWith('video/');
            
            if (isVideo) {
                // For videos, store locally (ImgBB doesn't support videos)
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileData = {
                        name: file.name,
                        type: file.type,
                        data: e.target.result,
                        isLocal: true
                    };
                    this.uploadedFiles.push(fileData);
                    
                    // Preview in form
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `<video src="${e.target.result}" controls></video>`;
                    uploadPreview.appendChild(previewItem);
                    
                    // Display in card
                    if (index === 0) {
                        mediaContainer.innerHTML = '<div class="media-grid"></div>';
                    }
                    
                    const mediaItem = document.createElement('div');
                    mediaItem.className = 'media-item';
                    mediaItem.innerHTML = `<video src="${e.target.result}" controls></video>`;
                    
                    mediaContainer.querySelector('.media-grid').appendChild(mediaItem);
                };
                reader.readAsDataURL(file);
            } else {
                // For images, upload to ImgBB
                try {
                    const hostedUrl = await this.uploadToImgBB(file);
                    const fileData = {
                        name: file.name,
                        type: file.type,
                        url: hostedUrl,
                        isLocal: false
                    };
                    this.uploadedFiles.push(fileData);
                    
                    // Preview in form
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `<img src="${hostedUrl}" alt="Preview">`;
                    uploadPreview.appendChild(previewItem);
                    
                    // Display in card
                    if (index === 0) {
                        mediaContainer.innerHTML = '<div class="media-grid"></div>';
                    }
                    
                    const mediaItem = document.createElement('div');
                    mediaItem.className = 'media-item';
                    mediaItem.innerHTML = `<img src="${hostedUrl}" alt="Memory">`;
                    
                    mediaContainer.querySelector('.media-grid').appendChild(mediaItem);
                } catch (error) {
                    console.error('Failed to upload image:', error);
                    this.showNotification('Failed to upload image. Please try again.', 'error');
                }
            }
        }
        
        if (this.uploadedFiles.length > 0) {
            this.showNotification('Images uploaded successfully! 🎉', 'success');
        }
    }

    setEffect(effect) {
        this.currentEffect = effect;
        this.clearEffects();
        
        if (this.effectInterval) {
            clearInterval(this.effectInterval);
        }
        
        switch (effect) {
            case 'hearts':
                this.createFloatingHearts();
                break;
            case 'sparkles':
                this.createSparkles();
                break;
            case 'confetti':
                this.createConfetti();
                break;
            case 'bubbles':
                this.createBubbles();
                break;
        }
    }

    setStyle(style) {
        const cardBackground = document.getElementById('cardBackground');
        
        // Remove all style classes
        cardBackground.classList.remove('classic-style', 'modern-style', 'vintage-style', 'neon-style');
        
        // Add new style class
        cardBackground.classList.add(`${style}-style`);
        this.currentStyle = style;
    }

    setAnimation(animation) {
        this.currentAnimation = animation;
        const friendName = document.getElementById('displayName');
        this.applyTextAnimation(friendName, animation);
    }

    applyTextAnimation(element, animation) {
        // Remove all animation classes
        element.classList.remove('bounce-animation', 'glow-animation', 'rainbow-animation', 'typewriter-animation');
        
        // Add new animation class
        if (animation) {
            element.classList.add(`${animation}-animation`);
        }
    }

    createFloatingHearts() {
        this.effectInterval = setInterval(() => {
            this.createFloatingElement('💕', 'heart');
        }, 800);
    }

    createSparkles() {
        this.effectInterval = setInterval(() => {
            this.createFloatingElement('✨', 'sparkle');
        }, 600);
    }

    createConfetti() {
        this.effectInterval = setInterval(() => {
            const colors = ['#ff6b9d', '#667eea', '#ffd700', '#00ff88', '#ff4757'];
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            document.getElementById('effectsContainer').appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, 300);
    }

    createBubbles() {
        this.effectInterval = setInterval(() => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.width = bubble.style.height = (Math.random() * 30 + 10) + 'px';
            bubble.style.animationDelay = Math.random() * 2 + 's';
            
            document.getElementById('effectsContainer').appendChild(bubble);
            
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                }
            }, 4000);
        }, 1000);
    }

    createFloatingElement(emoji, className) {
        const element = document.createElement('div');
        element.className = className;
        element.textContent = emoji;
        element.style.left = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 2 + 's';
        
        document.getElementById('effectsContainer').appendChild(element);
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 6000);
    }

    clearEffects() {
        const effectsContainer = document.getElementById('effectsContainer');
        effectsContainer.innerHTML = '';
    }

    startDefaultEffect() {
        // Start with floating hearts by default
        setTimeout(() => {
            this.setEffect('hearts');
            document.querySelector('[data-effect="hearts"]').classList.add('active');
        }, 1000);
    }

    createGreeting() {
        const friendName = document.getElementById('friendName').value;
        const memories = document.getElementById('memories').value;
        const message = document.getElementById('message').value;
        
        if (!friendName.trim()) {
            this.showNotification('Please enter your friend\'s name! 👤', 'error');
            return;
        }
        
        // Save greeting data
        const greetingData = {
            friendName: friendName,
            memories: memories,
            message: message,
            effect: this.currentEffect,
            style: this.currentStyle,
            animation: this.currentAnimation,
            uploadedFiles: this.uploadedFiles
        };
        
        this.currentGreetingId = this.saveGreeting(greetingData);
        
        this.updateFriendName(friendName);
        this.updateMemories(memories);
        this.updateMessage(message);
        
        // Add a special creation animation
        const greetingCard = document.getElementById('greetingCard');
        greetingCard.style.transform = 'scale(0.95)';
        greetingCard.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            greetingCard.style.transform = 'scale(1)';
            this.showNotification('Beautiful greeting created! 🎉 Ready to share!', 'success');
        }, 300);
        
        // Add some extra sparkle effect
        this.createCelebrationEffect();
    }

    createCelebrationEffect() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFloatingElement('🎉', 'sparkle');
            }, i * 100);
        }
    }

    async downloadCard() {
        try {
            const greetingCard = document.getElementById('greetingCard');
            
            // Show loading notification
            this.showNotification('Generating your greeting card...', 'info');
            
            // Configure html2canvas options
            const canvas = await html2canvas(greetingCard, {
                backgroundColor: null,
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: greetingCard.offsetWidth,
                height: greetingCard.offsetHeight
            });
            
            // Create download link
            const link = document.createElement('a');
            link.download = `friendship-greeting-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Greeting card downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            this.showNotification('Failed to download greeting card. Please try again.', 'error');
        }
    }

    shareGreeting() {
        if (!this.currentGreetingId) {
            this.showNotification('Please create a greeting first!', 'warning');
            return;
        }
        
        const shareUrl = `${window.location.origin}${window.location.pathname}?greeting=${this.currentGreetingId}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Friendship Day Greeting',
                text: 'Check out this beautiful friendship day greeting I created!',
                url: shareUrl
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showNotification('Greeting link copied to clipboard! Share it with your friends! 📋', 'success');
            }).catch(() => {
                this.showNotification('Failed to copy link. Please try again.', 'error');
            });
        }
    }

    resetForm() {
        // Reset form inputs
        document.getElementById('friendName').value = '';
        document.getElementById('memories').value = '';
        document.getElementById('message').value = '';
        document.getElementById('photoUpload').value = '';
        
        // Reset displays
        this.updateFriendName('');
        this.updateMemories('');
        this.updateMessage('');
        this.handleFileUpload([]);
        
        // Reset effects and styles
        this.clearEffects();
        this.setStyle('classic');
        this.setAnimation(null);
        
        // Reset active buttons
        document.querySelectorAll('.effect-btn, .style-btn, .animation-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Restart default effect
        this.startDefaultEffect();
        
        this.showNotification('Form reset successfully! 🔄', 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: '#fff',
            padding: '15px 20px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }

    async uploadToImgBB(file) {
        const apiKey = '0ee3a371cdad624b9a1bacb8dc3c1696';
        
        // Compress image if it's too large to maintain quality
        const compressedFile = await this.compressImage(file);
        
        const formData = new FormData();
        formData.append('key', apiKey);
        formData.append('image', compressedFile);
        formData.append('expiration', '15552000'); // 6 months in seconds
        
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload to ImgBB');
        }
        
        const data = await response.json();
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error('ImgBB upload failed');
        }
    }
    
    async compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.9) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FriendshipGreetingApp();
});

// Add some extra interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const greetingCard = document.getElementById('greetingCard');
    
    greetingCard.addEventListener('mouseenter', () => {
        greetingCard.style.transform = 'scale(1.02) rotateY(5deg)';
        greetingCard.style.transition = 'transform 0.3s ease';
    });
    
    greetingCard.addEventListener('mouseleave', () => {
        greetingCard.style.transform = 'scale(1) rotateY(0deg)';
    });
    
    // Add typing sound effect simulation
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('input', () => {
            // In a real app, you could play a typing sound here
            input.style.transform = 'scale(1.01)';
            setTimeout(() => {
                input.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Add random friendship quotes
    const quotes = [
        "Friendship is the only cement that will ever hold the world together. 💕",
        "A real friend is one who walks in when the rest of the world walks out. 🌟",
        "Friends are the family you choose. 👨‍👩‍👧‍👦",
        "Good friends are like stars. You don't always see them, but you know they're there. ⭐",
        "Friendship is born at that moment when one person says to another, 'What! You too?' 🤝",
        "A friend is someone who knows all about you and still loves you. ❤️"
    ];
    
    // Change quote every 10 seconds
    const quoteElement = document.querySelector('.friendship-quote');
    if (quoteElement) {
        let quoteIndex = 0;
        
        setInterval(() => {
            quoteIndex = (quoteIndex + 1) % quotes.length;
            quoteElement.style.opacity = '0';
            setTimeout(() => {
                quoteElement.textContent = quotes[quoteIndex];
                quoteElement.style.opacity = '1';
            }, 300);
        }, 10000);
    }
});