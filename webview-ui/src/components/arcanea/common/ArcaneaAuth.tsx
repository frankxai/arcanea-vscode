// ARCANEA: BYPASS - replaced by BYOK
import React from "react"
import { ButtonPrimary } from "./ButtonPrimary"
import Logo from "./Logo"
import { useAppTranslation } from "@/i18n/TranslationContext"

interface ArcaneaAuthProps {
	onManualConfigClick?: () => void
	className?: string
}

const ArcaneaAuth: React.FC<ArcaneaAuthProps> = ({ onManualConfigClick, className = "" }) => {
	const { t } = useAppTranslation()

	return (
		<div className={`flex flex-col items-center ${className}`}>
			<Logo />

			<h2 className="m-0 p-0 mb-4">{t("arcanea:welcome.greeting")}</h2>
			<p className="text-center mb-2">{t("arcanea:welcome.introText1")}</p>
			<p className="text-center mb-2">{t("arcanea:welcome.introText2")}</p>
			<p className="text-center mb-5">{t("arcanea:welcome.introText3")}</p>

			<div className="w-full flex flex-col gap-5">
				{!!onManualConfigClick && (
					<ButtonPrimary onClick={() => onManualConfigClick()}>
						{t("arcanea:welcome.ctaButton")}
					</ButtonPrimary>
				)}
			</div>
		</div>
	)
}

export default ArcaneaAuth
