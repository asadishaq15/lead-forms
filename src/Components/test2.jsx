import React, { useEffect, useRef, useState } from 'react';
import './test2.css';

const Test2 = () => {
  const outerBubblesCount = 8;
  const innerBubblesCount = 4;
  const outerCircleRef = useRef(null);
  const innerCircleRef = useRef(null);
  const innerOrbitRef = useRef(null);
  const shootingStarRef = useRef(null);
  
  // For stars
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false, returning: false });
  const requestRef = useRef(null);
  const previousTimeRef = useRef(0);
  
  const [showStars, setShowStars] = useState(false);
  const [showShootingStars, setShowShootingStars] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // Initialize stars and canvas
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recreate particles when resize
      initParticles();
      setCanvasReady(true);
    };

    const initParticles = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const particles = [];
      const particleCount = Math.min(500, Math.floor((width * height) / 2000));
      
      // Create particles in a more distributed pattern
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          size: 0.6 + Math.random() * 1.2,
          baseX: x,
          baseY: y,
          density: Math.random() * 20 + 5,
          color: `rgba(59, 130, 246, ${Math.random() * 0.45 + 0.25})`,
          velocityX: 0,
          velocityY: 0,
        });
      }
      
      particlesRef.current = particles;
    };

    // Mouse interactions
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
        returning: false,
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.returning = true;
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial setup
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!showStars || !canvasReady || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Constants for performance
    const REPULSION_RADIUS = 40;
    const REPULSION_STRENGTH = 6;
    const RETURN_SPEED = 0.04;
    const FRICTION = 0.95;
    
    const animate = (timestamp) => {
      if (!canvas) return;
      
      // Time-based animation for consistent speed
      const deltaTime = timestamp - (previousTimeRef.current || timestamp);
      previousTimeRef.current = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get current state
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      
      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Draw particle with slight glow
        ctx.save();
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Handle particle movement
        if (mouse.returning) {
          // Smooth return to base position
          const dxBase = p.baseX - p.x;
          const dyBase = p.baseY - p.y;
          p.x += dxBase * RETURN_SPEED;
          p.y += dyBase * RETURN_SPEED;
          
          // Reset velocity
          p.velocityX = 0;
          p.velocityY = 0;
          
          // Snap if very close to avoid floating point issues
          if (Math.abs(dxBase) < 0.3 && Math.abs(dyBase) < 0.3) {
            p.x = p.baseX;
            p.y = p.baseY;
          }
          continue;
        }
        
        // Small pull back to original position
        p.velocityX += (p.baseX - p.x) * 0.003;
        p.velocityY += (p.baseY - p.y) * 0.003;
        
        // Mouse repulsion
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < REPULSION_RADIUS && distance > 0) {
            // Normalized direction vector times repulsion strength
            const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            p.velocityX -= dirX * force * REPULSION_STRENGTH;
            p.velocityY -= dirY * force * REPULSION_STRENGTH;
          }
        }
        
        // Apply velocity with friction
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.velocityX *= FRICTION;
        p.velocityY *= FRICTION;
      }
      
      // Continue animation loop
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = 0;
    };
  }, [showStars, canvasReady]);

  // Main component setup
  useEffect(() => {
    const outerCircle = outerCircleRef.current;
    const innerOrbit = innerOrbitRef.current;
    const innerCircle = innerCircleRef.current;
    
    if (outerCircle && innerCircle && innerOrbit) {
      outerCircle.style.animation = 'rotate 100s linear infinite';
      innerOrbit.style.animation = 'rotate 140s linear infinite';
      innerCircle.style.animation = 'glow 10s ease-in-out infinite';
    }

    // Delay showing stars
    const starsTimer = setTimeout(() => {
      setShowStars(true);
    }, 5500);

    const shootingStarsVisibilityTimer = setTimeout(() => {
      setShowShootingStars(true);
    }, 6000);
    
    // Shooting star logic
    const createShootingStar = () => {
      if (!shootingStarRef.current || !showShootingStars) return;
      const container = shootingStarRef.current;
      const star = document.createElement('div');
      star.classList.add('shooting-star');
      const startX = Math.random() * 80;
      const startY = Math.random() * 40;
      const length = Math.random() * 120 + 60;
      star.style.left = `${startX}%`;
      star.style.top = `${startY}%`;
      star.style.width = `${length}px`;
      container.appendChild(star);
      setTimeout(() => star.remove(), 800);
    };

    // Delay shooting stars to start with the background stars
    const shootingStarsTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (Math.random() < 0.28) createShootingStar();
      }, 900);
      
      return () => clearInterval(interval);
    }, 6000);
  
    return () => {
      clearTimeout(starsTimer);
      clearTimeout(shootingStarsTimer);
      clearTimeout(shootingStarsVisibilityTimer);
    };
  }, [showShootingStars]); 

  // Create the outer platform bubbles
  const createOuterBubbles = () => {
    const bubbles = [];
    const radius = 350;
    
    const outerBubblesData = [
      { name: 'Brand & Creative Portal' },
      { name: 'Dealer & Distributive Portal' },
      { name: 'Influencer & Referral Portal' },
      { name: 'Marketplace & Retail Channel' },
      { name: 'Industrial Design & Manufacturing' },
      { name: 'Fulfillment & Logistics' },
      { name: 'Onboarding & HR Platform' },
      { name: 'Streaming Frameworks' }
    ];
    
    for (let i = 0; i < outerBubblesCount; i++) {
      const angle = (i / outerBubblesCount) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      bubbles.push(
        <div 
          className="platform-bubble-container" 
          key={`outer-${i}`} 
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <div className="platform-bubble">
            <div className="bubble-content">
              {outerBubblesData[i].name}
            </div>
          </div>
        </div>
      );
    }
    
    return bubbles;
  };

  // Create the inner platform bubbles
  const createInnerBubbles = () => {
    const bubbles = [];
    const radius = 220;
    
    const innerBubblesData = [
      { name: 'Analytics Data Warehouse' },
      { name: 'Identity  Auth Layer' },
      { name: 'GraphQL API Mesh' },
      { name: 'Workflow Automation Engine' }
    ];
    
    for (let i = 0; i < innerBubblesCount; i++) {
      const angle = (i / innerBubblesCount) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      bubbles.push(
        <div 
          className="platform-bubble-container" 
          key={`inner-${i}`} 
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <div className="platform-bubble inner-bubble">
            <div className="bubble-content">
              {innerBubblesData[i].name}
            </div>
          </div>
        </div>
      );
    }
    
    return bubbles;
  };

  return (
    <div className="full-page-container" ref={containerRef}>
      {/* Canvas for interactive stars */}
      <canvas
        ref={canvasRef}
        className={`star-canvas ${showStars ? 'stars-visible' : ''}`}
      />

      {/* Shooting stars container */}
      <div ref={shootingStarRef} className="shooting-stars-container" />
      
      <div className="orbital-platform-container">
        
        {/* Center platform core */}
        <div className="platform-core">
          <div className="core-foggy-bg"></div>
          <div className="core-title">Platformz OS</div>
          <div className="core-subtitle">
            Unified Business<br/>
            Operating<br/>
            System
          </div>
        </div>
        
        {/* Outer circle (visible orbit) */}
        <div className="orbit-path outer-orbit"></div>
        
        {/* Inner circle (visible orbit) */}
        <div className="orbit-path inner-orbit"></div>
        
        {/* Rotating containers */}
        <div ref={outerCircleRef} className="outer-circle">
          {createOuterBubbles()}
        </div>
        <div className="orbit-fog" />
        {/* Inner orbit rotating container */}
        <div ref={innerOrbitRef} className="inner-orbit-circle">
          {createInnerBubbles()}
        </div>
        
        {/* Inner glow effect */}
        <div ref={innerCircleRef} className="inner-glow"></div>
      </div>
    </div>
  );
};

export default Test2;