// ARCANEA: BYPASS - replaced by BYOK
import { useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { getArcaneaBackendSignInUrl } from "../../helpers"
import { Button } from "@src/components/ui"
import { type ProviderSettings, type OrganizationAllowList } from "@arcanea/types"
import type { RouterModels } from "@roo/api"
import { useAppTranslation } from "@src/i18n/TranslationContext"
import { VSCodeButtonLink } from "@src/components/common/VSCodeButtonLink"
import { inputEventTransform } from "../../../settings/transforms"
import { ModelPicker } from "../../../settings/ModelPicker"
import { vscode } from "@src/utils/vscode"
import { OrganizationSelector } from "../../common/OrganizationSelector"
import { ArcaneaWrapperProperties } from "../../../../../../src/shared/arcanea/wrapper"
import { useArcaneaIdentity } from "@src/utils/arcanea/useArcaneaIdentity"

type ArcaneaProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
	currentApiConfigName?: string
	hideArcaneaButton?: boolean
	routerModels?: RouterModels
	organizationAllowList: OrganizationAllowList
	uriScheme: string | undefined
	arcaneaWrapperProperties: ArcaneaWrapperProperties | undefined
	uiKind: string | undefined
	arcaneaDefaultModel: string
}

export const Arcanea = ({
	apiConfiguration,
	setApiConfigurationField,
	currentApiConfigName,
	hideArcaneaButton,
	routerModels,
	organizationAllowList,
	uriScheme,
	uiKind,
	arcaneaWrapperProperties,
	arcaneaDefaultModel,
}: ArcaneaProps) => {
	const { t } = useAppTranslation()
	
	const handleInputChange = useCallback(
		<K extends keyof ProviderSettings, E>(
			field: K,
			transform: (event: E) => ProviderSettings[K] = inputEventTransform,
		) =>
			(event: E | Event) => {
				setApiConfigurationField(field, transform(event as E))
			},
		[setApiConfigurationField],
	)

	// Use the existing hook to get user identity
	const userIdentity = useArcaneaIdentity(apiConfiguration.arcaneaToken || "", "")
	const isArcaneaAiUser = userIdentity.endsWith("@arcanea.ai")

	const areArcaneacodeWarningsDisabled = apiConfiguration.arcaneaTesterWarningsDisabledUntil
		? apiConfiguration.arcaneaTesterWarningsDisabledUntil > Date.now()
		: false

	const handleToggleTesterWarnings = useCallback(() => {
		const newTimestamp = Date.now() + (areArcaneacodeWarningsDisabled ? 0 : 24 * 60 * 60 * 1000)
		setApiConfigurationField("arcaneaTesterWarningsDisabledUntil", newTimestamp)
	}, [areArcaneacodeWarningsDisabled, setApiConfigurationField])

	return (
		<>
			<div>
				<label className="block font-medium -mb-2">{t("arcanea:settings.provider.account")}</label>
			</div>
			{!hideArcaneaButton &&
				(apiConfiguration.arcaneaToken ? (
					<div>
						<Button
							variant="secondary"
							onClick={async () => {
								setApiConfigurationField("arcaneaToken", "")

								vscode.postMessage({
									type: "upsertApiConfiguration",
									text: currentApiConfigName,
									apiConfiguration: {
										...apiConfiguration,
										arcaneaToken: "",
										arcaneaOrganizationId: undefined,
									},
								})
							}}>
							{t("arcanea:settings.provider.logout")}
						</Button>
					</div>
				) : (
					<VSCodeButtonLink
						variant="secondary"
						href={getArcaneaBackendSignInUrl(uriScheme, uiKind, arcaneaWrapperProperties)}>
						{t("arcanea:settings.provider.login")}
					</VSCodeButtonLink>
				))}

			<VSCodeTextField
				value={apiConfiguration?.arcaneaToken || ""}
				type="password"
				onInput={handleInputChange("arcaneaToken")}
				placeholder={t("arcanea:settings.provider.apiKey")}
				className="w-full">
				<div className="flex justify-between items-center mb-1">
					<label className="block font-medium">{t("arcanea:settings.provider.apiKey")}</label>
				</div>
			</VSCodeTextField>

			<OrganizationSelector showLabel />

			<ModelPicker
				apiConfiguration={apiConfiguration}
				setApiConfigurationField={setApiConfigurationField}
				defaultModelId={arcaneaDefaultModel}
				models={routerModels?.["arcanea-openrouter"] ?? {}}
				modelIdKey="arcaneaModel"
				serviceName="Arcanea"
				serviceUrl="https://arcanea.ai"
				organizationAllowList={organizationAllowList}
			/>

			{/* ARCANEA: BYPASS - Arcanea tester warnings removed for BYOK */}
		</>
	)
}
