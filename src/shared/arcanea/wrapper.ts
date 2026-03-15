export interface ArcaneaWrapperProperties {
	arcaneaWrapped: boolean
	arcaneaWrapper: string | null
	arcaneaWrapperTitle: string | null
	arcaneaWrapperCode: string | null
	arcaneaWrapperVersion: string | null
}

export const JETBRAIN_PRODUCTS = {
	AC: {
		urlScheme: "appcode",
		name: "AppCode",
	},
	IC: {
		urlScheme: "idea",
		name: "IntelliJ IDEA",
	},
	IU: {
		urlScheme: "idea",
		name: "IntelliJ IDEA",
	},
	AS: {
		urlScheme: "android",
		name: "Android Studio",
	},
	AI: {
		urlScheme: "android",
		name: "Android Studio",
	},
	WS: {
		urlScheme: "webstorm",
		name: "WebStorm",
	},
	PS: {
		urlScheme: "phpstorm",
		name: "PhpStorm",
	},
	PY: {
		urlScheme: "pycharm",
		name: "PyCharm Professional",
	},
	PC: {
		urlScheme: "pycharm",
		name: "PyCharm Community",
	},
	GO: {
		urlScheme: "goland",
		name: "GoLand",
	},
	CL: {
		urlScheme: "clion",
		name: "CLion",
	},
	RD: {
		urlScheme: "rider",
		name: "Rider",
	},
	RM: {
		urlScheme: "rubymine",
		name: "RubyMine",
	},
	DB: {
		urlScheme: "datagrip",
		name: "DataGrip",
	},
	DS: {
		urlScheme: "dataspell",
		name: "DataSpell",
	},
	JB: {
		urlScheme: "jetbrains",
		name: "JetBrains",
	},
}
