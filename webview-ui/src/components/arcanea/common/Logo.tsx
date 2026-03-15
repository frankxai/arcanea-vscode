export default function Logo({ width = 100, height = 100 }: { width?: number; height?: number }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 48 48"
			className="mb-4 mt-4"
			width={width}
			height={height}
			aria-label="Arcanea">
			<defs>
				<linearGradient id="arcanea-crystal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="var(--arcanea-cyan, #00bcd4)" stopOpacity="1" />
					<stop offset="50%" stopColor="var(--arcanea-ultramarine, #0d47a1)" stopOpacity="0.85" />
					<stop offset="100%" stopColor="var(--arcanea-peacock, #00897b)" stopOpacity="1" />
				</linearGradient>
				<linearGradient id="arcanea-crystal-inner" x1="50%" y1="0%" x2="50%" y2="100%">
					<stop offset="0%" stopColor="var(--arcanea-cyan, #00bcd4)" stopOpacity="0.9" />
					<stop offset="100%" stopColor="var(--arcanea-gold, #ffd700)" stopOpacity="0.3" />
				</linearGradient>
			</defs>
			{/* Outer crystal — hexagonal portal shape */}
			<polygon
				points="24,2 42,13 42,35 24,46 6,35 6,13"
				fill="none"
				stroke="url(#arcanea-crystal-gradient)"
				strokeWidth="1.5"
				strokeLinejoin="round"
				opacity="0.7"
			/>
			{/* Inner crystal — rotated, smaller */}
			<polygon
				points="24,8 37,16 37,32 24,40 11,32 11,16"
				fill="none"
				stroke="url(#arcanea-crystal-gradient)"
				strokeWidth="1"
				strokeLinejoin="round"
				opacity="0.45"
			/>
			{/* Center star — four-pointed, representing the Source */}
			<path
				d="M24,12 L26,22 L36,24 L26,26 L24,36 L22,26 L12,24 L22,22 Z"
				fill="url(#arcanea-crystal-inner)"
				opacity="0.85"
			/>
			{/* Core dot */}
			<circle cx="24" cy="24" r="2" fill="var(--arcanea-cyan, #00bcd4)" opacity="0.9" />
		</svg>
	)
}
