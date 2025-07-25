// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeTheme();
    initializeNavigation();
    initializeCursor();
    initializeScrollAnimations();
    initializeSkillBars();
    initializeProjectFilters();
    initializeContactForm();
    initializeCounters();
    initializePreloader();
    initializeAchievementGallery();
    initializeAchievementModal();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Initialize parallax effects
    initializeParallax();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(10, 10, 15, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(10, 10, 15, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNav, 100));
}

// Custom cursor effects
function initializeCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    if (!cursor || !cursorTrail) return;
    
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate cursor
    function animateCursor() {
        // Main cursor follows mouse immediately
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        // Trail follows with delay
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .experience-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.backgroundColor = 'var(--primary-color)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .timeline-item, 
        .experience-card, 
        .project-card, 
        .cert-card, 
        .skill-category,
        .about-stats .stat-item
    `);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item, 
        .experience-card, 
        .project-card, 
        .cert-card, 
        .skill-category,
        .stat-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .timeline-item:nth-child(even) {
            transform: translateY(30px) translateX(30px);
        }
        
        .timeline-item:nth-child(odd) {
            transform: translateY(30px) translateX(-30px);
        }
        
        .timeline-item.animate-in {
            transform: translateY(0) translateX(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Project filtering
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Contact form
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        
        // Update button state
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            // Show message
            formMessage.style.display = 'block';
            formMessage.className = `form-message ${result.success ? 'success' : 'error'}`;
            formMessage.textContent = result.message;
            
            if (result.success) {
                form.reset();
            }
            
        } catch (error) {
            formMessage.style.display = 'block';
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Network error. Please try again.';
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    });
    
    // Form validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidation);
    });
    
    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        // Remove existing validation
        input.classList.remove('invalid');
        
        // Validate based on input type
        let isValid = true;
        
        if (input.hasAttribute('required') && !value) {
            isValid = false;
        } else if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }
        
        if (!isValid) {
            input.classList.add('invalid');
        }
    }
    
    function clearValidation(e) {
        e.target.classList.remove('invalid');
    }
}

// Counter animations
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// Preloader
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });
}

// Achievement Modal Data
const achievementData = {
    'faculty-induction': {
        title: 'Faculty Induction Program',
        date: 'January 2024',
        location: 'JSPM\'s JSCOP, Pune',
        category: 'Academic Recognition',
        images: [
            'assets/achievements/achievement1.jpg',
            'assets/achievements/achievement3.jpg'
        ],
        problem: 'Participate in comprehensive faculty induction program to understand modern teaching methodologies and educational excellence standards in computer engineering education.',
        implementation: [
            'Attended comprehensive training sessions on modern teaching methodologies',
            'Participated in workshops on curriculum development and assessment strategies',
            'Engaged in interactive sessions on student engagement techniques',
            'Completed modules on educational technology integration',
            'Collaborated with experienced faculty members on best practices'
        ],
        impact: 'Successfully completed the faculty induction program with recognition for outstanding participation and commitment to educational excellence.',
        technologies: ['Educational Technology', 'Curriculum Design', 'Assessment Tools', 'Teaching Methodologies']
    },
    'kpit-sparkle': {
        title: 'KPIT Sparkle 2025 - Top 6 Finalist',
        date: 'January 2025',
        location: 'KPIT Technologies, Pune',
        category: 'Innovation Competition',
        images: [
            'assets/achievements/achievement2.jpg',
            'assets/achievements/achievement6.jpg',
            'assets/achievements/achievement7.jpg',
            'assets/achievements/achievement8.jpg'
        ],
        problem: 'Design innovative solutions for next-generation mobility challenges, focusing on autonomous vehicle technology and smart transportation systems.',
        implementation: [
            'Formed Team Vanguardians with diverse technical expertise',
            'Developed autonomous vehicle navigation system using AI/ML algorithms',
            'Implemented computer vision for real-time object detection and tracking',
            'Created predictive analytics for traffic optimization',
            'Built comprehensive prototype with hardware integration',
            'Presented solution to industry experts and technical panel'
        ],
        impact: 'Achieved Top 6 finalist position among hundreds of participants, gaining recognition for innovative approach to mobility solutions and technical excellence.',
        technologies: ['Python', 'Machine Learning', 'Computer Vision', 'IoT', 'Autonomous Systems', 'Data Analytics']
    },
    'teaching-excellence': {
        title: 'Teaching Excellence Recognition',
        date: 'March 2024',
        location: 'JSPM\'s JSCOP, Pune',
        category: 'Educational Impact',
        images: [
            'assets/achievements/achievement3.jpg',
            'assets/achievements/achievement11.jpg'
        ],
        problem: 'Enhance student learning experience through innovative teaching methods and mentorship programs in computer engineering subjects.',
        implementation: [
            'Developed interactive coding workshops for complex algorithms',
            'Created hands-on project-based learning modules',
            'Implemented peer mentoring programs for struggling students',
            'Introduced gamification elements in programming courses',
            'Organized technical skill development sessions',
            'Established regular feedback mechanisms for continuous improvement'
        ],
        impact: 'Significantly improved student engagement and academic performance, with 95% student satisfaction rate and notable improvement in programming skills.',
        technologies: ['Educational Tools', 'Programming Languages', 'Interactive Learning', 'Project Management']
    },
    'academic-presentation': {
        title: 'Academic Research Presentation',
        date: 'February 2024',
        location: 'JSPM\'s JSCOP, Pune',
        category: 'Research & Innovation',
        images: [
            'assets/achievements/achievement4.jpg'
        ],
        problem: 'Present cutting-edge research findings in artificial intelligence and machine learning applications to academic and industry audience.',
        implementation: [
            'Conducted comprehensive literature review on AI/ML applications',
            'Developed novel algorithms for predictive analytics',
            'Performed extensive experimental validation and testing',
            'Created detailed research documentation and analysis',
            'Prepared comprehensive presentation with visual demonstrations',
            'Engaged with peer reviewers and incorporated feedback'
        ],
        impact: 'Successfully presented research work to academic community, receiving positive feedback and recognition for innovative approach and technical depth.',
        technologies: ['Machine Learning', 'Data Science', 'Research Methodologies', 'Statistical Analysis', 'Python']
    },
    'tech-innovation': {
        title: 'Technology Innovation Leadership',
        date: 'December 2024',
        location: 'Innovation Hub',
        category: 'Technology Leadership',
        images: [
            'assets/achievements/achievement5.jpg'
        ],
        problem: 'Lead technological innovation initiatives and develop cutting-edge solutions for industry challenges in AI and software development.',
        implementation: [
            'Spearheaded multiple technology innovation projects',
            'Developed AI-powered applications for real-world problems',
            'Led cross-functional teams in agile development environments',
            'Implemented best practices for software development lifecycle',
            'Created technical documentation and knowledge sharing sessions',
            'Established partnerships with industry leaders for technology transfer'
        ],
        impact: 'Successfully delivered multiple innovative technology solutions, establishing leadership in emerging technologies and driving digital transformation initiatives.',
        technologies: ['Artificial Intelligence', 'Full Stack Development', 'Cloud Computing', 'DevOps', 'Agile Methodologies']
    },
    'kpit-team': {
        title: 'KPIT Sparkle Team Collaboration',
        date: 'January 2025',
        location: 'KPIT Technologies, Pune',
        category: 'Team Achievement',
        images: [
            'assets/achievements/achievement6.jpg',
            'assets/achievements/achievement2.jpg'
        ],
        problem: 'Collaborate effectively within Team Vanguardians to develop innovative mobility solutions and achieve collective success in national competition.',
        implementation: [
            'Established clear team roles and responsibilities',
            'Implemented agile development practices for project management',
            'Created effective communication channels and regular sync meetings',
            'Developed complementary skills through knowledge sharing',
            'Coordinated parallel development streams for optimal efficiency',
            'Maintained high-quality standards through peer code reviews'
        ],
        impact: 'Demonstrated exceptional teamwork and collaborative innovation, contributing to team\'s success in reaching Top 6 finalist position.',
        technologies: ['Team Collaboration', 'Project Management', 'Agile Methodologies', 'Version Control', 'Communication Tools']
    },
    'kpit-recognition': {
        title: 'KPIT Individual Excellence Recognition',
        date: 'January 2025',
        location: 'KPIT Technologies, Pune',
        category: 'Individual Achievement',
        images: [
            'assets/achievements/achievement7.jpg'
        ],
        problem: 'Demonstrate individual technical excellence and innovation capabilities in competitive environment while contributing to team success.',
        implementation: [
            'Developed core AI algorithms for autonomous navigation system',
            'Implemented advanced computer vision modules for object detection',
            'Created robust data processing pipelines for real-time analytics',
            'Optimized system performance through algorithm refinement',
            'Documented technical specifications and implementation details',
            'Presented individual contributions to technical evaluation panel'
        ],
        impact: 'Received individual recognition for outstanding technical contributions and innovation in mobility solutions development.',
        technologies: ['Python', 'Machine Learning', 'Computer Vision', 'Algorithm Optimization', 'Technical Documentation']
    },
    'mobility-innovation': {
        title: 'Reimagining Mobility Solutions',
        date: 'January 2025',
        location: 'KPIT Innovation Center',
        category: 'Future Technology',
        images: [
            'assets/achievements/achievement8.jpg'
        ],
        problem: 'Develop next-generation transportation solutions that address current mobility challenges including traffic congestion, safety, and environmental sustainability.',
        implementation: [
            'Researched current mobility challenges and emerging technology trends',
            'Designed intelligent traffic management system using IoT and AI',
            'Developed predictive models for traffic flow optimization',
            'Created sustainable transportation algorithms',
            'Integrated multiple data sources for comprehensive analytics',
            'Built scalable architecture for city-wide deployment'
        ],
        impact: 'Created innovative mobility solution with potential for real-world implementation, demonstrating vision for future transportation systems.',
        technologies: ['IoT', 'Artificial Intelligence', 'Big Data Analytics', 'Smart Cities', 'Sustainable Technology']
    },
    'executive-interaction': {
        title: 'Industry Executive Leadership Meeting',
        date: 'January 2025',
        location: 'KPIT Technologies, Pune',
        category: 'Leadership Interaction',
        images: [
            'assets/achievements/achievement9.jpg'
        ],
        problem: 'Engage with industry leaders to understand market needs, present innovative solutions, and gain insights into future technology trends.',
        implementation: [
            'Prepared comprehensive presentation of technical achievements',
            'Researched market trends and industry challenges',
            'Engaged in strategic discussions on technology roadmaps',
            'Presented innovative solutions to executive leadership',
            'Gathered valuable feedback on technology direction',
            'Established professional network within industry leadership'
        ],
        impact: 'Successfully engaged with senior industry executives, gaining valuable insights and recognition for technical innovation and professional potential.',
        technologies: ['Strategic Thinking', 'Executive Presentation', 'Market Analysis', 'Professional Networking']
    },
    'kpit-campus': {
        title: 'KPIT Campus Innovation Experience',
        date: 'January 2025',
        location: 'KPIT Technologies Campus, Pune',
        category: 'Innovation Hub',
        images: [
            'assets/achievements/achievement10.jpg'
        ],
        problem: 'Experience world-class innovation environment and collaborate with industry professionals to develop cutting-edge technology solutions.',
        implementation: [
            'Toured state-of-the-art research and development facilities',
            'Participated in innovation workshops and technical sessions',
            'Collaborated with industry experts on real-world challenges',
            'Accessed advanced technology infrastructure and tools',
            'Engaged in knowledge sharing with professional developers',
            'Experienced industry-standard development practices'
        ],
        impact: 'Gained invaluable exposure to industry innovation processes and established foundation for future professional growth in technology sector.',
        technologies: ['Innovation Processes', 'Industry Tools', 'Professional Development', 'Technology Infrastructure']
    },
    'workshop-session': {
        title: 'Technical Workshop Leadership',
        date: 'November 2024',
        location: 'JSPM\'s JSCOP, Pune',
        category: 'Knowledge Sharing',
        images: [
            'assets/achievements/achievement11.jpg'
        ],
        problem: 'Conduct comprehensive technical workshops to share knowledge and enhance learning experience for fellow students and professionals.',
        implementation: [
            'Designed comprehensive workshop curriculum on emerging technologies',
            'Created hands-on coding exercises and practical demonstrations',
            'Developed interactive learning materials and resources',
            'Facilitated group discussions and problem-solving sessions',
            'Provided personalized guidance and mentorship to participants',
            'Collected feedback and continuously improved workshop content'
        ],
        impact: 'Successfully conducted multiple technical workshops with high participant satisfaction, contributing to skill development of 50+ individuals.',
        technologies: ['Teaching Methodologies', 'Workshop Design', 'Technical Training', 'Mentorship', 'Educational Technology']
    },
    'computer-engineering': {
        title: 'Computer Engineering Academic Excellence',
        date: 'Ongoing',
        location: 'JSPM\'s JSCOP, Pune',
        category: 'Academic Achievement',
        images: [
            'assets/achievements/achievement12.jpg'
        ],
        problem: 'Excel in computer engineering studies while balancing theoretical knowledge with practical application and industry relevance.',
        implementation: [
            'Maintained consistently high academic performance across all subjects',
            'Completed challenging projects in data structures, algorithms, and AI',
            'Participated in coding competitions and technical events',
            'Engaged in research projects and academic publications',
            'Balanced coursework with internships and practical experience',
            'Developed strong foundation in computer science fundamentals'
        ],
        impact: 'Achieved academic excellence with strong GPA while gaining practical experience through internships and projects, preparing for successful career in technology.',
        technologies: ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems', 'Computer Networks', 'AI/ML']
    }
};

// Achievement Modal Functionality
function initializeAchievementModal() {
    const modal = document.getElementById('achievementModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const timelineItems = document.querySelectorAll('.timeline-item[data-achievement]');
    
    // Add click listeners to timeline achievement items
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            const achievementId = item.getAttribute('data-achievement');
            if (achievementData[achievementId]) {
                openAchievementModal(achievementId);
            }
        });
    });
    
    // Close modal functionality
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openAchievementModal(achievementId) {
    const modal = document.getElementById('achievementModal');
    const data = achievementData[achievementId];
    
    if (!data) return;
    
    // Populate modal content
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDate').textContent = data.date;
    document.getElementById('modalLocation').textContent = data.location;
    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalProblem').textContent = data.problem;
    document.getElementById('modalImpact').textContent = data.impact;
    
    // Set main image
    const mainImage = document.getElementById('modalMainImage');
    mainImage.src = `static/${data.images[0]}`;
    mainImage.alt = data.title;
    
    // Create thumbnails
    const thumbnailContainer = document.getElementById('modalThumbnails');
    thumbnailContainer.innerHTML = '';
    
    if (data.images.length > 1) {
        data.images.forEach((imagePath, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `modal-thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="static/${imagePath}" alt="${data.title} ${index + 1}">`;
            
            thumbnail.addEventListener('click', () => {
                mainImage.src = `static/${imagePath}`;
                thumbnailContainer.querySelectorAll('.modal-thumbnail').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            });
            
            thumbnailContainer.appendChild(thumbnail);
        });
    }
    
    // Create implementation list
    const implementationContainer = document.getElementById('modalImplementation');
    if (Array.isArray(data.implementation)) {
        implementationContainer.innerHTML = '<ul>' + 
            data.implementation.map(item => `<li>${item}</li>`).join('') + 
            '</ul>';
    } else {
        implementationContainer.innerHTML = `<p>${data.implementation}</p>`;
    }
    
    // Create technology badges
    const techStackContainer = document.getElementById('modalTechStack');
    techStackContainer.innerHTML = data.technologies.map(tech => 
        `<span class="tech-badge">${tech}</span>`
    ).join('');
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Smooth scrolling
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effects
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.hero-image, .profile-glow');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    }, 16));
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add CSS for form validation
const validationStyle = document.createElement('style');
validationStyle.textContent = `
    .form-group input.invalid,
    .form-group textarea.invalid {
        border-color: var(--secondary-color) !important;
        box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2) !important;
    }
    
    .form-group input.invalid + label,
    .form-group textarea.invalid + label {
        color: var(--secondary-color) !important;
    }
`;
document.head.appendChild(validationStyle);

// Performance optimizations
if ('requestIdleCallback' in window) {
    // Use requestIdleCallback for non-critical operations
    requestIdleCallback(() => {
        // Initialize non-critical features
        console.log('Portfolio loaded successfully');
    });
}

// Achievement Gallery - Infinite Auto Scroll
function initializeAchievementGallery() {
    const track = document.getElementById('achievementTrack');
    
    if (!track) return;
    
    // Clone all items to create seamless infinite loop
    const items = Array.from(track.querySelectorAll('.achievement-item'));
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Add CSS class for infinite scroll animation
    track.classList.add('auto-scroll');
}

// Scroll indicator functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('#achievement-gallery');
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Initialize achievement gallery
    initializeAchievementGallery();
});

// Service worker registration for offline capability
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a real deployment
        console.log('Service worker support detected');
    });
}
