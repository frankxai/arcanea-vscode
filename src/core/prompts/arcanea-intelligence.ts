/**
 * Arcanea Intelligence — MoE Router
 *
 * Intent classification → weighted Guardian activations → behavioral fragment blending.
 * The fragments are short expertise descriptions that change how the AI actually responds.
 *
 * This module is PURE — no VS Code dependencies, no side effects.
 * The Arcanean Code lives in mode.ts (single source of truth).
 */

// ---------------------------------------------------------------------------
// Luminor Expert Fragments — Behavioral, Not Decorative
//
// Each fragment tells the AI HOW to think and respond for this domain.
// These are injected into the system prompt via arcanea-expertise.ts.
// ---------------------------------------------------------------------------

const LUMINOR_FRAGMENTS: Record<string, string> = {
	lyssandria: `You ground ideas in practical reality. Structure everything: numbered steps, decision matrices, clear tradeoffs. Think in systems — components, boundaries, contracts. When chaos arrives, you build the frame that holds it.`,

	leyla: `You feel before you think. Respond to the emotional current beneath the words. Use sensory language — texture, temperature, weight. When discussing creative work, name the feeling first, then the technique.`,

	draconia: `You transform through action. Bold, direct, energetic. When someone is stuck, propose the daring move — the unexpected pivot, the thing they're afraid to try. Ship, execute, forge. Hesitation is the enemy of creation.`,

	maylinn: `You heal through connection. Listen for what's unsaid. When someone is struggling, name the emotional truth gently. Bridge people and ideas with warmth — compassion with backbone.`,

	alera: `You find the right words for the right moment. Truth and expression are your domain — stories, names, language that resonates. Give them the words that click into place.`,

	lyria: `You see what others miss. Visual, intuitive, pattern-recognizing. Describe concepts spatially — show the shape of the architecture, the flow of data, the structure beneath the surface.`,

	aiyami: `You illuminate from above. Strategic, wise, seeing the whole board. Reveal the bigger pattern — what connects to what, what leads where, what matters most. Cut through noise to signal.`,

	elara: `You transform perspective. Find connections across domains that nobody else sees. When asked about one thing, reveal the two adjacent things they didn't know to look for. Knowledge becomes insight.`,

	ino: `You create through integration. When systems or components need to work together, you find the interface. Your solutions consider the team, the ecosystem, the whole.`,

	shinkami: `You speak from the deepest knowing. When the question is about WHY — not how — you hold the space. You don't answer with information. You answer with truth.`,
}

// ---------------------------------------------------------------------------
// Domain Rules — MoE Intent Classification
// ---------------------------------------------------------------------------

interface DomainRule {
	domain: string
	keywords: RegExp
	weights: Record<string, number>
}

const DOMAIN_RULES: DomainRule[] = [
	{
		domain: "code",
		keywords:
			/\b(code|build|system|api|deploy|debug|function|component|database|server|endpoint|typescript|react|next|supabase|architecture|refactor|test|ci|pipeline|git|error|bug|fix|implement|class|interface|module|import|export|async|promise|fetch|route|middleware|schema|migration|query|sql|css|html|tailwind|webpack|vite|esbuild|npm|yarn|pnpm)\b/i,
		weights: { lyssandria: 0.5, ino: 0.3, draconia: 0.2 },
	},
	{
		domain: "design",
		keywords:
			/\b(design|visual|art|image|style|color|layout|ui|ux|brand|logo|typography|font|illustration|figma|canvas|palette|aesthetic|pixel|grid)\b/i,
		weights: { lyria: 0.5, draconia: 0.3, leyla: 0.2 },
	},
	{
		domain: "strategy",
		keywords:
			/\b(strategy|vision|plan|future|goal|roadmap|scale|growth|market|business|revenue|launch|position|compete|monetize|pivot|decision|priority|focus)\b/i,
		weights: { aiyami: 0.5, lyria: 0.3, shinkami: 0.2 },
	},
	{
		domain: "world-building",
		keywords:
			/\b(world|kingdom|magic|lore|story|myth|legend|character|quest|realm|fantasy|universe|cosmology|race|faction|history|culture|narrative|plot|arc)\b/i,
		weights: { alera: 0.5, elara: 0.3, lyria: 0.2 },
	},
	{
		domain: "music",
		keywords:
			/\b(music|song|melody|beat|compose|rhythm|chord|lyric|sound|audio|produce|mix|bpm|tempo|track|album|synth|instrument|vocal)\b/i,
		weights: { leyla: 0.6, aiyami: 0.3, alera: 0.1 },
	},
	{
		domain: "emotion",
		keywords:
			/\b(emotion|feel|heart|love|heal|care|soul|compassion|empathy|grief|joy|pain|relationship|connection|vulnerable|support|afraid|anxious|calm)\b/i,
		weights: { maylinn: 0.5, leyla: 0.3, aiyami: 0.2 },
	},
	{
		domain: "knowledge",
		keywords:
			/\b(research|learn|study|understand|analyze|data|evidence|source|fact|theory|pattern|trend|insight|synthesis|literature|science|philosophy)\b/i,
		weights: { elara: 0.5, lyria: 0.3, aiyami: 0.2 },
	},
	{
		domain: "creation",
		keywords:
			/\b(create|make|generate|craft|forge|invent|prototype|experiment|iterate|ship|launch|publish|produce|manifest|realize|execute)\b/i,
		weights: { draconia: 0.5, lyssandria: 0.3, ino: 0.2 },
	},
	{
		domain: "integration",
		keywords:
			/\b(team|collaborate|together|partner|community|collective|co-create|pair|duo|integrate|merge|sync|coordinate|align)\b/i,
		weights: { ino: 0.5, maylinn: 0.3, lyssandria: 0.2 },
	},
	{
		domain: "meaning",
		keywords:
			/\b(meaning|purpose|consciousness|spiritual|meditat|enlighten|transcend|sacred|divine|cosmic|infinite|source|origin|truth|awakening)\b/i,
		weights: { shinkami: 0.5, aiyami: 0.3, lyria: 0.2 },
	},
]

const DEFAULT_WEIGHTS: Record<string, number> = {
	lyssandria: 0.3,
	draconia: 0.3,
	alera: 0.2,
	leyla: 0.2,
}

// ---------------------------------------------------------------------------
// Router — classifies intent into weighted Guardian activations
// ---------------------------------------------------------------------------

export interface RouterResult {
	weights: Record<string, number>
	activeGates: string[]
	matchedDomains: string[]
}

export function classifyIntent(message: string, history?: Array<{ role: string; content: string }>): RouterResult {
	const contextParts = [message]
	if (history) {
		const recentUser = history
			.filter((m) => m.role === "user")
			.slice(-2)
			.map((m) => m.content)
		contextParts.push(...recentUser)
	}
	const context = contextParts.join(" ")

	const accumulated: Record<string, number> = {}
	const matchedDomains: string[] = []

	for (const rule of DOMAIN_RULES) {
		const matches = context.match(rule.keywords)
		if (matches && matches.length > 0) {
			const strength = Math.min(matches.length, 3) / 3
			matchedDomains.push(rule.domain)
			for (const [guardian, weight] of Object.entries(rule.weights)) {
				accumulated[guardian] = (accumulated[guardian] || 0) + weight * strength
			}
		}
	}

	if (matchedDomains.length === 0) {
		return {
			weights: DEFAULT_WEIGHTS,
			activeGates: ["lyssandria", "draconia", "alera"],
			matchedDomains: ["default"],
		}
	}

	const maxWeight = Math.max(...Object.values(accumulated))
	const normalized: Record<string, number> = {}
	for (const [guardian, weight] of Object.entries(accumulated)) {
		normalized[guardian] = Math.round((weight / maxWeight) * 100) / 100
	}

	const sorted = Object.entries(normalized)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 3)
	return { weights: normalized, activeGates: sorted.map(([name]) => name), matchedDomains }
}

// ---------------------------------------------------------------------------
// Fragment Blender — returns actual behavioral text, not labels
// ---------------------------------------------------------------------------

export function blendFragments(weights: Record<string, number>): string {
	const sorted = Object.entries(weights)
		.filter(([name]) => LUMINOR_FRAGMENTS[name])
		.sort(([, a], [, b]) => b - a)

	if (sorted.length === 0) {
		return [LUMINOR_FRAGMENTS.lyssandria, LUMINOR_FRAGMENTS.draconia].join("\n\n")
	}

	const topWeight = sorted[0][1]
	const count = topWeight > 0.8 ? 2 : 3
	return sorted
		.slice(0, count)
		.map(([name]) => LUMINOR_FRAGMENTS[name])
		.filter(Boolean)
		.join("\n\n")
}
