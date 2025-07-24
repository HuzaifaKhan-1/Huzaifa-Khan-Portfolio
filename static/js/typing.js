// Typing animation system
class TypingEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            pauseTime: 2000,
            deleteDelay: 1000,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            ...options
        };
        
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.timeoutId = null;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        // Set initial content
        this.element.textContent = '';
        
        // Start typing animation
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            // Deleting characters
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                
                // Pause before typing next text
                this.timeoutId = setTimeout(() => this.type(), this.options.pauseTime);
                return;
            }
        } else {
            // Typing characters
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                if (this.options.loop && this.texts.length > 1) {
                    // Pause before deleting
                    this.timeoutId = setTimeout(() => {
                        this.isDeleting = true;
                        this.type();
                    }, this.options.deleteDelay);
                    return;
                } else if (!this.options.loop) {
                    // Stop if not looping
                    return;
                }
            }
        }
        
        // Continue typing/deleting
        const speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
        this.timeoutId = setTimeout(() => this.type(), speed);
    }
    
    pause() {
        this.isPaused = true;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    
    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.type();
        }
    }
    
    destroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    
    changeTexts(newTexts) {
        this.texts = Array.isArray(newTexts) ? newTexts : [newTexts];
        this.currentTextIndex = 0;
        this.restart();
    }
    
    restart() {
        this.destroy();
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.element.textContent = '';
        this.type();
    }
}

// Text scramble effect
class ScrambleText {
    constructor(element, finalText, options = {}) {
        this.element = element;
        this.finalText = finalText;
        this.options = {
            speed: 50,
            scrambleChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            revealDelay: 100,
            ...options
        };
        
        this.isAnimating = false;
        this.timeoutId = null;
        
        this.init();
    }
    
    init() {
        if (!this.element) return;
        this.scramble();
    }
    
    scramble() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const originalText = this.element.textContent;
        let iteration = 0;
        
        const animate = () => {
            this.element.textContent = this.finalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return this.finalText[index];
                    }
                    
                    if (char === ' ') return ' ';
                    
                    return this.options.scrambleChars[
                        Math.floor(Math.random() * this.options.scrambleChars.length)
                    ];
                })
                .join('');
            
            iteration += 1/3;
            
            if (iteration >= this.finalText.length) {
                this.element.textContent = this.finalText;
                this.isAnimating = false;
                return;
            }
            
            this.timeoutId = setTimeout(animate, this.options.speed);
        };
        
        animate();
    }
    
    destroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.isAnimating = false;
    }
}

// Typewriter effect with realistic typing
class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            speed: 100,
            deleteSpeed: 50,
            naturalVariance: 30,
            mistakeChance: 0.05,
            mistakeDelay: 200,
            correctionDelay: 100,
            ...options
        };
        
        this.queue = [];
        this.isTyping = false;
        this.timeoutId = null;
    }
    
    type(text, delay = 0) {
        this.queue.push({ action: 'type', text, delay });
        this.processQueue();
        return this;
    }
    
    delete(count = 1, delay = 0) {
        this.queue.push({ action: 'delete', count, delay });
        this.processQueue();
        return this;
    }
    
    pause(duration) {
        this.queue.push({ action: 'pause', duration });
        this.processQueue();
        return this;
    }
    
    clear(delay = 0) {
        this.queue.push({ action: 'clear', delay });
        this.processQueue();
        return this;
    }
    
    processQueue() {
        if (this.isTyping || this.queue.length === 0) return;
        
        this.isTyping = true;
        const item = this.queue.shift();
        
        setTimeout(() => {
            this.executeAction(item);
        }, item.delay || 0);
    }
    
    executeAction(item) {
        switch (item.action) {
            case 'type':
                this.typeText(item.text);
                break;
            case 'delete':
                this.deleteText(item.count);
                break;
            case 'pause':
                this.pauseTyping(item.duration);
                break;
            case 'clear':
                this.clearText();
                break;
        }
    }
    
    typeText(text) {
        let index = 0;
        
        const typeChar = () => {
            if (index >= text.length) {
                this.isTyping = false;
                this.processQueue();
                return;
            }
            
            const char = text[index];
            
            // Simulate typing mistakes
            if (Math.random() < this.options.mistakeChance && char !== ' ') {
                const mistakeChar = String.fromCharCode(char.charCodeAt(0) + (Math.random() < 0.5 ? 1 : -1));
                this.element.textContent += mistakeChar;
                
                setTimeout(() => {
                    this.element.textContent = this.element.textContent.slice(0, -1);
                    setTimeout(() => {
                        this.element.textContent += char;
                        index++;
                        this.scheduleNextChar(typeChar);
                    }, this.options.correctionDelay);
                }, this.options.mistakeDelay);
                return;
            }
            
            this.element.textContent += char;
            index++;
            this.scheduleNextChar(typeChar);
        };
        
        typeChar();
    }
    
    deleteText(count) {
        let deleted = 0;
        
        const deleteChar = () => {
            if (deleted >= count || this.element.textContent.length === 0) {
                this.isTyping = false;
                this.processQueue();
                return;
            }
            
            this.element.textContent = this.element.textContent.slice(0, -1);
            deleted++;
            
            setTimeout(deleteChar, this.getSpeed(this.options.deleteSpeed));
        };
        
        deleteChar();
    }
    
    pauseTyping(duration) {
        setTimeout(() => {
            this.isTyping = false;
            this.processQueue();
        }, duration);
    }
    
    clearText() {
        this.element.textContent = '';
        this.isTyping = false;
        this.processQueue();
    }
    
    scheduleNextChar(callback) {
        const speed = this.getSpeed(this.options.speed);
        this.timeoutId = setTimeout(callback, speed);
    }
    
    getSpeed(baseSpeed) {
        const variance = this.options.naturalVariance;
        return baseSpeed + (Math.random() * variance - variance / 2);
    }
    
    destroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.queue = [];
        this.isTyping = false;
    }
}

// Initialize typing effects
document.addEventListener('DOMContentLoaded', () => {
    // Main hero typing effect
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        const texts = [
            "Hi, I'm Huzaifa Kamaal Khan",
            "AI/ML Enthusiast",
            "Full-Stack Developer",
            "ISRO Hackathon Finalist",
            "Innovation Leader"
        ];
        
        new TypingEffect(typingElement, texts, {
            typeSpeed: 80,
            deleteSpeed: 40,
            pauseTime: 2000,
            deleteDelay: 1500,
            loop: true
        });
    }
    
    // Scramble effect for section titles
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.scrambled) {
                const text = entry.target.textContent;
                entry.target.dataset.scrambled = 'true';
                
                new ScrambleText(entry.target, text, {
                    speed: 30,
                    revealDelay: 50
                });
            }
        });
    }, observerOptions);
    
    // Observe section titles
    document.querySelectorAll('.section-title').forEach(title => {
        observer.observe(title);
    });
});

// Export for potential external use
window.TypingEffect = TypingEffect;
window.ScrambleText = ScrambleText;
window.Typewriter = Typewriter;
