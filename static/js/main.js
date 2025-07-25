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
    initializeProjectModal();
    initializeCertificateModal();

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

// Project Modal Data
const projectData = {
    'codeheaven': {
        title: 'CodeHeaven - Programming Learning Platform',
        category: 'Web Development',
        duration: '6 months',
        status: 'Completed',
        accuracy: '95%',
        userSatisfaction: '4.8/5',
        images: [
            'assets/projects/codeheaven1.jpg',
            'assets/projects/codeheaven2.jpg'
        ],
        problem: 'Create an interactive programming learning platform that provides real-time code editing, compilation, and step-by-step tutorials for multiple programming languages.',
        implementation: [
            'Developed responsive web interface with HTML5, CSS3, and modern JavaScript',
            'Implemented real-time code editor with syntax highlighting using CodeMirror',
            'Created interactive tutorial system with progressive difficulty levels',
            'Built code compilation backend supporting C++, Python, and JavaScript',
            'Integrated user progress tracking and achievement system',
            'Implemented responsive design for mobile and desktop compatibility'
        ],
        impact: 'Successfully launched platform serving 500+ active learners with 95% completion rate for beginner courses and 4.8/5 user satisfaction rating.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'CodeMirror', 'Node.js', 'Express.js'],
        metrics: {
            codeAccuracy: 95,
            userEngagement: 87,
            completionRate: 78,
            performance: 92
        },
        githubUrl: 'https://github.com/huzaifakamaalkhan/codeheaven',
        liveUrl: 'https://codeheaven-demo.com'
    },
    'heart-disease': {
        title: 'Heart Disease Prediction System',
        category: 'Machine Learning',
        duration: '4 months',
        status: 'Completed',
        accuracy: '94.2%',
        precision: '93.7%',
        images: [
            'assets/projects/heart1.jpg',
            'assets/projects/heart2.jpg'
        ],
        problem: 'Develop a machine learning model to predict heart disease risk using patient medical data, helping doctors make informed decisions for early intervention.',
        implementation: [
            'Collected and preprocessed heart disease dataset with 14 key features',
            'Applied data cleaning and feature engineering techniques',
            'Implemented multiple ML algorithms: Random Forest, SVM, and Logistic Regression',
            'Created web interface for easy patient data input and prediction',
            'Integrated model comparison and performance analysis dashboard',
            'Built visualization tools for feature importance and prediction confidence'
        ],
        impact: 'Achieved 94.2% accuracy in heart disease prediction, potentially helping early diagnosis for thousands of patients with reliable risk assessment.',
        technologies: ['Python', 'scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Flask', 'HTML/CSS'],
        metrics: {
            accuracy: 94.2,
            precision: 93.7,
            recall: 92.1,
            f1Score: 92.9
        },
        githubUrl: 'https://github.com/huzaifakamaalkhan/heart-disease-prediction'
    },
    'ai-fitness': {
        title: 'AI Fitness Tracker',
        category: 'AI Application',
        duration: '3 months',
        status: 'Completed',
        accuracy: '98%',
        realTimeProcessing: '< 100ms',
        images: [
            'assets/projects/fitness1.jpg',
            'assets/projects/fitness2.jpg'
        ],
        problem: 'Create an AI-powered fitness tracking application that accurately predicts calories burned based on user activities, biometric data, and exercise patterns.',
        implementation: [
            'Developed AI model using ensemble learning with XGBoost and Random Forest',
            'Integrated real-time data processing for continuous activity monitoring',
            'Built Streamlit web application with interactive dashboard',
            'Implemented user profile system with personalized recommendations',
            'Created data visualization for workout analytics and progress tracking',
            'Added integration with wearable devices for automated data collection'
        ],
        impact: 'Achieved 98% accuracy in calorie prediction, helping users optimize their fitness routines with personalized insights and achieving fitness goals 40% faster.',
        technologies: ['Python', 'XGBoost', 'Random Forest', 'Streamlit', 'Pandas', 'Plotly', 'scikit-learn'],
        metrics: {
            accuracy: 98,
            processingSpeed: 95,
            userRetention: 85,
            dataProcessing: 99
        },
        githubUrl: 'https://github.com/huzaifakamaalkhan/ai-fitness-tracker'
    },
    'tripgenie': {
        title: 'TripGenie - AI Travel Planner',
        category: 'Web Development',
        duration: '5 months',
        status: 'Completed',
        accuracy: '92%',
        recommendations: '10K+ generated',
        images: [
            'assets/projects/trip1.jpg',
            'assets/projects/trip2.jpg'
        ],
        problem: 'Design an AI-powered travel itinerary planner that creates personalized travel recommendations based on user preferences, budget, and travel history.',
        implementation: [
            'Built responsive web application with modern JavaScript and CSS Grid',
            'Integrated multiple travel APIs for real-time data on flights, hotels, and attractions',
            'Developed recommendation algorithm using collaborative and content-based filtering',
            'Created interactive map integration for visual itinerary planning',
            'Implemented user review system and social sharing features',
            'Added budget optimization and expense tracking functionality'
        ],
        impact: 'Generated 10,000+ personalized travel itineraries with 92% user approval rating, helping travelers save 60% planning time and discover unique destinations.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Google Maps API', 'Travel APIs', 'Chart.js'],
        metrics: {
            recommendationAccuracy: 92,
            userSatisfaction: 89,
            planningEfficiency: 88,
            apiIntegration: 95
        },
        liveUrl: 'https://tripgenie-demo.com'
    },
    'pomegranate-disease': {
        title: 'Pomegranate Disease Detection',
        category: 'Machine Learning',
        duration: '6 months',
        status: 'Completed',
        accuracy: '94.15%',
        processingTime: '2.3s per image',
        images: [
            'assets/projects/pomegranate1.jpg',
            'assets/projects/pomegranate2.jpg'
        ],
        problem: 'Develop a computer vision system to detect diseases in pomegranate plants using image analysis, helping farmers identify and treat plant diseases early.',
        implementation: [
            'Collected and annotated dataset of 5000+ pomegranate plant images',
            'Implemented hybrid CNN architecture combining VGG16 and ResNet50',
            'Applied advanced data augmentation techniques for robust model training',
            'Developed web-based interface for easy image upload and analysis',
            'Created detailed disease classification with treatment recommendations',
            'Integrated confidence scoring and uncertainty quantification'
        ],
        impact: 'Achieved 94.15% accuracy in disease detection, potentially saving crop yields for farmers and reducing agricultural losses by early disease identification.',
        technologies: ['Python', 'TensorFlow', 'Keras', 'VGG16', 'ResNet50', 'OpenCV', 'Flask'],
        metrics: {
            accuracy: 94.15,
            precision: 93.8,
            recall: 94.5,
            processingSpeed: 87
        },
        githubUrl: 'https://github.com/huzaifakamaalkhan/pomegranate-disease-detection'
    },
    'grapes-disease': {
        title: 'Grapes Disease Prediction',
        category: 'Machine Learning',
        duration: '4 months',
        status: 'Completed',
        accuracy: '97.94%',
        diseaseTypes: '8 classifications',
        images: [
            'assets/projects/grapes1.jpg',
            'assets/projects/grapes2.jpg'
        ],
        problem: 'Create an advanced machine learning system for predicting grape diseases using CNN and Linear Discriminant Analysis for precise agricultural diagnostics.',
        implementation: [
            'Developed hybrid model combining CNN feature extraction with LDA classification',
            'Implemented advanced preprocessing pipeline with noise reduction',
            'Created multi-class classification system for 8 different grape diseases',
            'Built real-time prediction system with mobile-responsive interface',
            'Integrated GPS-based disease mapping for regional analysis',
            'Added automated report generation with treatment suggestions'
        ],
        impact: 'Achieved 97.94% accuracy in grape disease prediction, highest in agricultural AI applications, helping vineyards prevent crop losses worth millions.',
        technologies: ['Python', 'CNN', 'Linear Discriminant Analysis', 'TensorFlow', 'scikit-learn', 'OpenCV'],
        metrics: {
            accuracy: 97.94,
            precision: 97.2,
            recall: 98.1,
            f1Score: 97.6
        },
        githubUrl: 'https://github.com/huzaifakamaalkhan/grapes-disease-prediction'
    },
    'college-chatbot': {
        title: 'College Admission Chatbot',
        category: 'AI Application',
        duration: '3 months',
        status: 'Completed',
        accuracy: '96%',
        responseTime: '< 2s',
        images: [
            'assets/projects/chatbot1.jpg',
            'assets/projects/chatbot2.jpg'
        ],
        problem: 'Build an intelligent chatbot using IBM WatsonX to handle college admission queries, providing instant and accurate responses to prospective students.',
        implementation: [
            'Integrated IBM WatsonX Assistant for natural language processing',
            'Created comprehensive knowledge base with admission procedures and FAQs',
            'Developed multi-intent recognition for complex query handling',
            'Built context-aware conversation flow with memory management',
            'Implemented sentiment analysis for student satisfaction tracking',
            'Added multilingual support for diverse student demographics'
        ],
        impact: 'Handles 96% of admission queries accurately, reducing admission office workload by 70% and providing 24/7 student support with instant responses.',
        technologies: ['IBM WatsonX', 'Natural Language Processing', 'JavaScript', 'HTML/CSS', 'REST APIs'],
        metrics: {
            queryAccuracy: 96,
            responseTime: 98,
            userSatisfaction: 91,
            resolutionRate: 89
        },
        githubUrl: 'https://github.com/huzaifakamaalkhan/college-chatbot'
    }
};

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
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
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

// Project Modal Functionality
function initializeProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalOverlay = document.getElementById('projectModalOverlay');
    const modalClose = document.getElementById('projectModalClose');
    const projectCards = document.querySelectorAll('.project-card[data-project]');

    // Add click listeners to project cards
    projectCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            if (projectData[projectId]) {
                openProjectModal(projectId);
            }
        });

        // Add hover effect
        const projectContent = card.querySelector('.project-content');
        if (projectContent) {
            const clickIndicator = document.createElement('div');
            clickIndicator.className = 'project-click-indicator';
            clickIndicator.innerHTML = '<i class="fas fa-info-circle"></i> Click for details';
            projectContent.appendChild(clickIndicator);
        }
    });

    // Close modal functionality
    function closeProjectModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeProjectModal);
    modalOverlay.addEventListener('click', closeProjectModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const data = projectData[projectId];

    if (!data) return;

    // Populate modal content
    document.getElementById('projectModalTitle').textContent = data.title;
    document.getElementById('projectModalCategory').textContent = data.category;
    document.getElementById('projectModalDuration').textContent = data.duration;
    document.getElementById('projectModalStatus').textContent = data.status;
    document.getElementById('projectModalProblem').textContent = data.problem;
    document.getElementById('projectModalImpact').textContent = data.impact;

    // Set main metrics
    document.getElementById('projectModalAccuracy').textContent = data.accuracy || 'N/A';

    // Set main image (placeholder since images might not exist)
    const mainImage = document.getElementById('projectModalMainImage');
    mainImage.src = `static/${data.images[0]}`;
    mainImage.alt = data.title;
    mainImage.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
    };

    // Create implementation list
    const implementationContainer = document.getElementById('projectModalImplementation');
    if (Array.isArray(data.implementation)) {
        implementationContainer.innerHTML = '<ul>' + 
            data.implementation.map(item => `<li>${item}</li>`).join('') + 
            '</ul>';
    } else {
        implementationContainer.innerHTML = `<p>${data.implementation}</p>`;
    }

    // Create technology badges
    const techStackContainer = document.getElementById('projectModalTechStack');
    techStackContainer.innerHTML = data.technologies.map(tech => 
        `<span class="tech-badge">${tech}</span>`
    ).join('');

    // Create metrics chart
    createMetricsChart(data.metrics);

    // Add project links
    const linksContainer = document.getElementById('projectModalLinks');
    linksContainer.innerHTML = '';

    if (data.githubUrl) {
        linksContainer.innerHTML += `
            <a href="${data.githubUrl}" target="_blank" class="project-modal-link">
                <i class="fab fa-github"></i> View on GitHub
            </a>
        `;
    }

    if (data.liveUrl) {
        linksContainer.innerHTML += `
            <a href="${data.liveUrl}" target="_blank" class="project-modal-link">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>
        `;
    }

    // Show modal
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function createMetricsChart(metrics) {
    const chartContainer = document.getElementById('metricsChart');
    chartContainer.innerHTML = '';

    if (!metrics) return;

    const metricsArray = Object.entries(metrics);

    metricsArray.forEach(([key, value]) => {
        const metricItem = document.createElement('div');
        metricItem.className = 'metric-item';

        const metricLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        metricItem.innerHTML = `
            <div class="metric-header">
                <span class="metric-name">${metricLabel}</span>
                <span class="metric-value">${value}%</span>
            </div>
            <div class="metric-bar">
                <div class="metric-progress" style="width: ${value}%"></div>
            </div>
        `;

        chartContainer.appendChild(metricItem);
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

// Certificate Modal Data
const certificateData = {
    'google-ai-educators': {
        title: 'Generative AI for Educators',
        issuer: 'Google',
        date: 'December 2024',
        type: 'Professional Certificate',
        credentialId: 'GOOG-AI-EDU-2024-001',
        description: 'Comprehensive certification covering the fundamentals and applications of generative AI in educational settings. This program focused on ethical AI implementation, prompt engineering, and integrating AI tools into curriculum design.',
        skills: ['Generative AI', 'Educational Technology', 'Prompt Engineering', 'AI Ethics', 'Curriculum Design'],
        verificationUrl: 'https://google.com/verify/ai-educators',
        certificateImage: 'assets/certificates/google-ai-educators.jpg'
    },
    'ibm-enterprise-ai': {
        title: 'Enterprise Grade AI',
        issuer: 'IBM',
        date: 'November 2024',
        type: 'Professional Certification',
        credentialId: 'IBM-ENT-AI-2024-002',
        description: 'Advanced certification in enterprise-level AI solutions, covering Watson AI platform, machine learning deployment, and enterprise AI strategy. Focused on scalable AI implementations for business solutions.',
        skills: ['IBM Watson', 'Enterprise AI', 'ML Deployment', 'AI Strategy', 'Business Intelligence'],
        verificationUrl: 'https://ibm.com/verify/enterprise-ai',
        certificateImage: 'assets/certificates/ibm-enterprise-ai.jpg'
    },
    'adverk-ai': {
        title: 'Artificial Intelligence Certification',
        issuer: 'Adverk Technologies',
        date: 'October 2024',
        type: 'Industry Certification',
        credentialId: 'ADV-AI-2024-003',
        description: 'Comprehensive AI certification covering machine learning algorithms, deep learning frameworks, and practical AI implementation. Gained hands-on experience with real-world AI projects and industry best practices.',
        skills: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Data Science', 'AI Implementation'],
        verificationUrl: 'https://adverk.com/verify/ai-certification',
        certificateImage: 'assets/certificates/adverk-ai.jpg'
    },
    'aws-python-ai': {
        title: 'Python & AI Certification',
        issuer: 'AWS',
        date: 'September 2024',
        type: 'Cloud Certification',
        credentialId: 'AWS-PY-AI-2024-004',
        description: 'Specialized certification in Python programming for AI applications on AWS cloud platform. Covered serverless AI, SageMaker, and deploying ML models at scale using AWS services.',
        skills: ['Python Programming', 'AWS SageMaker', 'Cloud AI', 'Serverless Computing', 'ML Deployment'],
        verificationUrl: 'https://aws.amazon.com/verify/python-ai',
        certificateImage: 'assets/certificates/aws-python-ai.jpg'
    },
    'tata-crucible': {
        title: 'TATA Crucible Participation',
        issuer: 'TATA Group',
        date: 'August 2024',
        type: 'Competition Certificate',
        credentialId: 'TATA-CRU-2024-005',
        description: 'Participated in TATA Crucible, India\'s most prestigious business quiz competition. Demonstrated knowledge across business, economics, and current affairs while competing against top talent nationwide.',
        skills: ['Business Knowledge', 'Strategic Thinking', 'Current Affairs', 'Team Collaboration', 'Competitive Analysis'],
        verificationUrl: 'https://tata.com/verify/crucible',
        certificateImage: 'assets/certificates/tata-crucible.jpg'
    },
    'flipkart-grid': {
        title: 'Flipkart Grid 6.0 Participation',
        issuer: 'Flipkart',
        date: 'July 2024',
        type: 'Hackathon Certificate',
        credentialId: 'FLIP-GRID-2024-006',
        description: 'Participated in Flipkart Grid 6.0, a national-level engineering challenge focused on e-commerce technology solutions. Developed innovative solutions for supply chain optimization and customer experience enhancement.',
        skills: ['Software Development', 'Problem Solving', 'E-commerce Technology', 'Innovation', 'Team Collaboration'],
        verificationUrl: 'https://flipkart.com/verify/grid',
        certificateImage: 'assets/certificates/flipkart-grid.jpg'
    },
    'google-genai-studio': {
        title: 'GenAI Studio Certification',
        issuer: 'Google',
        date: 'June 2024',
        type: 'Technical Certification',
        credentialId: 'GOOG-STUDIO-2024-007',
        description: 'Advanced certification in Google\'s GenAI Studio platform, focusing on building and deploying generative AI applications. Mastered prompt engineering, model fine-tuning, and API integration.',
        skills: ['GenAI Studio', 'Model Fine-tuning', 'API Integration', 'Prompt Engineering', 'AI Application Development'],
        verificationUrl: 'https://google.com/verify/genai-studio',
        certificateImage: 'assets/certificates/google-genai-studio.jpg'
    },
    'kpit-innovation': {
        title: 'KPIT Innovation Certificate',
        issuer: 'KPIT Technologies',
        date: 'January 2025',
        type: 'Innovation Award',
        credentialId: 'KPIT-INN-2025-008',
        description: 'Recognition certificate for achieving Top 6 finalist position in KPIT Sparkle 2025 innovation challenge. Demonstrated exceptional innovation in autonomous vehicle technology and mobility solutions.',
        skills: ['Innovation', 'Autonomous Systems', 'Mobility Solutions', 'Team Leadership', 'Technical Excellence'],
        verificationUrl: 'https://kpit.com/verify/innovation',
        certificateImage: 'assets/certificates/kpit-innovation.jpg'
    }
};

// Certificate Modal Functionality
function initializeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const modalOverlay = document.getElementById('certificateModalOverlay');
    const modalClose = document.getElementById('certificateModalClose');
    const certificateCards = document.querySelectorAll('.cert-card[data-certificate]');

    // Add click listeners to certificate cards
    certificateCards.forEach(card => {
        card.addEventListener('click', () => {
            const certificateId = card.getAttribute('data-certificate');
            if (certificateData[certificateId]) {
                openCertificateModal(certificateId);
            }
        });
    });

    // Close modal functionality
    function closeCertificateModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeCertificateModal);
    modalOverlay.addEventListener('click', closeCertificateModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCertificateModal();
        }
    });
}

function openCertificateModal(certificateId) {
    const modal = document.getElementById('certificateModal');
    const data = certificateData[certificateId];

    if (!data) return;

    // Populate modal content
    document.getElementById('certificateModalTitle').textContent = data.title;
    document.getElementById('certificateModalIssuer').textContent = data.issuer;
    document.getElementById('certificateModalDate').textContent = data.date;
    document.getElementById('certificateModalType').textContent = data.type;
    document.getElementById('certificateModalCredential').textContent = data.credentialId;
    document.getElementById('certificateModalDescription').textContent = data.description;

    // Set certificate image
    const certificateImage = document.getElementById('certificateModalImage');
    const certificateLoading = document.getElementById('certificateLoading');
    
    // Show loading state
    certificateLoading.style.display = 'flex';
    certificateImage.style.display = 'none';
    
    certificateImage.src = `static/${data.certificateImage}`;
    certificateImage.alt = data.title;
    
    // Handle image load/error
    certificateImage.onload = function() {
        certificateLoading.style.display = 'none';
        certificateImage.style.display = 'block';
    };
    
    certificateImage.onerror = function() {
        certificateLoading.innerHTML = `
            <i class="fas fa-certificate"></i>
            <span>Certificate Image Coming Soon</span>
        `;
        this.style.display = 'none';
    };

    // Create skills tags
    const skillsContainer = document.getElementById('certificateModalSkills');
    skillsContainer.innerHTML = data.skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');

    // Add verification link
    const linksContainer = document.getElementById('certificateModalLinks');
    linksContainer.innerHTML = `
        <a href="${data.verificationUrl}" target="_blank" class="verification-link">
            <i class="fas fa-external-link-alt"></i> Verify Certificate
        </a>
        <div style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">
            <i class="fas fa-shield-alt"></i> Credential ID: ${data.credentialId}
        </div>
    `;

    // Show modal
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
}

// Service worker registration for offline capability
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a real deployment
        console.log('Service worker support detected');
    });
}