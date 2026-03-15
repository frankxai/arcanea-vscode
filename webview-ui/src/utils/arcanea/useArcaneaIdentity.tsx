import { useEffect, useState } from "react"
import { ProfileDataResponsePayload } from "@roo/WebviewMessage"
import { vscode } from "@/utils/vscode"

export function useArcaneaIdentity(arcaneaToken: string, machineId: string) {
	const [arcaneaIdentity, setArcaneaIdentity] = useState("")
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === "profileDataResponse") {
				const payload = event.data.payload as ProfileDataResponsePayload | undefined
				const success = payload?.success || false
				const tokenFromMessage = payload?.data?.arcaneaToken || ""
				const email = payload?.data?.user?.email || ""
				if (!success) {
					console.error("ARCANEATEL: Failed to identify Arcanea user, message doesn't indicate success:", payload)
				} else if (tokenFromMessage !== arcaneaToken) {
					console.error("ARCANEATEL: Failed to identify Arcanea user, token mismatch:", payload)
				} else if (!email) {
					console.error("ARCANEATEL: Failed to identify Arcanea user, email missing:", payload)
				} else {
					console.debug("ARCANEATEL: Arcanea user identified:", email)
					setArcaneaIdentity(email)
					window.removeEventListener("message", handleMessage)
				}
			}
		}

		if (arcaneaToken) {
			console.debug("ARCANEATEL: fetching profile...")
			window.addEventListener("message", handleMessage)
			vscode.postMessage({
				type: "fetchProfileDataRequest",
			})
		} else {
			console.debug("ARCANEATEL: no Arcanea user")
			setArcaneaIdentity("")
		}

		return () => {
			window.removeEventListener("message", handleMessage)
		}
	}, [arcaneaToken])
	return arcaneaIdentity || machineId
}
