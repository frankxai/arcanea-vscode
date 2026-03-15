// ARCANEA: BYPASS - replaced by BYOK
import { VSCodeButtonLink } from "../common/VSCodeButtonLink"
import { telemetryClient } from "@/utils/TelemetryClient"
import { useAppTranslation } from "@/i18n/TranslationContext"
import { ProviderSettings, TelemetryEventName } from "@arcanea/types"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { Trans } from "react-i18next"

const WarningBox = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="bg-vscode-editor-background text-vscode-descriptionForeground border p-3 text-center">
			{children}
		</div>
	)
}

export const OpenRouterMarkupInfoView = ({
	setApiConfigurationField,
}: {
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
}) => {
	return (
		<WarningBox>
			<div>
				<Trans i18nKey="arcanea:pricing.openRouterMarkup" />
			</div>
			<VSCodeButton
				appearance="primary"
				className="mt-3 w-full"
				onClick={() => {
					setApiConfigurationField("apiProvider", "arcanea")
					telemetryClient.capture(TelemetryEventName.SWITCH_TO_ARCANEA_CLICKED)
				}}>
				<Trans i18nKey="arcanea:pricing.switchToArcanea" />
			</VSCodeButton>
		</WarningBox>
	)
}

export const FreeModelsInfoView = ({ origin, modelId }: { origin: "chat" | "settings"; modelId?: string }) => {
	const { t } = useAppTranslation()
	return (
		<WarningBox>
			<div>{t("arcanea:pricing.freeModelsDescription")}</div>
			<FreeModelsLink className="mt-3 w-full" origin={origin} modelId={modelId} />
		</WarningBox>
	)
}

export const FreeModelsLink = ({
	className,
	origin,
	modelId,
}: {
	className: string
	origin: "chat" | "settings" | "invalid_model"
	modelId?: string
}) => {
	const { t } = useAppTranslation()
	return (
		<VSCodeButtonLink
			href="https://arcanea.love/continueforfree"
			appearance="primary"
			className={className}
			onClick={() => {
				telemetryClient.capture(TelemetryEventName.FREE_MODELS_LINK_CLICKED, {
					modelId,
					origin,
				})
			}}>
			{t("arcanea:pricing.freeModelsLink")}
		</VSCodeButtonLink>
	)
}
