import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PlatformzOrbital = () => {
  const shootingStarRef = useRef(null);

  // Shooting star logic
  const createShootingStar = () => {
    if (!shootingStarRef.current) return;
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.28) createShootingStar();
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const innerOrbitItems = [
    "GraphQL API Mesh",
    "Fulfillment & Logistics",
    "Marketplace & Retail Channel",
    "Onboarding & HR Platform",
    "Identity Auth Layer",
  ];

  const outerOrbitItems = [
    "Catalog & Product Data Hub",
    "Streaming Frameworks",
    "Brand & Creative Portal",
    "Analytics Data Warehouse",
    "Dealer & Distributor Portal",
    "Workflow Automation Engine",
    "Influencer & Referral Portal",
  ];

  const innerOrbitDuration = 240;
  const outerOrbitDuration = 180;

  return (
    <div className="relative">
      {/* Stars background */}
      <div className="absolute inset-0">
        <div className="stars-container">
          {[...Array(350)].map((_, i) => (
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
          ))}
        </div>
      </div>

      {/* Shooting stars */}
      <div ref={shootingStarRef} className="absolute inset-0 z-10" />

      {/* Main orbital system - fixed positioning */}
      <div className="orbit-system">
        {/* Orbit rings */}
        <div className="orbit-rings-container">
          <div className="inner-orbit-ring" />
          <div className="outer-orbit-ring" />
        </div>

        {/* Center element */}
        <motion.div
          className="platformz-center-container"
          animate={{
            scale: [1, 1.035, 1],
            opacity: [0.92, 1, 0.92],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
        >
          <div className="platformz-center">
            <div className="platformz-title">Platformz</div>
            <div className="platformz-subtitle">OS</div>
            <div className="platformz-desc">
              <p>Unified Business</p>
              <p>Operating</p>
              <p>System</p>
            </div>
          </div>
        </motion.div>

        {/* Inner orbit with fixed size and position */}
        <motion.div
          className="inner-orbit-container"
          animate={{ rotate: 360 }}
          transition={{
            duration: innerOrbitDuration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          {innerOrbitItems.map((item, index) => {
            // Distribute items evenly in a circle
            const angle = (index / innerOrbitItems.length) * 2 * Math.PI;
            // Inner orbit radius - must match the CSS (half of inner-orbit-ring width)
            const radius = 160; 
            
            // Calculate position based on angle and radius from center
            const x = 50 + Math.cos(angle) * radius / (window.innerWidth / 100);
            const y = 50 + Math.sin(angle) * radius / (window.innerHeight / 100);

            return (
              <motion.div
                key={index}
                className="orbit-item-wrapper"
                style={{
                  // Position as percentage of viewport to maintain stability
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                // Counter-rotate to keep text upright
                animate={{ rotate: -360 }}
                transition={{
                  duration: innerOrbitDuration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="orbit-sphere">
                  {item.split(' & ').length > 1 ? (
                    <>
                      <div>{item.split(' & ')[0]}</div>
                      <div>&</div>
                      <div>{item.split(' & ')[1]}</div>
                    </>
                  ) : (
                    item.split(' ').map((word, i) => <div key={i}>{word}</div>)
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Outer orbit with fixed size and position */}
        <motion.div
          className="outer-orbit-container"
          animate={{ rotate: 360 }}
          transition={{
            duration: outerOrbitDuration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          {outerOrbitItems.map((item, index) => {
            // Distribute items evenly in a circle
            const angle = (index / outerOrbitItems.length) * 2 * Math.PI;
            // Outer orbit radius - must match the CSS (half of outer-orbit-ring width)
            const radius = 320; 
            
            // Calculate position based on angle and radius from center
            const x = 50 + Math.cos(angle) * radius / (window.innerWidth / 100);
            const y = 50 + Math.sin(angle) * radius / (window.innerHeight / 100);

            return (
              <motion.div
                key={index}
                className="orbit-item-wrapper"
                style={{
                  // Position as percentage of viewport to maintain stability
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                // Counter-rotate to keep text upright
                animate={{ rotate: -360 }}
                transition={{
                  duration: outerOrbitDuration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="orbit-sphere">
                  {item.split(' & ').length > 1 ? (
                    <>
                      <div>{item.split(' & ')[0]}</div>
                      <div>&</div>
                      <div>{item.split(' & ')[1]}</div>
                    </>
                  ) : (
                    item.split(' ').map((word, i) => <div key={i}>{word}</div>)
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformzOrbital;