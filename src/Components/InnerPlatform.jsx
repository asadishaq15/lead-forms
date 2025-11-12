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
    const radius = 180;

    const innerBubblesData = [
      { name: "ORDER MANAGEMENT", position: "top" },
      { name: "MARKETPLACES & RETAIL CHANNELS", position: "right", extraText: "1P & 3P MARKETPLACES" },
      { name: "PORTALS", position: "bottom", extraText: "DISTRIBUTION CHANNELS" },
      { name: "FULFILLMENT & LOGISTICS", position: "left" },
    ];

    for (let i = 0; i < innerBubblesCount; i++) {
      const angle = (i / innerBubblesCount) * 2 * Math.PI - Math.PI / 4; // Start from top
      const x = Math.round(radius * Math.cos(angle));
      const y = Math.round(radius * Math.sin(angle));
      
      // Calculate connection line coordinates
      const lineLength = radius;
      const lineAngle = angle;
      const lineEndX = lineLength * Math.cos(lineAngle);
      const lineEndY = lineLength * Math.sin(lineAngle);

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
              width: `${radius}px`,
              transform: `rotate(${(angle * 180) / Math.PI}deg) translateX(${-radius / 2}px)`,
              left: `-${x}px`,
              top: `-${y}px`
            }}
          >
            <div className="energy-pulse"></div>
          </div>
          
          <div className="platform-bubble inner-bubble">
            <div className="bubble-content">{innerBubblesData[i].name}</div>
          </div>
          
          {/* Extra text below specific bubbles */}
          {innerBubblesData[i].extraText && (
            <div 
              className="bubble-extra-text"
              style={{
                transform: `rotate(${(-angle * 180) / Math.PI}deg)`,
                bottom: innerBubblesData[i].position === "bottom" ? "-40px" : "auto",
                right: innerBubblesData[i].position === "right" ? "-40px" : "auto"
              }}
            >
              {innerBubblesData[i].extraText}
            </div>
          )}
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

        <div className="orbit-path inner-orbit" />

        <div ref={innerOrbitRef} className="inner-orbit-circle">
          {createInnerBubbles()}
        </div>
      </div>
    </div>
  );
};

export default InnerPlatform;