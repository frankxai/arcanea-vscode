// ARCANEA: BYPASS - replaced by BYOK
import { ApiHandlerOptions, ModelRecord } from "../../shared/api"
import { CompletionUsage, OpenRouterHandler } from "./openrouter"
import { getModelParams } from "../transform/model-params"
import { getModels } from "./fetchers/modelCache"
import { DEEP_SEEK_DEFAULT_TEMPERATURE, openRouterDefaultModelId, openRouterDefaultModelInfo } from "@arcanea/types"
import { getArcaneaBaseUriFromToken } from "../../shared/arcanea/token"
import { ApiHandlerCreateMessageMetadata } from ".."
import { getModelEndpoints } from "./fetchers/modelEndpointCache"
import { getArcaneaDefaultModel } from "./arcanea/getArcaneaDefaultModel"
import { X_ARCANEA_ORGANIZATIONID, X_ARCANEA_TASKID, X_ARCANEA_TESTER } from "../../shared/arcanea/headers"

/**
 * A custom OpenRouter handler that overrides the getModel function
 * to provide custom model information and fetches models from the Arcanea OpenRouter endpoint.
 */
export class ArcaneacodeOpenrouterHandler extends OpenRouterHandler {
	protected override models: ModelRecord = {}
	defaultModel: string = openRouterDefaultModelId

	protected override get providerName() {
		return "Arcanea"
	}

	constructor(options: ApiHandlerOptions) {
		const baseUri = getArcaneaBaseUriFromToken(options.arcaneaToken ?? "")
		options = {
			...options,
			openRouterBaseUrl: `${baseUri}/api/openrouter/`,
			openRouterApiKey: options.arcaneaToken,
		}

		super(options)
	}

	override customRequestOptions(metadata?: ApiHandlerCreateMessageMetadata) {
		const headers: Record<string, string> = {}

		if (metadata?.taskId) {
			headers[X_ARCANEA_TASKID] = metadata.taskId
		}

		const arcaneaOptions = this.options

		if (arcaneaOptions.arcaneaOrganizationId) {
			headers[X_ARCANEA_ORGANIZATIONID] = arcaneaOptions.arcaneaOrganizationId
		}

		// Add X-ARCANEA-TESTER: SUPPRESS header if the setting is enabled
		if (
			arcaneaOptions.arcaneaTesterWarningsDisabledUntil &&
			arcaneaOptions.arcaneaTesterWarningsDisabledUntil > Date.now()
		) {
			headers[X_ARCANEA_TESTER] = "SUPPRESS"
		}

		return Object.keys(headers).length > 0 ? { headers } : undefined
	}

	override getTotalCost(lastUsage: CompletionUsage): number {
		const model = this.getModel().info
		if (!model.inputPrice && !model.outputPrice) {
			return 0
		}
		// https://github.com/Arcanea-Org/arcanea-backend/blob/eb3d382df1e933a089eea95b9c4387db0c676e35/src/lib/processUsage.ts#L281
		if (lastUsage.is_byok) {
			return lastUsage.cost_details?.upstream_inference_cost || 0
		}
		return lastUsage.cost || 0
	}

	override getModel() {
		let id = this.options.arcaneaModel ?? this.defaultModel
		let info = this.models[id] ?? openRouterDefaultModelInfo

		// If a specific provider is requested, use the endpoint for that provider.
		if (this.options.openRouterSpecificProvider && this.endpoints[this.options.openRouterSpecificProvider]) {
			info = this.endpoints[this.options.openRouterSpecificProvider]
		}

		const isDeepSeekR1 = id.startsWith("deepseek/deepseek-r1") || id === "perplexity/sonar-reasoning"

		const params = getModelParams({
			format: "openrouter",
			modelId: id,
			model: info,
			settings: this.options,
			defaultTemperature: isDeepSeekR1 ? DEEP_SEEK_DEFAULT_TEMPERATURE : 0,
		})

		return { id, info, topP: isDeepSeekR1 ? 0.95 : undefined, ...params }
	}

	public override async fetchModel() {
		if (!this.options.arcaneaToken || !this.options.openRouterBaseUrl) {
			throw new Error("Arcanea token + baseUrl is required to fetch models")
		}

		const [models, endpoints, defaultModel] = await Promise.all([
			getModels({
				provider: "arcanea-openrouter",
				arcaneaToken: this.options.arcaneaToken,
				arcaneaOrganizationId: this.options.arcaneaOrganizationId,
			}),
			getModelEndpoints({
				router: "openrouter",
				modelId: this.options.arcaneaModel,
				endpoint: this.options.openRouterSpecificProvider,
			}),
			getArcaneaDefaultModel(this.options.arcaneaToken, this.options.arcaneaOrganizationId, this.options),
		])

		this.models = models
		this.endpoints = endpoints
		this.defaultModel = defaultModel
		return this.getModel()
	}
}
