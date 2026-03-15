import { PostHog } from "posthog-node"
import * as vscode from "vscode"

import { TelemetryEventName, type TelemetryEvent } from "@arcanea/types"

import { BaseTelemetryClient } from "./BaseTelemetryClient"

/**
 * PostHogTelemetryClient handles telemetry event tracking for the Roo Code extension.
 * Uses PostHog analytics to track user interactions and system events.
 * Respects user privacy settings and VSCode's global telemetry configuration.
 */
export class PostHogTelemetryClient extends BaseTelemetryClient {
	private client: PostHog
	private distinctId: string = vscode.env.machineId
	// Git repository properties that should be filtered out
	private readonly gitPropertyNames = ["repositoryUrl", "repositoryName", "defaultBranch"]

	constructor(debug = false) {
		super(
			{
				type: "exclude",
				events: [
					TelemetryEventName.TASK_MESSAGE,
					// TelemetryEventName.LLM_COMPLETION // arcanea_change
				],
			},
			debug,
		)

		this.client = new PostHog(process.env.ARCANEA_POSTHOG_API_KEY || "", {
			host: "https://us.i.posthog.com",
			disableGeoip: false, // arcanea_change
		})
	}

	/**
	 * Filter out git repository properties for PostHog telemetry
	 * @param propertyName The property name to check
	 * @returns Whether the property should be included in telemetry events
	 */
	protected override isPropertyCapturable(propertyName: string): boolean {
		// Filter out git repository properties
		if (this.gitPropertyNames.includes(propertyName)) {
			return false
		}
		return true
	}

	public override async capture(event: TelemetryEvent): Promise<void> {
		if (!this.isTelemetryEnabled() || !this.isEventCapturable(event.event)) {
			if (this.debug) {
				console.info(`[PostHogTelemetryClient#capture] Skipping event: ${event.event}`)
			}

			return
		}

		if (this.debug) {
			console.info(`[PostHogTelemetryClient#capture] ${event.event}`)
		}

		this.client.capture({
			distinctId: this.distinctId,
			event: event.event,
			properties: await this.getEventProperties(event),
		})
	}

	/**
	 * Updates the telemetry state based on user preferences and VSCode settings.
	 * Only enables telemetry if both VSCode global telemetry is enabled and
	 * user has opted in.
	 * @param didUserOptIn Whether the user has explicitly opted into telemetry
	 */
	public override updateTelemetryState(didUserOptIn: boolean): void {
		this.telemetryEnabled = false

		// First check global telemetry level - telemetry should only be enabled when level is "all".
		const telemetryLevel = vscode.workspace.getConfiguration("telemetry").get<string>("telemetryLevel", "all")
		const globalTelemetryEnabled = telemetryLevel === "all"

		// We only enable telemetry if global vscode telemetry is enabled.
		if (globalTelemetryEnabled) {
			this.telemetryEnabled = didUserOptIn
		}

		// Update PostHog client state based on telemetry preference.
		if (this.telemetryEnabled) {
			this.client.optIn()
		} else {
			this.client.optOut()
		}
	}

	public override async shutdown(): Promise<void> {
		await this.client.shutdown()
	}

	// arcanea_change start
	public override async captureException(error: Error, properties?: Record<string | number, unknown>): Promise<void> {
		if (this.isTelemetryEnabled()) {
			let providerProperties = {}
			try {
				providerProperties = (await this.providerRef?.deref()?.getTelemetryProperties()) || {}
			} catch (error) {
				console.error("Error getting provider properties", error)
			}
			this.client.captureException(error, this.distinctId, {
				...(providerProperties || {}),
				...(properties || {}),
			})
		}
	}

	private counter = 0
	private arcaneaToken = ""

	public override async updateIdentity(arcaneaToken: string) {
		if (arcaneaToken === this.arcaneaToken) {
			console.debug("ARCANEATEL: Identity up-to-date")
			return
		}
		if (!arcaneaToken) {
			console.debug("ARCANEATEL: Updating identity to machine ID")
			this.distinctId = vscode.env.machineId
			this.arcaneaToken = ""
			return
		}
		const id = ++this.counter
		try {
			const response = await fetch("https://api.arcanea.ai/api/profile", {
				headers: {
					Authorization: `Bearer ${arcaneaToken}`,
					"Content-Type": "application/json",
				},
			})
			const data = await response.json()
			if (!data?.user?.email) {
				throw new Error("Invalid response")
			}
			if (id === this.counter) {
				this.distinctId = data.user.email
				this.arcaneaToken = arcaneaToken
				console.debug("ARCANEATEL: Identity updated to:", this.distinctId)
			} else {
				console.debug("ARCANEATEL: Identity update ignored, newer request in progress")
			}
		} catch (error) {
			console.error("ARCANEATEL: Failed to update identity", error)
			if (id === this.counter) {
				this.distinctId = vscode.env.machineId
				this.arcaneaToken = ""
			}
		}
	}
	// arcanea_change end
}
