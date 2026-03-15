// ARCANEA: BYPASS - replaced by BYOK
import { JETBRAIN_PRODUCTS, ArcaneaWrapperProperties } from "../../../../src/shared/arcanea/wrapper"

const getJetbrainsUrlScheme = (code: string) => {
	return JETBRAIN_PRODUCTS[code as keyof typeof JETBRAIN_PRODUCTS]?.urlScheme || "jetbrains"
}

const getArcaneaSource = (uriScheme: string = "vscode", arcaneaWrapperProperties?: ArcaneaWrapperProperties) => {
	if (
		!arcaneaWrapperProperties?.arcaneaWrapped ||
		!arcaneaWrapperProperties.arcaneaWrapper ||
		!arcaneaWrapperProperties.arcaneaWrapperCode
	) {
		return uriScheme
	}

	return `${getJetbrainsUrlScheme(arcaneaWrapperProperties.arcaneaWrapperCode)}`
}

export function getArcaneaBackendSignInUrl(
	uriScheme: string = "vscode",
	uiKind: string = "Desktop",
	arcaneaWrapperProperties?: ArcaneaWrapperProperties,
) {
	const baseUrl = "https://arcanea.ai"
	const source = uiKind === "Web" ? "web" : getArcaneaSource(uriScheme, arcaneaWrapperProperties)
	return `${baseUrl}/sign-in-to-editor?source=${source}`
}

export function getArcaneaBackendSignUpUrl(
	uriScheme: string = "vscode",
	uiKind: string = "Desktop",
	arcaneaWrapperProperties?: ArcaneaWrapperProperties,
) {
	const baseUrl = "https://arcanea.ai"
	const source = uiKind === "Web" ? "web" : getArcaneaSource(uriScheme, arcaneaWrapperProperties)
	return `${baseUrl}/users/sign_up?source=${source}`
}
