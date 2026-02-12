/**
 * ============================================
 * PREMIUM LANDING PAGE - INTERACTIVE EFFECTS
 * ============================================
 * 
 * This script adds:
 * - Smooth scroll-based parallax effects
 * - Mouse tracking for subtle interactive motion
 * - Performance-optimized animations using RequestAnimationFrame
 * - Graceful degradation for reduced motion preferences
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Parallax intensity (lower values = more subtle movement)
    parallaxIntensity: 0.02,
    
    // Mouse tracking smoothness (0-1, higher = smoother/slower)
    mouseSmoothness: 0.08,
    
    // Maximum mouse movement effect (in pixels)
    mouseMaxOffset: 20,
    
    // Feature toggles
    enableParallax: true,
    enableMouseTracking: true,
    enableScrollEffects: true
};

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    // Current scroll position
    scrollY: 0,
    
    // Mouse position (smoothed)
    mouseX: 0,
    mouseY: 0,
    
    // Target mouse position (actual)
    targetMouseX: 0,
    targetMouseY: 0,
    
    // Window dimensions
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    
    // Center points for calculations
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
    
    // Animation frame ID for cleanup
    rafId: null,
    
    // Reduced motion preference
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// ============================================
// DOM ELEMENT REFERENCES
// ============================================
const elements = {
    heroVisual: document.querySelector('.hero-visual'),
    abstractShape: document.querySelector('.abstract-shape'),
    shapeLayers: document.querySelectorAll('.shape-layer'),
    shapeCore: document.querySelector('.shape-core'),
    circles: document.querySelectorAll('.floating-circle'),
    headline: document.querySelector('.headline'),
    headlineLines: document.querySelectorAll('.headline-line'),
    scrollIndicator: document.querySelector('.scroll-indicator')
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Linear interpolation for smooth transitions
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/**
 * Map a value from one range to another
 * @param {number} value - Input value
 * @param {number} inMin - Input minimum
 * @param {number} inMax - Input maximum
 * @param {number} outMin - Output minimum
 * @param {number} outMax - Output maximum
 * @returns {number} Mapped value
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// ============================================
// SCROLL HANDLER
// ============================================

/**
 * Handle scroll events for parallax effects
 * Updates state and applies transformations based on scroll position
 */
function handleScroll() {
    // Update scroll position
    state.scrollY = window.scrollY;
    
    // Skip effects if user prefers reduced motion
    if (state.prefersReducedMotion || !CONFIG.enableParallax) return;
    
    // Calculate scroll progress (0 to 1 within viewport)
    const scrollProgress = Math.min(state.scrollY / state.windowHeight, 1);
    
    // Apply parallax to hero visual
    if (elements.heroVisual) {
        const parallaxY = state.scrollY * CONFIG.parallaxIntensity;
        const opacity = 1 - (scrollProgress * 0.5); // Fade out slightly on scroll
        
        elements.heroVisual.style.transform = `translateY(${parallaxY}px)`;
        elements.heroVisual.style.opacity = opacity;
    }
    
    // Apply different parallax speeds to floating circles for depth
    elements.circles.forEach((circle, index) => {
        // Each circle gets a slightly different speed
        const speed = CONFIG.parallaxIntensity + (index * 0.005);
        const yOffset = state.scrollY * speed;
        
        // Add subtle rotation based on scroll
        const rotation = state.scrollY * 0.03 * (index % 2 === 0 ? 1 : -1);
        
        circle.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg)`;
    });
    
    // Fade out headline on scroll
    if (elements.headline) {
        const headlineOpacity = 1 - (scrollProgress * 0.6);
        const headlineY = state.scrollY * 0.15;
        
        elements.headline.style.opacity = headlineOpacity;
        elements.headline.style.transform = `translateY(${headlineY}px)`;
    }
    
    // Hide scroll indicator when scrolled
    if (elements.scrollIndicator) {
        const indicatorOpacity = 1 - (scrollProgress * 2);
        elements.scrollIndicator.style.opacity = Math.max(0, indicatorOpacity);
    }
}

// ============================================
// MOUSE TRACKING
// ============================================

/**
 * Handle mouse move events for interactive motion
 * @param {MouseEvent} event - Mouse event
 */
function handleMouseMove(event) {
    // Skip if feature disabled or reduced motion preferred
    if (!CONFIG.enableMouseTracking || state.prefersReducedMotion) return;
    
    // Update target mouse position
    state.targetMouseX = event.clientX;
    state.targetMouseY = event.clientY;
}

/**
 * Apply mouse-based transformations to elements
 * Uses smooth interpolation for fluid movement
 */
function updateMouseEffects() {
    // Smoothly interpolate current mouse position toward target
    state.mouseX = lerp(state.mouseX, state.targetMouseX, CONFIG.mouseSmoothness);
    state.mouseY = lerp(state.mouseY, state.targetMouseY, CONFIG.mouseSmoothness);
    
    // Calculate offset from center (-1 to 1)
    const offsetX = (state.mouseX - state.centerX) / state.centerX;
    const offsetY = (state.mouseY - state.centerY) / state.centerY;
    
    // Apply subtle rotation to abstract shape based on mouse position
    if (elements.abstractShape) {
        const rotateX = offsetY * 6; // Tilt up/down
        const rotateY = offsetX * -6; // Tilt left/right
        const translateZ = 15; // Slight z-axis movement for depth
        
        elements.abstractShape.style.transform = `
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(${translateZ}px)
        `;
    }
    
    // Apply parallax movement to shape layers
    elements.shapeLayers.forEach((layer, index) => {
        // Each layer moves at different speeds for depth effect
        const depth = (index + 1) * 0.3;
        const moveX = offsetX * CONFIG.mouseMaxOffset * depth;
        const moveY = offsetY * CONFIG.mouseMaxOffset * depth;
        
        // Apply transform without overwriting existing animations
        layer.style.setProperty('--mouse-x', `${moveX}px`);
        layer.style.setProperty('--mouse-y', `${moveY}px`);
    });
    
    // Apply subtle movement to floating circles
    elements.circles.forEach((circle, index) => {
        const depth = 0.2 + (index * 0.08);
        const moveX = offsetX * CONFIG.mouseMaxOffset * depth;
        const moveY = offsetY * CONFIG.mouseMaxOffset * depth;
        
        // Get current transform and add mouse offset
        const currentTransform = circle.style.transform || '';
        circle.style.transform = `${currentTransform} translate(${moveX}px, ${moveY}px)`;
    });
}

// ============================================
// ANIMATION LOOP
// ============================================

/**
 * Main animation loop using RequestAnimationFrame
 * Ensures smooth 60fps animations
 */
function animate() {
    // Update mouse-based effects
    if (CONFIG.enableMouseTracking && !state.prefersReducedMotion) {
        updateMouseEffects();
    }
    
    // Continue animation loop
    state.rafId = requestAnimationFrame(animate);
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

/**
 * Handle window resize events
 * Updates state with new dimensions
 */
function handleResize() {
    state.windowHeight = window.innerHeight;
    state.windowWidth = window.innerWidth;
    state.centerX = state.windowWidth / 2;
    state.centerY = state.windowHeight / 2;
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all interactive effects
 * Sets up event listeners and starts animation loop
 */
function init() {
    console.log('🎨 Initializing premium landing page effects...');
    
    // Set initial mouse position to center
    state.mouseX = state.centerX;
    state.mouseY = state.centerY;
    state.targetMouseX = state.centerX;
    state.targetMouseY = state.centerY;
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial scroll handler call
    handleScroll();
    
    // Start animation loop if not preferring reduced motion
    if (!state.prefersReducedMotion) {
        animate();
    }
    
    console.log('✨ Effects initialized successfully');
}

// ============================================
// CLEANUP
// ============================================

/**
 * Clean up event listeners and animation frames
 * Called when page is unloaded
 */
function cleanup() {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    
    if (state.rafId) {
        cancelAnimationFrame(state.rafId);
    }
}

// Add cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// ============================================
// START THE EXPERIENCE
// ============================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already loaded
    init();
}

// ============================================
// ADDITIONAL ENHANCEMENTS
// ============================================

/**
 * Add smooth reveal on initial load
 * Prevents flash of unstyled content
 */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    console.log('🌟 Page fully loaded and visible');
});

/**
 * Log performance metrics (optional, for development)
 */
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page load time: ${pageLoadTime}ms`);
    });
}
