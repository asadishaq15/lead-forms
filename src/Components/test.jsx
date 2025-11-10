import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './PlatformzOrbital.css';

const PlatformzOrbital = () => {
  const shootingStarRef = useRef(null);

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

  // Inner orbit duration
  const innerOrbitDuration = 240;
  
  // Outer orbit duration (faster)
  const outerOrbitDuration = 180;

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Star background */}
      <div className="absolute inset-0 bg-black">
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

      {/* Shooting stars container */}
      <div ref={shootingStarRef} className="absolute inset-0 z-10" />

      {/* Full-screen container (keeps orbital coords consistent) */}
      <div className="absolute inset-0">
        {/* Orbital rings */}
        <div className="orbit-rings-container">
          <div className="inner-orbit-ring" />
          <div className="outer-orbit-ring" />
        </div>

        {/* Platform center (centered via CSS) */}
        <motion.div
          className="platformz-center-container z-30"
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

        {/* Inner orbit */}
        <motion.div
          className="inner-orbit-container"
          animate={{ rotate: 360 }}
          transition={{
            duration: innerOrbitDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {innerOrbitItems.map((item, index) => {
            const angle = (index / innerOrbitItems.length) * 2 * Math.PI;
            // Use exactly half the inner-orbit-ring width (320px ÷ 2)
            const radius = 160;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={index}
                className="orbit-item-wrapper"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
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

        {/* Outer orbit */}
        <motion.div
          className="outer-orbit-container"
          animate={{ rotate: 360 }}
          transition={{
            duration: outerOrbitDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {outerOrbitItems.map((item, index) => {
            const angle = (index / outerOrbitItems.length) * 2 * Math.PI;
            // Use exactly half the outer-orbit-ring width (640px ÷ 2)
            const radius = 320;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={index}
                className="orbit-item-wrapper"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
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