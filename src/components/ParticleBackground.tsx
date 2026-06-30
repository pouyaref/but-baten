import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
  trail: { x: number; y: number }[];
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const colors = [
      '#3b82f6', '#8b5cf6', '#06b6d4', '#6366f1', '#a855f7',
      '#ec4899', '#14b8a6', '#f59e0b', '#10b981', '#f472b6'
    ];
    
    const shapes: Particle['shape'][] = ['circle', 'square', 'triangle', 'star'];
    const particles: Particle[] = [];
    
    // کاهش تعداد ذرات در موبایل برای بهبود عملکرد
    const particleCount = isMobile 
      ? Math.min(30, Math.floor(window.innerWidth / 20))
      : Math.min(80, Math.floor(window.innerWidth / 12));

    for (let i = 0; i < particleCount; i++) {
      const size = isMobile ? Math.random() * 2 + 0.5 : Math.random() * 3 + 0.5;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: size,
        speedX: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.6),
        speedY: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.6),
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        trail: []
      });
    }

    // کاهش ذرات بزرگ در موبایل
    const bigParticlesCount = isMobile ? 3 : 8;
    const bigParticles = Array.from({ length: bigParticlesCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: isMobile ? Math.random() * 8 + 3 : Math.random() * 15 + 5,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.06 + 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.01 + 0.005,
      rotation: 0,
      rotationSpeed: 0,
      shape: 'circle' as const,
      trail: []
    }));

    const allParticles = [...particles, ...bigParticles];
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseRadius = isMobile ? 100 : 200;

    // Mouse tracking - فقط در دسکتاپ
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isMobile) {
        const touch = e.touches[0];
        if (touch) {
          mouseX = touch.clientX;
          mouseY = touch.clientY;
        }
      }
    };

    const handleTouchEnd = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    let animId: number;

    const drawShape = (ctx: CanvasRenderingContext2D, shape: Particle['shape'], x: number, y: number, size: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      switch(shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          break;
        case 'square':
          ctx.beginPath();
          ctx.rect(-size, -size, size * 2, size * 2);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -size * 1.5);
          ctx.lineTo(-size * 1.3, size);
          ctx.lineTo(size * 1.3, size);
          ctx.closePath();
          break;
        case 'star':
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? size * 1.5 : size * 0.6;
            const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
            if (i === 0) ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          }
          ctx.closePath();
          break;
      }
      
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections - کاهش در موبایل
      const connectionDist = isMobile ? 80 : 150;
      const bigConnectionDist = isMobile ? 150 : 250;
      
      for (let i = 0; i < allParticles.length; i++) {
        for (let j = i + 1; j < allParticles.length; j++) {
          const dx = allParticles[i].x - allParticles[j].x;
          const dy = allParticles[i].y - allParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = allParticles[i].size > 5 || allParticles[j].size > 5 ? bigConnectionDist : connectionDist;

          if (dist < maxDist) {
            const opacity = isMobile 
              ? 0.04 * (1 - dist / maxDist)
              : 0.08 * (1 - dist / maxDist);
            
            if (opacity > 0.01) {
              const gradient = ctx.createLinearGradient(
                allParticles[i].x, allParticles[i].y,
                allParticles[j].x, allParticles[j].y
              );
              gradient.addColorStop(0, allParticles[i].color + Math.round(opacity * 255).toString(16).padStart(2, '0'));
              gradient.addColorStop(1, allParticles[j].color + Math.round(opacity * 255).toString(16).padStart(2, '0'));
              
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = isMobile ? 0.5 : 0.8;
              ctx.moveTo(allParticles[i].x, allParticles[i].y);
              ctx.lineTo(allParticles[j].x, allParticles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Mouse interaction - فقط در دسکتاپ
      if (!isMobile && mouseX > 0 && mouseY > 0) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, mouseRadius);
        gradient.addColorStop(0, 'rgba(59,130,246,0.05)');
        gradient.addColorStop(1, 'rgba(59,130,246,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw particles
      allParticles.forEach((p) => {
        p.pulse += p.pulseSpeed;
        const pulseSize = 1 + Math.sin(p.pulse) * (isMobile ? 0.2 : 0.3);
        const currentSize = p.size * pulseSize;

        p.rotation += p.rotationSpeed;

        // کاهش trail در موبایل
        const maxTrail = isMobile ? 4 : 8;
        if (p.trail.length > maxTrail) p.trail.shift();
        p.trail.push({ x: p.x, y: p.y });

        // Draw trail - کاهش در موبایل
        if (!isMobile) {
          p.trail.forEach((t, index) => {
            const opacity = (index / p.trail.length) * p.opacity * 0.3;
            ctx.beginPath();
            ctx.arc(t.x, t.y, currentSize * (index / p.trail.length) * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.round(opacity * 255).toString(16).padStart(2, '0');
            ctx.fill();
          });
        }

        const currentOpacity = p.opacity * (0.8 + Math.sin(p.pulse) * 0.2);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size > 5 ? (isMobile ? 10 : 20) : (isMobile ? 4 : 8);
        
        drawShape(ctx, p.shape, p.x, p.y, currentSize, p.rotation);
        ctx.fillStyle = p.color + Math.round(currentOpacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Glow for big particles - کاهش در موبایل
        if (p.size > 5 && !isMobile) {
          ctx.shadowBlur = 40;
          ctx.globalAlpha = 0.3;
          drawShape(ctx, p.shape, p.x, p.y, currentSize * 1.5, p.rotation);
          ctx.fillStyle = p.color + '20';
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        
        ctx.shadowBlur = 0;

        // Mouse/touch interaction
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius && mouseX > 0 && mouseY > 0) {
          const force = (mouseRadius - dist) / mouseRadius * (isMobile ? 0.3 : 0.5);
          p.x += dx / dist * force;
          p.y += dy / dist * force;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        const margin = isMobile ? 20 : 50;
        if (p.x < margin) { p.x = margin; p.speedX *= -1; }
        if (p.x > canvas.width - margin) { p.x = canvas.width - margin; p.speedX *= -1; }
        if (p.y < margin) { p.y = margin; p.speedY *= -1; }
        if (p.y > canvas.height - margin) { p.y = canvas.height - margin; p.speedY *= -1; }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: 0,
          background: 'radial-gradient(ellipse at center, rgba(10,15,31,0.8), rgba(5,9,20,0.95))'
        }}
      />
      {/* گرادیانت‌های پس‌زمینه - ساده‌تر در موبایل */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: `
            radial-gradient(circle at 0% 50%, rgba(59,130,246,${isMobile ? 0.02 : 0.03}), transparent 50%),
            radial-gradient(circle at 100% 50%, rgba(139,92,246,${isMobile ? 0.02 : 0.03}), transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(6,182,212,${isMobile ? 0.01 : 0.02}), transparent 50%)
          `
        }}
      />
    </>
  );
}