import { memo, useState, useEffect } from 'react';
import { DollarSign, Shield, Sword, Microscope, Flame } from 'lucide-react';

/**
 * Onboarding Left Panel Illustrations
 * Dynamic SVG illustrations for each onboarding step
 * Theme: Cybersecurity, Hacking Lab, Bug Bounty
 */

// Welcome: Lab setup with terminal
function WelcomeIllustration() {
  const [lines, setLines] = useState([
    { text: '', type: 'command' }
  ]);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Hacking Sequence
  useEffect(() => {
    let mounted = true;
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const addLine = (text, color = '#9FEF00', opacity = 1) => {
      if (!mounted) return;
      setLines(prev => {
        const newLines = [...prev, { text, color, opacity }];
        return newLines.slice(-9); // Keep last 9 lines visible for taller terminal
      });
    };

    const typeCommand = async (cmd) => {
      if (!mounted) return;
      const base = "$ ";
      for (let i = 0; i <= cmd.length; i++) {
        if (!mounted) return;
        setLines(prev => {
          const current = prev.slice(-9);
          if (current.length > 0 && current[current.length - 1].isTyping) {
             const updated = [...current];
             updated[updated.length - 1] = { text: base + cmd.slice(0, i), color: '#9FEF00', isTyping: true };
             return updated;
          }
          return [...current, { text: base + cmd.slice(0, i), color: '#9FEF00', isTyping: true }];
        });
        await wait(Math.random() * 40 + 20); // Faster typing
      }
      setLines(prev => {
        const copy = [...prev];
        if (copy.length > 0) copy[copy.length - 1].isTyping = false;
        return copy;
      });
    };

    const runSequence = async () => {
      setLines([]);
      await wait(500);

      // 1. Init
      await typeCommand("bugora init");
      await wait(300);
      addLine("[OK] Workspace ready", "#9FEF00", 0.8);
      await wait(400);

      // 2. Recon
      await typeCommand("nmap -T4 target_sys");
      await wait(300);
      addLine("Starting Nmap 7.92...", "#9FEF00", 0.6);
      await wait(200);
      addLine("Discovered open port 22/tcp (ssh)", "#FFBD2E");
      await wait(150);
      addLine("Discovered open port 80/tcp (http)", "#FFBD2E");
      await wait(500);

      // 3. Exploit
      await typeCommand("run exploit/auth_bypass");
      await wait(400);
      addLine("[*] Started reverse TCP handler", "#9FEF00", 0.8);
      await wait(300);
      addLine("[*] Sending stage (179 bytes)", "#27C93F");
      await wait(300);
      addLine("[*] Meterpreter session 1 opened", "#27C93F");
      await wait(500);

      // 4. Access
      await typeCommand("whoami");
      await wait(300);
      addLine("root", "#FF5F56", 1);
      await wait(400);
      addLine("ACCESS GRANTED", "#9FEF00", 1);
      
      await wait(200);
      setLines(prev => [...prev, { text: "$ _", color: '#9FEF00', isPrompt: true }]);
    };

    runSequence();
    return () => { mounted = false; };
  }, []);

  return (
    <svg viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="onboarding-illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="welcomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9FEF00" />
          <stop offset="100%" stopColor="#7BC100" />
        </linearGradient>
        <radialGradient id="welcomeGlow">
          <stop offset="0%" stopColor="#9FEF00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9FEF00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central Terminal Window - WIDER & TALLER */}
      <g className="terminal-window" transform="translate(80, 130)">
        {/* Window Frame */}
        <rect x="0" y="0" width="340" height="420" rx="8" fill="none" stroke="url(#welcomeGradient)" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="30" rx="8" fill="rgba(159, 239, 0, 0.1)" />

        {/* Window Buttons */}
        <circle cx="15" cy="15" r="4" fill="#FF5F56" />
        <circle cx="30" cy="15" r="4" fill="#FFBD2E" />
        <circle cx="45" cy="15" r="4" fill="#27C93F" />

        {/* Terminal Text Lines */}
        {lines.map((line, index) => (
          <text 
            key={index} 
            x="15" 
            y={60 + (index * 22)} 
            fontSize="11" 
            fill={line.color || "#9FEF00"} 
            fontFamily="monospace" 
            className="terminal-text"
            opacity={line.opacity || 1}
          >
            {line.text === "$ _" ? (
              <>
                $ <tspan opacity={cursorVisible ? 1 : 0}>_</tspan>
              </>
            ) : line.text}
          </text>
        ))}
      </g>

      {/* Floating Code Symbols */}
      <g className="floating-symbols" opacity="0.3">
        <text x="50" y="120" fontSize="24" fill="#9FEF00" className="code-bracket">&lt;/&gt;</text>
        <text x="450" y="200" fontSize="24" fill="#9FEF00" className="code-bracket">{ }</text>
        <text x="80" y="580" fontSize="20" fill="#9FEF00" className="code-bracket">[ ]</text>
        <text x="420" y="550" fontSize="20" fill="#9FEF00" className="code-bracket">$</text>
      </g>

      {/* Circuit Lines */}
      <g className="circuit-lines" opacity="0.2">
        <path d="M 80 130 L 30 130 L 30 100" stroke="#9FEF00" strokeWidth="2" fill="none" className="circuit-line" />
        <path d="M 420 550 L 470 550 L 470 600" stroke="#9FEF00" strokeWidth="2" fill="none" className="circuit-line" />
      </g>

      {/* Glow Effect */}
      <circle cx="250" cy="300" r="200" fill="url(#welcomeGlow)" />
    </svg>
  );
}

// Goal: Target with pathways
function GoalIllustration() {
  return (
    <svg viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="onboarding-illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9FEF00" />
          <stop offset="100%" stopColor="#7BC100" />
        </linearGradient>
        <radialGradient id="goalGlow">
          <stop offset="0%" stopColor="#9FEF00" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9FEF00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central Target */}
      <g className="target-center" transform="translate(250, 300)">
        <circle cx="0" cy="0" r="160" fill="url(#goalGlow)" className="shield-glow" />
        <circle cx="0" cy="0" r="100" fill="none" stroke="#9FEF00" strokeWidth="3" opacity="0.2" />
        <circle cx="0" cy="0" r="70" fill="none" stroke="#9FEF00" strokeWidth="3" opacity="0.4" />
        <circle cx="0" cy="0" r="40" fill="none" stroke="#9FEF00" strokeWidth="3" opacity="0.6" />
        <circle cx="0" cy="0" r="15" fill="#9FEF00" opacity="0.8" className="shield-glow" />

        {/* Crosshair */}
        <line x1="-120" y1="0" x2="120" y2="0" stroke="#9FEF00" strokeWidth="2" opacity="0.5" />
        <line x1="0" y1="-120" x2="0" y2="120" stroke="#9FEF00" strokeWidth="2" opacity="0.5" />
      </g>

      {/* Pathways */}
      <g className="pathways">
        {/* Bug Bounty Path */}
        <g transform="translate(70, 110)">
          <circle cx="0" cy="0" r="28" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="2" />
          <foreignObject x="-12" y="-12" width="24" height="24">
            <DollarSign size={24} color="#9FEF00" />
          </foreignObject>
          <path d="M 28 18 L 140 180" stroke="#9FEF00" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" className="circuit-line" />
        </g>

        {/* Security Analyst Path */}
        <g transform="translate(430, 150)">
          <circle cx="0" cy="0" r="28" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="2" />
          <foreignObject x="-12" y="-12" width="24" height="24">
            <Shield size={24} color="#9FEF00" />
          </foreignObject>
          <path d="M -28 18 L -120 140" stroke="#9FEF00" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" className="circuit-line" />
        </g>

        {/* Pentester Path */}
        <g transform="translate(110, 490)">
          <circle cx="0" cy="0" r="28" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="2" />
          <foreignObject x="-12" y="-12" width="24" height="24">
            <Sword size={24} color="#9FEF00" />
          </foreignObject>
          <path d="M 28 -18 L 110 -150" stroke="#9FEF00" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" className="circuit-line" />
        </g>

        {/* Researcher Path */}
        <g transform="translate(390, 450)">
          <circle cx="0" cy="0" r="28" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="2" />
          <foreignObject x="-12" y="-12" width="24" height="24">
            <Microscope size={24} color="#9FEF00" />
          </foreignObject>
          <path d="M -18 -28 L -90 -120" stroke="#9FEF00" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" className="circuit-line" />
        </g>
      </g>

      {/* Particles */}
      <g className="onboarding-particles">
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx={100 + i * 60}
            cy={100 + (i % 2) * 600}
            r="2"
            fill="#9FEF00"
            opacity="0.6"
            className="onboarding-particle"
            style={{
              '--tx': `${Math.random() * 200 - 100}px`,
              '--ty': `${Math.random() * 200 - 100}px`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </g>
    </svg>
  );
}

// Experience: Level progression visual
function ExperienceIllustration() {
  return (
    <svg viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="onboarding-illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="expGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9FEF00" />
          <stop offset="100%" stopColor="#7BC100" />
        </linearGradient>
      </defs>

      {/* Level Progression Steps */}
      <g className="level-steps">
        {/* Level 1 - Beginner */}
        <g transform="translate(80, 480)" className="level-item">
          <circle cx="0" cy="0" r="30" fill="rgba(159, 239, 0, 0.15)" stroke="#9FEF00" strokeWidth="2" />
          <text x="-6" y="6" fontSize="20" fill="#9FEF00" fontWeight="bold">1</text>
          <text x="-26" y="50" fontSize="12" fill="#9FEF00">Beginner</text>
          <line x1="28" y1="-20" x2="120" y2="-80" stroke="#9FEF00" strokeWidth="2" opacity="0.5" />
        </g>

        {/* Level 2 - Intermediate */}
        <g transform="translate(200, 400)" className="level-item">
          <circle cx="0" cy="0" r="33" fill="rgba(159, 239, 0, 0.2)" stroke="#9FEF00" strokeWidth="2" />
          <text x="-8" y="7" fontSize="22" fill="#9FEF00" fontWeight="bold">2</text>
          <text x="-38" y="55" fontSize="12" fill="#9FEF00">Intermediate</text>
          <line x1="25" y1="-25" x2="90" y2="-80" stroke="#9FEF00" strokeWidth="2" opacity="0.5" />
        </g>

        {/* Level 3 - Advanced */}
        <g transform="translate(310, 320)" className="level-item">
          <circle cx="0" cy="0" r="36" fill="rgba(159, 239, 0, 0.25)" stroke="#9FEF00" strokeWidth="2" />
          <text x="-10" y="8" fontSize="24" fill="#9FEF00" fontWeight="bold">3</text>
          <text x="-32" y="58" fontSize="12" fill="#9FEF00">Advanced</text>
          <line x1="-22" y1="-28" x2="-70" y2="-80" stroke="#9FEF00" strokeWidth="2" opacity="0.5" />
        </g>

        {/* Level 4 - Expert */}
        <g transform="translate(240, 240)" className="level-item">
          <circle cx="0" cy="0" r="40" fill="rgba(159, 239, 0, 0.3)" stroke="#9FEF00" strokeWidth="2" />
          <text x="-11" y="10" fontSize="26" fill="#9FEF00" fontWeight="bold">4</text>
          <text x="-24" y="62" fontSize="12" fill="#9FEF00">Expert</text>
          <polygon points="0,-52 10,-65 -10,-65" fill="#9FEF00" opacity="0.7" />
        </g>
      </g>

      {/* Progress Bar - Properly constrained */}
      <g className="progress-visualization" transform="translate(50, 130)">
        <rect x="0" y="0" width="400" height="8" rx="4" fill="rgba(255, 255, 255, 0.1)" />
        <rect x="0" y="0" width="300" height="8" rx="4" fill="url(#expGradient)">
          <animate attributeName="width" from="0" to="300" dur="1.5s" fill="freeze" />
        </rect>
        <text x="200" y="-12" fontSize="14" fill="#9FEF00" textAnchor="middle" opacity="0.8">75% Complete</text>
      </g>

      {/* Floating XP Icons */}
      <g className="floating-xp" opacity="0.3">
        <text x="370" y="180" fontSize="16" fill="#9FEF00" className="code-bracket">+50</text>
        <text x="70" y="340" fontSize="15" fill="#9FEF00" className="code-bracket">+100</text>
        <text x="400" y="420" fontSize="15" fill="#9FEF00" className="code-bracket">+150</text>
      </g>
    </svg>
  );
}

// Commitment: Calendar/streak visual
function CommitmentIllustration() {
  return (
    <svg viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="onboarding-illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="commitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9FEF00" />
          <stop offset="100%" stopColor="#7BC100" />
        </linearGradient>
      </defs>

      {/* Calendar Grid */}
      <g className="calendar" transform="translate(50, 80)">
        {/* Calendar Header */}
        <rect x="0" y="0" width="350" height="50" rx="8" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="2" />
        <text x="175" y="32" fontSize="18" fill="#9FEF00" textAnchor="middle" fontWeight="bold">Daily Streak</text>

        {/* Calendar Body */}
        <rect x="0" y="50" width="350" height="250" rx="8" fill="rgba(10, 10, 15, 0.8)" stroke="#9FEF00" strokeWidth="2" />

        {/* Day Labels */}
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <text key={i} x={25 + i * 48} y="78" fontSize="12" fill="#9FEF00" opacity="0.6">{day}</text>
        ))}

        {/* Calendar Days (Activity Heatmap Style) */}
        {[...Array(28)].map((_, i) => {
          const row = Math.floor(i / 7);
          const col = i % 7;
          const isActive = i < 21; // 21 days streak
          const opacity = isActive ? (0.3 + (i / 28) * 0.7) : 0.05;

          return (
            <rect
              key={i}
              x={12 + col * 48}
              y={92 + row * 42}
              width="40"
              height="35"
              rx="4"
              fill="#9FEF00"
              opacity={opacity}
              stroke={isActive ? "#9FEF00" : "rgba(159, 239, 0, 0.2)"}
              strokeWidth="1"
            >
              {isActive && (
                <animate
                  attributeName="opacity"
                  values={`${opacity};${opacity + 0.2};${opacity}`}
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.1}s`}
                />
              )}
            </rect>
          );
        })}
      </g>

      {/* Streak Counter */}
      <g className="streak-counter" transform="translate(250, 500)">
        <circle cx="0" cy="0" r="60" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="3" className="shield-glow" />
        <text x="0" y="-5" fontSize="40" fill="url(#commitGradient)" textAnchor="middle" fontWeight="bold">21</text>
        <g transform="translate(-10, 20)">
          <text x="-8" y="5" fontSize="14" fill="#9FEF00" textAnchor="middle" opacity="0.8">Day Streak</text>
          <foreignObject x="35" y="-10" width="20" height="20">
            <Flame size={18} color="#9FEF00" />
          </foreignObject>
        </g>
      </g>

      {/* Floating Checkmarks */}
      <g className="floating-checks" opacity="0.3">
        <text x="50" y="180" fontSize="30" fill="#9FEF00" className="code-bracket">✓</text>
        <text x="520" y="220" fontSize="28" fill="#9FEF00" className="code-bracket">✓</text>
        <text x="80" y="680" fontSize="26" fill="#9FEF00" className="code-bracket">✓</text>
      </g>
    </svg>
  );
}

// Analysis: Loading/processing animation
function AnalysisIllustration() {
  return (
    <svg viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="onboarding-illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="analysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9FEF00" />
          <stop offset="100%" stopColor="#7BC100" />
        </linearGradient>
        <radialGradient id="analysisGlow">
          <stop offset="0%" stopColor="#9FEF00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#9FEF00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central Processing Core */}
      <g className="processing-core" transform="translate(250, 300)">
        <circle cx="0" cy="0" r="200" fill="url(#analysisGlow)" className="shield-glow" />

        {/* Rotating Rings */}
        <circle cx="0" cy="0" r="100" fill="none" stroke="#9FEF00" strokeWidth="2" opacity="0.3" strokeDasharray="10,5">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="0" cy="0" r="130" fill="none" stroke="#9FEF00" strokeWidth="2" opacity="0.4" strokeDasharray="15,10">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 0 0"
            to="0 0 0"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="0" cy="0" r="160" fill="none" stroke="#9FEF00" strokeWidth="2" opacity="0.5" strokeDasharray="20,15">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="12s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Central Icon */}
        <circle cx="0" cy="0" r="40" fill="rgba(159, 239, 0, 0.2)" stroke="#9FEF00" strokeWidth="3" />
        <path d="M -15 0 L -5 -15 L 15 -5 L 5 15 Z" fill="#9FEF00" opacity="0.8">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Data Processing Lines */}
      <g className="data-lines">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 250 + Math.cos(rad) * 140;
          const y1 = 300 + Math.sin(rad) * 140;
          const x2 = 250 + Math.cos(rad) * 220;
          const y2 = 300 + Math.sin(rad) * 220;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#9FEF00"
              strokeWidth="2"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0.8;0"
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.25}s`}
              />
            </line>
          );
        })}
      </g>

      {/* Status Text - Removed to prevent overlap with page text */}

      {/* Progress Percentage */}
      <text x="250" y="540" fontSize="28" fill="url(#analysisGradient)" textAnchor="middle" fontWeight="bold">
        <tspan>
          <animate attributeName="opacity" values="1" dur="0.1s" />
          85%
        </tspan>
      </text>
    </svg>
  );
}

// Paywall: Premium features showcase
function PaywallIllustration() {
  return (
    <svg viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="onboarding-illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9FEF00" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#9FEF00" />
        </linearGradient>
        <radialGradient id="premiumGlow">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9FEF00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Premium Badge/Crown */}
      <g className="premium-badge" transform="translate(250, 180)">
        <circle cx="0" cy="0" r="140" fill="url(#premiumGlow)" className="shield-glow" />

        {/* Crown */}
        <path
          d="M -60 20 L -40 -40 L -20 0 L 0 -50 L 20 0 L 40 -40 L 60 20 L 60 40 L -60 40 Z"
          fill="url(#premiumGradient)"
          stroke="#9FEF00"
          strokeWidth="2"
        >
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </path>

        {/* Crown Jewels */}
        <circle cx="-40" cy="-30" r="5" fill="#FFD700" />
        <circle cx="0" cy="-40" r="6" fill="#FFD700" />
        <circle cx="40" cy="-30" r="5" fill="#FFD700" />

        {/* Premium Text */}
        <text x="0" y="90" fontSize="24" fill="url(#premiumGradient)" textAnchor="middle" fontWeight="bold">PREMIUM</text>
      </g>

      {/* Feature Icons */}
      <g className="feature-showcase">
        {/* Unlimited Access */}
        <g transform="translate(90, 380)">
          <circle cx="0" cy="0" r="35" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="2" />
          <text x="0" y="6" fontSize="26" textAnchor="middle">∞</text>
          <text x="0" y="60" fontSize="11" fill="#9FEF00" textAnchor="middle">Unlimited</text>
        </g>

        {/* AI Coach */}
        <g transform="translate(250, 380)">
          <circle cx="0" cy="0" r="35" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="2" />
          <text x="0" y="8" fontSize="24" textAnchor="middle">🤖</text>
          <text x="0" y="60" fontSize="11" fill="#9FEF00" textAnchor="middle">AI Coach</text>
        </g>

        {/* Expert Labs */}
        <g transform="translate(410, 380)">
          <circle cx="0" cy="0" r="35" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="2" />
          <text x="0" y="8" fontSize="24" textAnchor="middle">⚡</text>
          <text x="0" y="60" fontSize="11" fill="#9FEF00" textAnchor="middle">Expert Labs</text>
        </g>
      </g>

      {/* Price Tag */}
      <g className="price-tag" transform="translate(250, 500)">
        <rect x="-100" y="-50" width="200" height="80" rx="12" fill="rgba(159, 239, 0, 0.1)" stroke="#9FEF00" strokeWidth="2" />
        <text x="0" y="-10" fontSize="14" fill="#9FEF00" textAnchor="middle" opacity="0.8">Only</text>
        <text x="0" y="25" fontSize="36" fill="url(#premiumGradient)" textAnchor="middle" fontWeight="bold">$4.99</text>
        <text x="0" y="45" fontSize="12" fill="#9FEF00" textAnchor="middle" opacity="0.6">/month</text>
      </g>

      {/* Sparkles */}
      <g className="sparkles">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const radius = 160 + (i % 2) * 25;
          const x = 250 + Math.cos(angle) * radius;
          const y = 180 + Math.sin(angle) * radius;

          return (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill="#FFD700" opacity="0">
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.15}s`}
                />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="180 0 0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.15}s`}
                />
              </path>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// Main component that renders based on step
function OnboardingIllustration({ step }) {
  const illustrations = {
    welcome: <WelcomeIllustration />,
    goal: <GoalIllustration />,
    experience: <ExperienceIllustration />,
    commitment: <CommitmentIllustration />,
    analysis: <AnalysisIllustration />,
    paywall: <PaywallIllustration />
  };

  return (
    <div className="onboarding-left-panel">
      {illustrations[step] || illustrations.welcome}
    </div>
  );
}

export default memo(OnboardingIllustration);
