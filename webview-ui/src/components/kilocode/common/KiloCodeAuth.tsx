// ARCANEA: BYPASS - replaced by BYOK
import React from "react"
import { ButtonPrimary } from "./ButtonPrimary"
import Logo from "./Logo"
import { useAppTranslation } from "@/i18n/TranslationContext"

interface KiloCodeAuthProps {
	onManualConfigClick?: () => void
	className?: string
}

const KiloCodeAuth: React.FC<KiloCodeAuthProps> = ({ onManualConfigClick, className = "" }) => {
	const { t } = useAppTranslation()

	return (
		<div className={`flex flex-col items-center ${className}`}>
			<Logo />

			<h2 className="m-0 p-0 mb-4">{t("kilocode:welcome.greeting")}</h2>
			<p className="text-center mb-2">{t("kilocode:welcome.introText1")}</p>
			<p className="text-center mb-2">{t("kilocode:welcome.introText2")}</p>
			<p className="text-center mb-5">{t("kilocode:welcome.introText3")}</p>

			<div className="w-full flex flex-col gap-5">
				{!!onManualConfigClick && (
					<ButtonPrimary onClick={() => onManualConfigClick()}>
						{t("kilocode:welcome.ctaButton")}
					</ButtonPrimary>
				)}
			</div>
		</div>
	)
}

export default KiloCodeAuth
