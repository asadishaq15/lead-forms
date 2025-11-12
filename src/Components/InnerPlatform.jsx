import React, { useEffect, useRef } from "react";
import "./inner-platform.css";

const InnerPlatform = () => {
  const innerBubblesCount = 4;
  const innerOrbitRef = useRef(null);
  const innerCircleRef = useRef(null);

  useEffect(() => {
    const innerOrbit = innerOrbitRef.current;
    const innerCircle = innerCircleRef.current;

    if (innerOrbit) {
      innerOrbit.style.animation = "rotate 140s linear infinite";
    }
    if (innerCircle) {
      innerCircle.style.animation = "glow 10s ease-in-out infinite";
    }
  }, []);

  const createInnerBubbles = () => {
    const bubbles = [];
    const orbitRadius = 230; // Distance from center to bubble centers
    const coreRadius = 110; // Core slim ring radius (220px / 2)
  
    const innerBubblesData = [
      { name: "ORDER MANAGEMENT", position: "top" },
      { 
        name: "MARKETPLACES & RETAIL CHANNELS", 
        position: "right",
        outerText: "1P & 3P MARKETPLACES"
      },
      { 
        name: "PORTALS", 
        position: "bottom",
        outerText: "DISTRIBUTION CHANNELS"
      },
      { name: "FULFILLMENT & LOGISTICS", position: "left" },
    ];
  
    for (let i = 0; i < innerBubblesCount; i++) {
      const angle = (i / innerBubblesCount) * 2 * Math.PI - Math.PI / 4; // Start from top
      const x = Math.round(orbitRadius * Math.cos(angle));
      const y = Math.round(orbitRadius * Math.sin(angle));
  
      // Calculate line length - distance from core ring to bubble position
      const lineLength = orbitRadius - coreRadius;
      
      // Determine if this bubble has outer text
      const hasOuterText = innerBubblesData[i].outerText;

      // Calculate outer text position - move it farther from the center
      const outerTextPositioning = () => {
        // Handle the PORTALS (bottom) and MARKETPLACES (right) differently
        if (innerBubblesData[i].position === "bottom") {
          return {
            position: 'absolute',
            width: '150px',
            textAlign: 'center',
            top: '70px',
            right: '90%',
            transform: 'translateX(-50%)',
            animation: 'counter-rotate 140s linear infinite'
          };
        } else if (innerBubblesData[i].position === "right") {
          return {
            position: 'absolute',
            width: '120px',
            textAlign: 'left',
            right: '-125px',
            top: '20%',
            transform: 'translateY(-50%)',
            animation: 'counter-rotate 140s linear infinite'
          };
        }
      };
  
      bubbles.push(
        <div
          className="platform-bubble-container"
          key={`inner-${i}`}
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          {/* Connection line */}
          <div
            className="connection-line"
            style={{
              width: `${lineLength}px`,
              transform: `rotate(${(angle * 180) / Math.PI + 180}deg)`, // +180 to point toward core
              transformOrigin: "0 0",
              position: "absolute",
              left: "0",
              top: "0",
            }}
          >
            <div className="energy-pulse"></div>
          </div>

          <div className="bubble-rot-wrapper">
            <div className="platform-bubble inner-bubble">
              <div className="bubble-label">{innerBubblesData[i].name}</div>
            </div>
  
            {/* Render outer text if present */}
            {hasOuterText && (
             <div 
             className={`outer-text ${innerBubblesData[i].position}`}
             style={outerTextPositioning()}
           >
             {innerBubblesData[i].outerText}
           </div>
            )}
          </div>
        </div>
      );
    }
  
    return bubbles;
  };
  

  return (
    <div className="full-page-container">
      <div className="orbital-platform-container inner-only">
        <div className="platform-core">
          <div className="core-slim-ring" />
          <div className="core-content">
            <div className="core-title">AI-AUTOMATED</div>
            <div className="core-title">OMNICHANNEL</div>
            <div className="core-title">PLATFORM</div>
          </div>
        </div>
        
        <div className="inner-solid-ring" />
        <div ref={innerOrbitRef} className="inner-orbit-circle">
          {createInnerBubbles()}
        </div>
      </div>
    </div>
  );
};

export default InnerPlatform;