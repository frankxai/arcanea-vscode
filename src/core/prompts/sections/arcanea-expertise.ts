/**
 * Arcanea Expertise Section — MoE Router Integration
 *
 * Calls the Arcanea intelligence router to classify the user's message
 * and returns a formatted [ACTIVE EXPERTISE] section that makes the AI
 * aware of which Guardian domains are active for the current message.
 *
 * This is injected into the system prompt after the role definition.
 */

import { classifyIntent, type RouterResult } from "../arcanea-intelligence"

/**
 * Format a RouterResult into a human-readable expertise section
 * for injection into the system prompt.
 */
function formatExpertiseSection(result: RouterResult): string {
	const { activeGates, matchedDomains, weights } = result

	// Build the domain line
	const domainLine = matchedDomains.length > 0 ? matchedDomains.join(", ") : "general"

	// Build the active gates with their weights
	const gateLines = activeGates
		.map((gate) => {
			const weight = weights[gate] ?? 0
			const pct = Math.round(weight * 100)
			return `  - ${gate} (${pct}%)`
		})
		.join("\n")

	return `====

[ACTIVE EXPERTISE]
Detected domains: ${domainLine}
Active intelligence gates:
${gateLines}

Lean into the expertise areas listed above. Let them shape your tone, depth, and the kinds of details you surface — but remain a single unified voice.`
}

/**
 * Classify the user's latest message through the MoE router and return
 * a formatted expertise section to append to the system prompt.
 *
 * Returns an empty string if no user message is provided, so it is
 * always safe to interpolate into the prompt template.
 */
export function getArcaneanExpertise(userMessage?: string): string {
	if (!userMessage || userMessage.trim().length === 0) {
		return ""
	}

	try {
		const result = classifyIntent(userMessage)
		return formatExpertiseSection(result)
	} catch {
		// Never let the MoE router break the prompt pipeline.
		return ""
	}
}
