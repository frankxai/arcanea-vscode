// arcanea_change - new file
// npx vitest core/webview/__tests__/ClineProvider.arcanea-organization.spec.ts

import { setupCommonMocks, setupProvider, createMockWebviewView } from "../../../__tests__/common-mocks"

// Setup all mocks before any imports
setupCommonMocks()

describe("ClineProvider", () => {
	let provider: any
	let mockWebviewView: any

	beforeEach(() => {
		vi.clearAllMocks()
		const setup = setupProvider()
		provider = setup.provider
		mockWebviewView = createMockWebviewView()
	})

	describe("arcaneaOrganizationId", () => {
		test("preserves arcaneaOrganizationId when no previous token exists", async () => {
			await provider.resolveWebviewView(mockWebviewView)
			const messageHandler = (mockWebviewView.webview.onDidReceiveMessage as any).mock.calls[0][0]

			const mockUpsertProviderProfile = vi.fn()
			;(provider as any).upsertProviderProfile = mockUpsertProviderProfile
			;(provider as any).providerSettingsManager = {
				getProfile: vi.fn().mockResolvedValue({
					// Simulate saved config with NO arcaneaToken (common case)
					name: "test-config",
					apiProvider: "anthropic",
					apiKey: "test-key",
					id: "test-id",
				}),
			} as any

			await messageHandler({
				type: "upsertApiConfiguration",
				text: "test-config",
				apiConfiguration: {
					apiProvider: "anthropic" as const,
					apiKey: "test-key",
					arcaneaToken: "test-arcanea-token",
					arcaneaOrganizationId: "org-123",
				},
			})

			expect(mockUpsertProviderProfile).toHaveBeenCalledWith(
				"test-config",
				expect.objectContaining({
					arcaneaToken: "test-arcanea-token",
					arcaneaOrganizationId: "org-123", // Should be preserved
				}),
			)
		})

		test("clears arcaneaOrganizationId when token actually changes", async () => {
			await provider.resolveWebviewView(mockWebviewView)
			const messageHandler = (mockWebviewView.webview.onDidReceiveMessage as any).mock.calls[0][0]

			const mockUpsertProviderProfile = vi.fn()
			;(provider as any).upsertProviderProfile = mockUpsertProviderProfile
			;(provider as any).providerSettingsManager = {
				getProfile: vi.fn().mockResolvedValue({
					// Simulate saved config with DIFFERENT arcaneaToken
					name: "test-config",
					apiProvider: "anthropic",
					apiKey: "test-key",
					arcaneaToken: "old-arcanea-token",
					id: "test-id",
				}),
			} as any

			await messageHandler({
				type: "upsertApiConfiguration",
				text: "test-config",
				apiConfiguration: {
					apiProvider: "anthropic" as const,
					apiKey: "test-key",
					arcaneaToken: "new-arcanea-token", // Different token
					arcaneaOrganizationId: "org-123",
				},
			})

			// Verify the organization ID was cleared for security
			expect(mockUpsertProviderProfile).toHaveBeenCalledWith(
				"test-config",
				expect.objectContaining({
					arcaneaToken: "new-arcanea-token",
					arcaneaOrganizationId: undefined, // Should be cleared
				}),
			)
		})
	})
})
