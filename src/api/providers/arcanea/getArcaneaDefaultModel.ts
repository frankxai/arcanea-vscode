import { openRouterDefaultModelId, type ProviderSettings } from "@arcanea/types"
import { getArcaneaBaseUriFromToken } from "../../../shared/arcanea/token"
import { TelemetryService } from "@arcanea/telemetry"
import { z } from "zod"
import { fetchWithTimeout } from "./fetchWithTimeout"
import { DEFAULT_HEADERS } from "../constants"

type ArcaneacodeToken = string

type OrganizationId = string

const cache = new Map<string, Promise<string>>()

const defaultsSchema = z.object({
	defaultModel: z.string().nullish(),
})

const fetcher = fetchWithTimeout(5000)

async function fetchArcaneacodeDefaultModel(
	arcaneaToken: ArcaneacodeToken,
	organizationId?: OrganizationId,
	providerSettings?: ProviderSettings,
): Promise<string> {
	try {
		const path = organizationId ? `/organizations/${organizationId}/defaults` : `/defaults`
		const url = `${getArcaneaBaseUriFromToken(arcaneaToken)}/api${path}`

		const headers: Record<string, string> = {
			...DEFAULT_HEADERS,
			Authorization: `Bearer ${arcaneaToken}`,
		}

		// Add X-ARCANEA-TESTER: SUPPRESS header if the setting is enabled
		if (
			providerSettings?.arcaneaTesterWarningsDisabledUntil &&
			providerSettings.arcaneaTesterWarningsDisabledUntil > Date.now()
		) {
			headers["X-ARCANEA-TESTER"] = "SUPPRESS"
		}

		const response = await fetcher(url, { headers })
		if (!response.ok) {
			throw new Error(`Fetching default model from ${url} failed: ${response.status}`)
		}
		const defaultModel = (await defaultsSchema.parseAsync(await response.json())).defaultModel
		if (!defaultModel) {
			throw new Error(`Default model from ${url} was empty`)
		}
		console.info(`Fetched default model from ${url}: ${defaultModel}`)
		return defaultModel
	} catch (err) {
		console.error("Failed to get default model", err)
		TelemetryService.instance.captureException(err, { context: "getArcaneaDefaultModel" })
		return openRouterDefaultModelId
	}
}

export async function getArcaneaDefaultModel(
	arcaneaToken?: ArcaneacodeToken,
	organizationId?: OrganizationId,
	providerSettings?: ProviderSettings,
): Promise<string> {
	if (!arcaneaToken) {
		return openRouterDefaultModelId
	}
	const key = JSON.stringify({
		arcaneaToken,
		organizationId,
		testerSuppressed: providerSettings?.arcaneaTesterWarningsDisabledUntil,
	})
	let defaultModelPromise = cache.get(key)
	if (!defaultModelPromise) {
		defaultModelPromise = fetchArcaneacodeDefaultModel(arcaneaToken, organizationId, providerSettings)
		cache.set(key, defaultModelPromise)
	}
	return await defaultModelPromise
}
