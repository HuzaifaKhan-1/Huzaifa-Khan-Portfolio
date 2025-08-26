// Enhanced Particle System with Project Card Interactions
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, isMoving: false };
        this.projectCards = [];
        this.resize();
        this.init();
        this.initProjectCardEffects();

        // Mouse tracking
        canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.isMoving = true;

            setTimeout(() => {
                this.mouse.isMoving = false;
            }, 100);
        });

        // Window resize handler
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const particleCount = Math.min(150, window.innerWidth / 10);

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                originalSize: Math.random() * 2 + 1,
                hue: 195 // Base hue for cyan color
            });
        }
    }

    initProjectCardEffects() {
        // Find all project cards and add enhanced hover effects
        setTimeout(() => {
            this.projectCards = document.querySelectorAll('.project-card');
            this.projectCards.forEach(card => {
                this.addCardHoverEffect(card);
            });
        }, 1000);
    }

    addCardHoverEffect(card) {
        let isHovering = false;
        let hoverParticles = [];

        card.addEventListener('mouseenter', () => {
            isHovering = true;
            const rect = card.getBoundingClientRect();

            // Create special hover particles around the card
            for (let i = 0; i < 20; i++) {
                hoverParticles.push({
                    x: rect.left + Math.random() * rect.width,
                    y: rect.top + Math.random() * rect.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 2,
                    opacity: 1,
                    life: 60,
                    maxLife: 60,
                    hue: 195 + Math.random() * 60 - 30 // Vary hue around cyan
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            isHovering = false;
            hoverParticles = [];
        });

        // Store hover state for animation
        card._hoverState = { isHovering: () => isHovering, particles: hoverParticles };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Animate regular particles
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // Mouse interaction
            if (this.mouse.isMoving) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx -= (dx / distance) * force * 0.01;
                    particle.vy -= (dy / distance) * force * 0.01;
                    particle.size = particle.originalSize * (1 + force);
                    particle.opacity = Math.min(1, particle.opacity + force * 0.3);
                }
            } else {
                particle.size = particle.originalSize;
                particle.opacity = Math.max(0.2, particle.opacity - 0.01);
            }

            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 100%, 50%, ${particle.opacity})`;
            this.ctx.fill();
        });

        // Animate project card hover particles
        this.projectCards.forEach(card => {
            if (card._hoverState && card._hoverState.isHovering()) {
                const rect = card.getBoundingClientRect();

                card._hoverState.particles.forEach((particle, index) => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.life--;
                    particle.opacity = particle.life / particle.maxLife;

                    // Keep particles within card bounds
                    if (particle.x < rect.left || particle.x > rect.right) {
                        particle.vx *= -1;
                    }
                    if (particle.y < rect.top || particle.y > rect.bottom) {
                        particle.vy *= -1;
                    }

                    // Draw hover particle
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fillStyle = `hsla(${particle.hue}, 100%, 60%, ${particle.opacity})`;
                    this.ctx.fill();

                    // Remove dead particles
                    if (particle.life <= 0) {
                        card._hoverState.particles.splice(index, 1);
                    }
                });

                // Add new particles periodically
                if (Math.random() < 0.1) {
                    card._hoverState.particles.push({
                        x: rect.left + Math.random() * rect.width,
                        y: rect.top + Math.random() * rect.height,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        size: Math.random() * 3 + 2,
                        opacity: 1,
                        life: 60,
                        maxLife: 60,
                        hue: 195 + Math.random() * 60 - 30
                    });
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';

    // Check if particles-js div exists, if so replace it
    const particlesDiv = document.getElementById('particles-js');
    if (particlesDiv) {
        particlesDiv.parentNode.replaceChild(canvas, particlesDiv);
    } else {
        document.body.appendChild(canvas);
    }

    const particleSystem = new ParticleSystem(canvas);
    particleSystem.animate();
});

// Fallback particles.js configuration for compatibility
window.particlesJS = function(elementId, config) {
    console.log('Using enhanced particle system with project card effects');
};