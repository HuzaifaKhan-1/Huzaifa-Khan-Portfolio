# Portfolio Website - AI/ML Developer

## Overview

This is a personal portfolio website for Huzaifa Kamaal Khan, an AI/ML developer and full-stack engineer. The application is built using Flask as the backend framework with a modern, interactive frontend featuring particle animations, typing effects, and a dark/light theme system. The website includes sections for showcasing skills, projects, and provides a contact form with email functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Email Service**: Flask-Mail with Gmail SMTP integration
- **Configuration**: Environment-based configuration for sensitive data
- **Logging**: Built-in Python logging for debugging

### Frontend Architecture
- **Template Engine**: Jinja2 (Flask's default templating)
- **Styling**: Custom CSS with CSS variables for theme management
- **JavaScript**: Vanilla JavaScript with modular class-based architecture
- **Responsive Design**: Mobile-first approach with viewport meta tags

### Key Design Patterns
- **MVC Pattern**: Flask routes handle controller logic, templates handle views
- **Modular JavaScript**: Separate classes for different functionalities (ParticleSystem, TypingEffect)
- **Theme System**: CSS custom properties for easy theme switching
- **Progressive Enhancement**: Core functionality works without JavaScript

## Key Components

### Backend Components
1. **Main Application** (`app.py`):
   - Flask app configuration
   - Email service setup with Gmail SMTP
   - Route handlers for home page and contact form
   - Environment variable management

2. **Entry Point** (`main.py`):
   - Application runner with debug mode
   - Host and port configuration for development

### Frontend Components
1. **Template System** (`templates/index.html`):
   - Single-page application structure
   - Preloader with animated loading
   - Dedicated Achievement Gallery section with horizontal scrolling
   - Particle background container
   - Custom cursor effects
   - Responsive navigation

2. **Styling System** (`static/css/style.css`):
   - CSS custom properties for theme management
   - Light/dark theme support
   - Responsive design utilities
   - Animation and transition definitions

3. **Interactive Features**:
   - **Particle System** (`static/js/particles.js`): Canvas-based particle animation with mouse interaction
   - **Typing Effect** (`static/js/typing.js`): Animated text typing with configurable options
   - **Achievement Gallery** (`static/js/main.js`): Horizontal scrolling gallery with auto-scroll, navigation controls, and blur edge effects
   - **Main Controller** (`static/js/main.js`): Coordinates all interactive features

## Data Flow

### Contact Form Flow
1. User fills out contact form on frontend
2. Form data sent via POST request to `/contact` endpoint
3. Flask validates required fields (name, email, message)
4. Flask-Mail creates and sends email via Gmail SMTP
5. Success/error response returned to frontend as JSON
6. Frontend displays appropriate user feedback

### Theme Management Flow
1. System detects user's preferred color scheme
2. Checks localStorage for saved theme preference
3. Sets initial theme via CSS custom properties
4. Theme toggle updates DOM attributes and localStorage
5. CSS variables automatically update component styling

### Animation System Flow
1. Main JavaScript initializes all interactive components
2. Particle system creates canvas and animates background
3. Typing effect cycles through text arrays with configurable timing
4. Scroll animations trigger based on viewport intersection
5. Cursor effects track mouse movement for custom styling

## External Dependencies

### Python Dependencies
- **Flask**: Web framework for routing and templating
- **Flask-Mail**: Email sending functionality
- **Standard Library**: os, logging for configuration and debugging

### Frontend Dependencies
- **Font Awesome 6.4.0**: Icon library for UI elements
- **Google Fonts**: Orbitron and Rajdhani font families for typography
- **No JavaScript frameworks**: Pure vanilla JavaScript implementation

### SMTP Service
- **Gmail SMTP**: Email delivery service requiring app-specific passwords
- **Environment Variables**: Secure credential management

## Deployment Strategy

### Environment Configuration
- **Development**: Debug mode enabled, local host binding
- **Production**: Environment variables for sensitive data (email credentials, session secrets)
- **Security**: Session secrets and email passwords managed via environment variables

### Static Asset Management
- **Flask Static Files**: Automatic serving of CSS, JS, and other assets
- **CDN Integration**: External resources loaded from CDNs for performance
- **Caching Strategy**: Browser caching for static assets

### Email Service Setup
- **Gmail Integration**: SMTP configuration with TLS encryption
- **Fallback Handling**: Error handling for email sending failures
- **Rate Limiting**: Implicit through Gmail's SMTP limits

### Performance Considerations
- **Preloader**: Smooth loading experience while assets load
- **Lazy Loading**: Animation systems initialize on DOM ready
- **Resource Optimization**: Minimal external dependencies
- **Responsive Images**: Viewport-based scaling for mobile devices

The application is designed as a showcase portfolio with emphasis on visual appeal and user experience, utilizing modern web technologies while maintaining simplicity in the backend architecture.

## Recent Changes (July 24, 2025)

### Achievement Gallery Enhancement
- Created dedicated "Achievement Gallery" section positioned between hero and about sections
- Reduced hero section height from 100vh to 75vh for better layout balance
- Implemented horizontal scrolling gallery with 12 achievement images
- Added blur edge effects using CSS gradients for professional appearance
- Increased auto-scroll speed to 2-second intervals for faster animation
- Added theme-aware blur gradients that adapt to light/dark mode
- Enhanced mobile responsiveness with adjusted padding and element sizes
- Added proper section header with title and subtitle styling