import React, { useEffect, useRef, useState } from 'react';
import './test2.css';

const Test2 = () => {
  const outerBubblesCount = 8;
  const innerBubblesCount = 4;
  const outerCircleRef = useRef(null);
  const innerCircleRef = useRef(null);
  const innerOrbitRef = useRef(null);
  const shootingStarRef = useRef(null);

  // For background particle stars
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false, returning: false });
  const animationFrameRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Fade-in and shooting stars
  const [showStars, setShowStars] = useState(false);
  const [showShootingStars, setShowShootingStars] = useState(false);

  // --- Animate stars as particles on canvas ---
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setContainerDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;

      // Clear existing particles and recreate them
      particlesRef.current = [];
      initializeParticles();
    };

    // Initialize particles in clusters and some distributed
    const initializeParticles = () => {
      const particleCount = 400; // tune as needed
      const width = window.innerWidth;
      const height = window.innerHeight;
      const spreadRadius = Math.min(width, height) * 0.33;

      // Four clusters
      createChunk(width * 0.28, height * 0.22, particleCount * 0.25, spreadRadius);
      createChunk(width * 0.72, height * 0.20, particleCount * 0.22, spreadRadius);
      createChunk(width * 0.24, height * 0.78, particleCount * 0.20, spreadRadius);
      createChunk(width * 0.80, height * 0.74, particleCount * 0.21, spreadRadius);

      // Some random
      for (let i = 0; i < particleCount * 0.12; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particlesRef.current.push({
          x,
          y,
          size: 0.6 + Math.random() * 1.2,
          baseX: x,
          baseY: y,
          density: Math.random() * 30 + 1,
          color: `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.18})`,
          velocityX: 0,
          velocityY: 0,
          friction: 0.95,
        });
      }
    };

    const createChunk = (centerX, centerY, count, spread) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * spread;
        const x = Math.min(Math.max(centerX + Math.cos(angle) * radius, 0), width);
        const y = Math.min(Math.max(centerY + Math.sin(angle) * radius, 0), height);
        particlesRef.current.push({
          x,
          y,
          size: 0.7 + Math.random() * 1.1,
          baseX: x,
          baseY: y,
          density: Math.random() * 30 + 1,
          color: `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.26})`,
          velocityX: 0,
          velocityY: 0,
          friction: 0.96,
        });
      }
    };

    initializeParticles();

    // Mouse interaction
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
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
      particlesRef.current.forEach(p => {
        p.velocityX = 0;
        p.velocityY = 0;
      });
    };

    window.addEventListener('resize', updateDimensions);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Repulsion settings
      const REPULSION_RADIUS = 54;
      const REPULSION_STRENGTH = 3.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // draw
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 3;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // If we're in "returning" mode (mouse has left) - lerp positions directly
        if (!mouse.active && mouse.returning) {
          // smooth interpolation back to base position (no velocities used)
          const lerpFactor = 0.08;
          const dxBase = p.baseX - p.x;
          const dyBase = p.baseY - p.y;
          p.x += dxBase * lerpFactor;
          p.y += dyBase * lerpFactor;
          p.velocityX = 0;
          p.velocityY = 0;
          // snap if close
          if (Math.abs(dxBase) < 0.38 && Math.abs(dyBase) < 0.38) {
            p.x = p.baseX;
            p.y = p.baseY;
          }
          continue;
        }

        // Gentle pull to base
        p.velocityX += (p.baseX - p.x) * 0.0048;
        p.velocityY += (p.baseY - p.y) * 0.0048;

        // Mouse repulsion
        if (mouse.active) {
          const mx = mouse.x - p.x;
          const my = mouse.y - p.y;
          const mouseDistance = Math.sqrt(mx * mx + my * my);

          if (mouseDistance > 0 && mouseDistance < REPULSION_RADIUS) {
            const force = (REPULSION_RADIUS - mouseDistance) / REPULSION_RADIUS;
            const repulsionForce = force * REPULSION_STRENGTH;
            p.velocityX -= (mx / mouseDistance) * repulsionForce;
            p.velocityY -= (my / mouseDistance) * repulsionForce;
          }
        }

        // Apply velocity and friction
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.velocityX *= p.friction;
        p.velocityY *= p.friction;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (showStars) animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showStars, containerDimensions]);

  // Fade-in logic, shooting stars logic (unchanged)
  useEffect(() => {
    const outerCircle = outerCircleRef.current;
    const innerOrbit = innerOrbitRef.current;
    const innerCircle = innerCircleRef.current;

    if (outerCircle && innerCircle && innerOrbit) {
      outerCircle.style.animation = 'rotate 100s linear infinite';
      innerOrbit.style.animation = 'rotate 140s linear infinite';
      innerCircle.style.animation = 'glow 10s ease-in-out infinite';
    }

    // Delay showing stars (fade-in)
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
      { name: 'Onboarding & HR Platform' },
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
    <div
      className="full-page-container"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      {/* Particle canvas for background stars */}
      <canvas
        ref={canvasRef}
        className={`particle-canvas ${showStars ? 'stars-visible' : ''}`}
        style={{
          opacity: showStars ? 1 : 0,
          visibility: showStars ? 'visible' : 'hidden',
          transition: 'opacity 3s ease-in, visibility 3s ease-in',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Shooting stars container */}
      <div ref={shootingStarRef} className="shooting-stars-container" />

      <div className="orbital-platform-container">
        {/* Center platform core */}
        <div className="platform-core">
          <div className="core-foggy-bg"></div>
          <div className="core-title">Platformz OS</div>
          <div className="core-subtitle">
            Unified Business<br />
            Operating<br />
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