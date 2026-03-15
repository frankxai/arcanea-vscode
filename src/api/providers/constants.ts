import { X_ARCANEA_VERSION } from "../../shared/arcanea/headers"
import { Package } from "../../shared/package"

export const DEFAULT_HEADERS = {
	"HTTP-Referer": "https://arcanea.ai",
	"X-Title": "Arcanea",
	[X_ARCANEA_VERSION]: Package.version,
	"User-Agent": `Arcanea-Code/${Package.version}`,
}
