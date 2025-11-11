import React, { useEffect, useRef, useState } from 'react';
import './test2.css';

const Test2 = () => {
  const outerBubblesCount = 8;
  const innerBubblesCount = 4;
  const outerCircleRef = useRef(null);
  const innerCircleRef = useRef(null);
  const innerOrbitRef = useRef(null);
  const shootingStarRef = useRef(null);
  const [showStars, setShowStars] = useState(false);
  const [showShootingStars, setShowShootingStars] = useState(false);

  useEffect(() => {
    const outerCircle = outerCircleRef.current;
    const innerOrbit = innerOrbitRef.current;
    const innerCircle = innerCircleRef.current;
    
    if (outerCircle && innerCircle && innerOrbit) {
      // Increased rotation speed (decreased duration)
      outerCircle.style.animation = 'rotate 100s linear infinite'; // Faster
      innerOrbit.style.animation = 'rotate 140s linear infinite'; // Slower
      innerCircle.style.animation = 'glow 10s ease-in-out infinite';
    }

    // Delay showing stars
    const starsTimer = setTimeout(() => {
      setShowStars(true);
    }, 5500); // 5.5 seconds delay

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

  // Create stars for background
  const createStars = () => {
    return [...Array(350)].map((_, i) => (
      <div
        key={i}
        className="star"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          width: `${Math.random() * 1.6 + 0.4}px`,
          height: `${Math.random() * 1.6 + 0.4}px`,
          opacity: Math.random() * 0.7 + 0.2,
        }}
      />
    ));
  };

  return (
    <div className="full-page-container">
      {/* Stars background with conditional class for fade-in effect */}
      <div className={`stars-container ${showStars ? 'stars-visible' : ''}`}>
        {createStars()}
      </div>

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