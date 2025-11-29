// Resume Wizard Application
class ResumeWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5; // Updated to 5 steps
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateUI();
        this.initTimelineAnimations();
    }
    
    bindEvents() {
        // Navigation buttons
        const backBtn = document.getElementById('back-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goToPreviousStep());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.goToNextStep());
        }
        
        // Timeline step clicks
        const timelineSteps = document.querySelectorAll('.timeline-step');
        timelineSteps.forEach((step, index) => {
            step.addEventListener('click', () => this.goToStep(index + 1));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }
    
    handleKeyNavigation(event) {
        if (this.isAnimating) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.goToPreviousStep();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.goToNextStep();
                break;
            case 'Home':
                event.preventDefault();
                this.goToStep(1);
                break;
            case 'End':
                event.preventDefault();
                this.goToStep(this.totalSteps);
                break;
        }
    }
    
    goToNextStep() {
        if (this.currentStep < this.totalSteps && !this.isAnimating) {
            this.goToStep(this.currentStep + 1);
        }
    }
    
    goToPreviousStep() {
        if (this.currentStep > 1 && !this.isAnimating) {
            this.goToStep(this.currentStep - 1);
        }
    }
    
    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps || stepNumber === this.currentStep || this.isAnimating) {
            return;
        }
        
        this.isAnimating = true;
        const previousStep = this.currentStep;
        this.currentStep = stepNumber;
        
        // Animate section transition
        this.animateStepTransition(previousStep, stepNumber).then(() => {
            this.isAnimating = false;
            // Trigger timeline animations for experience section
            if (stepNumber === 2) {
                this.animateTimelineItems();
            }
        });
        
        this.updateUI();
    }
    
    async animateStepTransition(fromStep, toStep) {
        const currentSection = document.getElementById(`section-${fromStep}`);
        const nextSection = document.getElementById(`section-${toStep}`);
        
        if (!currentSection || !nextSection) return;
        
        // Determine animation direction
        const isMovingForward = toStep > fromStep;
        
        // Hide current section with animation
        currentSection.style.transform = isMovingForward ? 'translateX(-20px)' : 'translateX(20px)';
        currentSection.style.opacity = '0';
        
        // Wait for animation
        await this.delay(150);
        
        // Switch sections
        currentSection.classList.remove('active');
        nextSection.classList.add('active');
        
        // Set initial state for next section
        nextSection.style.transform = isMovingForward ? 'translateX(20px)' : 'translateX(-20px)';
        nextSection.style.opacity = '0';
        
        // Trigger reflow
        nextSection.offsetHeight;
        
        // Animate in next section
        nextSection.style.transform = 'translateX(0)';
        nextSection.style.opacity = '1';
        
        // Wait for animation to complete
        await this.delay(250);
    }
    
    initTimelineAnimations() {
        // Reset timeline animations when page loads
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        });
    }
    
    animateTimelineItems() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'all 0.6s ease-out';
            }, index * 100);
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    updateUI() {
        this.updateProgressIndicator();
        this.updateTimelineSteps();
        this.updateNavigationButtons();
        this.updateSectionVisibility();
    }
    
    updateProgressIndicator() {
        const currentStepElement = document.getElementById('current-step');
        const progressFill = document.getElementById('progress-fill');
        
        if (currentStepElement) {
            currentStepElement.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
        
        if (progressFill) {
            const progressPercentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }
    }
    
    updateTimelineSteps() {
        const timelineSteps = document.querySelectorAll('.timeline-step');
        
        timelineSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            // Remove all state classes
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
                step.setAttribute('aria-current', 'step');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                step.removeAttribute('aria-current');
            } else {
                step.removeAttribute('aria-current');
            }
            
            // Update accessibility
            step.setAttribute('aria-label', `${step.querySelector('.timeline-label').textContent} - Step ${stepNumber}${stepNumber === this.currentStep ? ' (current)' : stepNumber < this.currentStep ? ' (completed)' : ''}`);
        });
    }
    
    updateNavigationButtons() {
        const backBtn = document.getElementById('back-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (backBtn) {
            backBtn.disabled = this.currentStep === 1;
            backBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentStep === this.totalSteps;
            
            if (this.currentStep === this.totalSteps) {
                nextBtn.innerHTML = '<i class="fas fa-check"></i> Complete';
                nextBtn.classList.add('btn--success');
            } else {
                nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
                nextBtn.classList.remove('btn--success');
            }
        }
    }
    
    updateSectionVisibility() {
        // This is handled by CSS, but we ensure proper initial state
        const sections = document.querySelectorAll('.content-section');
        sections.forEach((section, index) => {
            const stepNumber = index + 1;
            if (stepNumber === this.currentStep) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    // Public methods for external access
    getCurrentStep() {
        return this.currentStep;
    }
    
    getTotalSteps() {
        return this.totalSteps;
    }
    
    getProgress() {
        return (this.currentStep / this.totalSteps) * 100;
    }
}

// Enhanced interaction features
class InteractionEnhancer {
    constructor(wizard) {
        this.wizard = wizard;
        this.init();
    }
    
    init() {
        this.addHoverEffects();
        this.addFocusManagement();
        this.addScrollToTop();
        this.addClickAnimations();
        this.addTimelineHoverEffects();
    }
    
    addHoverEffects() {
        // Enhanced hover effects for timeline steps
        const timelineSteps = document.querySelectorAll('.timeline-step');
        timelineSteps.forEach(step => {
            step.addEventListener('mouseenter', () => {
                if (!step.classList.contains('active')) {
                    step.style.transform = 'translateY(-2px)';
                }
            });
            
            step.addEventListener('mouseleave', () => {
                if (!step.classList.contains('active')) {
                    step.style.transform = 'translateY(0)';
                }
            });
        });
        
        // Enhanced hover effects for cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = 'var(--shadow-lg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-sm)';
            });
        });
    }
    
    addTimelineHoverEffects() {
        // Enhanced hover effects for experience timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            const timelineContent = item.querySelector('.timeline-content');
            const timelineDot = item.querySelector('.timeline-dot-exp');
            
            item.addEventListener('mouseenter', () => {
                timelineDot.style.transform = 'scale(1.1)';
                timelineDot.style.boxShadow = '0 8px 25px rgba(var(--color-teal-500-rgb), 0.3)';
            });
            
            item.addEventListener('mouseleave', () => {
                timelineDot.style.transform = 'scale(1)';
                timelineDot.style.boxShadow = 'var(--shadow-md)';
            });
        });
    }
    
    addFocusManagement() {
        // Focus management for accessibility
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const currentSection = document.querySelector('.content-section.active');
                if (currentSection) {
                    const focusable = currentSection.querySelectorAll(focusableElements);
                    const firstFocusable = focusable[0];
                    const lastFocusable = focusable[focusable.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        });
    }
    
    addScrollToTop() {
        // Scroll to top when changing sections
        const originalGoToStep = this.wizard.goToStep.bind(this.wizard);
        this.wizard.goToStep = function(stepNumber) {
            originalGoToStep(stepNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }
    
    addClickAnimations() {
        // Add subtle click animations to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

// Analytics and tracking (placeholder for future enhancement)
class WizardAnalytics {
    constructor(wizard) {
        this.wizard = wizard;
        this.startTime = Date.now();
        this.stepTimes = {};
        this.init();
    }
    
    init() {
        this.trackStepChanges();
    }
    
    trackStepChanges() {
        const originalGoToStep = this.wizard.goToStep.bind(this.wizard);
        this.wizard.goToStep = (stepNumber) => {
            const currentStep = this.wizard.getCurrentStep();
            const currentTime = Date.now();
            
            // Track time spent on current step
            if (!this.stepTimes[currentStep]) {
                this.stepTimes[currentStep] = 0;
            }
            
            if (this.lastStepTime) {
                this.stepTimes[currentStep] += currentTime - this.lastStepTime;
            }
            
            this.lastStepTime = currentTime;
            
            // Call original method
            originalGoToStep(stepNumber);
            
            // Log step change (in production, this would send to analytics service)
            console.log(`Navigation: Step ${currentStep} → Step ${stepNumber}`);
        };
        
        this.lastStepTime = Date.now();
    }
    
    getSessionData() {
        return {
            totalTime: Date.now() - this.startTime,
            stepTimes: this.stepTimes,
            currentStep: this.wizard.getCurrentStep(),
            completionRate: this.wizard.getProgress()
        };
    }
}

// Timeline Animation Controller
class TimelineAnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.init();
    }
    
    init() {
        // Use Intersection Observer for scroll-based animations
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        }
        
        // Add staggered animations for tech tags
        this.animateTechTags();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);
        
        // Observe timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => observer.observe(item));
        
        // Observe cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => observer.observe(card));
    }
    
    animateTechTags() {
        const techTags = document.querySelectorAll('.tech-tag, .skill-tag');
        techTags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 50}ms`;
        });
    }
}

// CSS for ripple effect and additional animations
const additionalStyles = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: rippleEffect 0.6s linear;
    pointer-events: none;
}

@keyframes rippleEffect {
    to {
        transform: scale(2);
        opacity: 0;
    }
}

.btn--success {
    background: var(--color-success) !important;
}

.btn--success:hover {
    background: var(--color-success) !important;
    opacity: 0.9;
}

.animate-in {
    animation: slideInFromLeft 0.6s ease-out forwards;
}

@keyframes slideInFromLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.tech-tag,
.skill-tag {
    animation: fadeInScale 0.4s ease-out forwards;
    opacity: 0;
}

@keyframes fadeInScale {
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Timeline line animation */
.timeline-line {
    animation: growLine 1s ease-out 0.5s forwards;
    transform-origin: top;
    transform: scaleY(0);
}

@keyframes growLine {
    to {
        transform: scaleY(1);
    }
}

/* Loading states */
.timeline-item {
    will-change: transform, opacity;
}

.timeline-dot-exp {
    will-change: transform, box-shadow;
}

/* Smooth hover transitions */
.timeline-content,
.card {
    will-change: transform, box-shadow;
}
`;

// Add additional styles to document
const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main wizard
    const wizard = new ResumeWizard();
    
    // Add interaction enhancements
    new InteractionEnhancer(wizard);
    
    // Add timeline animations
    new TimelineAnimationController();
    
    // Add analytics (optional)
    const analytics = new WizardAnalytics(wizard);
    
    // Global reference for debugging (remove in production)
    window.resumeWizard = {
        wizard,
        analytics,
        getSessionData: () => analytics.getSessionData()
    };
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
        
        // Trigger initial timeline animation if on experience section
        if (wizard.getCurrentStep() === 2) {
            wizard.animateTimelineItems();
        }
    }, 100);
    
    console.log('Resume Wizard with Timeline Experience initialized successfully');
});