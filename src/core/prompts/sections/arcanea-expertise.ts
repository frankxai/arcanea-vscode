/**
 * Arcanea Expertise Section — MoE Router Integration
 *
 * Calls the Arcanea intelligence router to classify the user's message
 * and returns the ACTUAL behavioral fragments (not just labels) that
 * make the AI respond with domain-appropriate depth and tone.
 *
 * This is injected into the system prompt after the role definition.
 */

import { classifyIntent, blendFragments, type RouterResult } from "../arcanea-intelligence"

/**
 * Classify the user's latest message through the MoE router and return
 * blended expert fragments that change how the AI actually responds.
 *
 * Returns an empty string if no user message is provided, so it is
 * always safe to append to any prompt.
 */
export function getArcaneanExpertise(userMessage?: string): string {
	if (!userMessage || userMessage.trim().length === 0) {
		return ""
	}

	try {
		const result = classifyIntent(userMessage)
		const fragments = blendFragments(result.weights)

		if (!fragments) {
			return ""
		}

		return `\n====\n\n[ACTIVE EXPERTISE]\n${fragments}\n\nLean into the expertise above. Let it shape your tone, depth, and the specific details you surface.`
	} catch {
		// Never let the MoE router break the prompt pipeline.
		return ""
	}
}
