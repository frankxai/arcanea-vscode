import * as vscode from "vscode"
import { JETBRAIN_PRODUCTS, ArcaneaWrapperProperties } from "../../shared/arcanea/wrapper"

export const getArcaneaWrapperProperties = (): ArcaneaWrapperProperties => {
	const appName = vscode.env.appName
	const arcaneaWrapped = appName.includes("wrapper")
	let arcaneaWrapper = null
	let arcaneaWrapperTitle = null
	let arcaneaWrapperCode = null
	let arcaneaWrapperVersion = null

	if (arcaneaWrapped) {
		const wrapperMatch = appName.split("|")
		arcaneaWrapper = wrapperMatch[1].trim() || null
		arcaneaWrapperCode = wrapperMatch[2].trim() || null
		arcaneaWrapperVersion = wrapperMatch[3].trim() || null
		arcaneaWrapperTitle =
			JETBRAIN_PRODUCTS[arcaneaWrapperCode as keyof typeof JETBRAIN_PRODUCTS]?.name || "JetBrains IDE"
	}

	return {
		arcaneaWrapped,
		arcaneaWrapper,
		arcaneaWrapperTitle,
		arcaneaWrapperCode,
		arcaneaWrapperVersion,
	}
}
