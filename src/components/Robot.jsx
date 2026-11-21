import "./Robot.css";

// Animated neon robot head. Glows and talks when `speaking` is true.
function Robot({ speaking }) {
    return (
        <div className={`robot ${speaking ? "robot-speaking" : ""}`}>
            <svg viewBox="0 0 240 260" className="robot-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="neon" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* antenna */}
                <line x1="120" y1="30" x2="120" y2="55" stroke="url(#neon)" strokeWidth="4" strokeLinecap="round" />
                <circle cx="120" cy="24" r="8" fill="#22d3ee" filter="url(#glow)" className="antenna" />

                {/* ears */}
                <rect x="18" y="110" width="20" height="50" rx="8" fill="url(#neon)" filter="url(#glow)" />
                <rect x="202" y="110" width="20" height="50" rx="8" fill="url(#neon)" filter="url(#glow)" />

                {/* head */}
                <rect x="35" y="55" width="170" height="150" rx="40" fill="url(#body)" stroke="url(#neon)" strokeWidth="4" filter="url(#glow)" />

                {/* visor */}
                <rect x="55" y="85" width="130" height="62" rx="26" fill="#020617" />

                {/* eyes */}
                <g className="eyes" filter="url(#glow)">
                    <ellipse cx="92" cy="116" rx="13" ry="15" fill="#22d3ee" />
                    <ellipse cx="148" cy="116" rx="13" ry="15" fill="#22d3ee" />
                </g>

                {/* mouth */}
                <rect className="mouth" x="92" y="170" width="56" height="12" rx="6" fill="url(#neon)" filter="url(#glow)" />

                {/* neck */}
                <rect x="100" y="205" width="40" height="18" rx="4" fill="#1e293b" />
                <rect x="70" y="223" width="100" height="22" rx="11" fill="url(#body)" stroke="url(#neon)" strokeWidth="3" />
            </svg>
        </div>
    );
}

export default Robot;
