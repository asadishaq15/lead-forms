import React, { useEffect, useRef } from 'react';
import './GradientWaves.css';

const GradientWaves = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Set canvas dimensions to match window size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Create gradient
    const createGradient = (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(width * 0.5, 0, width, height);
      gradient.addColorStop(0, '#0a2540'); // Deep navy blue
      gradient.addColorStop(0.4, '#5533ff'); // Purple
      gradient.addColorStop(0.6, '#e25950'); // Orange-red
      gradient.addColorStop(0.8, '#7b1fa2'); // Dark purple
      gradient.addColorStop(1, '#0a2540'); // Back to navy
      return gradient;
    };

    // Draw wave function
    const drawWave = (ctx, width, height, time) => {
      ctx.clearRect(0, 0, width, height);
      
      // Background fill
      ctx.fillStyle = '#0a2540';
      ctx.fillRect(0, 0, width, height);

      // Set the gradient for the waves
      ctx.fillStyle = createGradient(ctx, width, height);
      
      // Create multiple wave layers with different properties
      const waveParams = [
        { amplitude: 50, frequency: 0.01, speed: 0.002, start: 0.6 },
        { amplitude: 80, frequency: 0.007, speed: 0.0015, start: 0.7 },
        { amplitude: 40, frequency: 0.015, speed: 0.001, start: 0.8 }
      ];
      
      waveParams.forEach(wave => {
        ctx.beginPath();
        
        // Start point at top right (with some offset based on parameter)
        ctx.moveTo(width * wave.start, 0);
        
        // Draw top edge
        ctx.lineTo(width, 0);
        
        // Draw right edge
        ctx.lineTo(width, height);
        
        // Draw bottom edge
        ctx.lineTo(0, height);
        
        // Draw the wave curve - expanding from right to center as it moves down
        for (let y = 0; y <= height; y += 5) {
          // Calculate expanding width based on y position
          const expandFactor = Math.min(1, y / (height * 0.7));
          const xStart = Math.max(0, width * (wave.start - expandFactor * 0.5));
          
          // Calculate wave amplitude at this y position (larger toward bottom)
          const currentAmplitude = wave.amplitude * (0.5 + 0.5 * y / height);
          
          // Calculate x position with wave effect
          const waveOffset = Math.sin((y * wave.frequency) + (time * wave.speed)) * currentAmplitude;
          const x = xStart + waveOffset;
          
          // Add point to path
          if (y === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Close the path and fill
        ctx.closePath();
        ctx.fill();
      });
    };

    // Animation function
    const animate = () => {
      time += 1;
      drawWave(ctx, canvas.width, canvas.height, time);
      
      // Slow the animation down over time to match Stripe's subtle movement
      if (time < 500) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Only update occasionally for subtle movement
        if (time % 120 === 0) {
          time = 400; // Keep time in a range that produces subtle movement
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            animationFrameId = requestAnimationFrame(animate);
          }, 100);
        }
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="gradient-waves-canvas" />;
};

export default GradientWaves;