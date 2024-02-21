// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { process } from "std-env";

export default defineNuxtConfig({
	ssr: false,
	modules: [
		"@pinia/nuxt",
		"@pinia-plugin-persistedstate/nuxt",
		"nuxt-lodash",
	],
	pinia: {
		autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
	},
	css: [
		"vuetify/lib/styles/main.sass",
		"@vuepic/vue-datepicker/dist/main.css",
		"@/assets/css/main.scss",
		"@/assets/css/font.scss",
	],
	build: {
		transpile: ["vuetify", "@vuepic/vue-datepicker"],
	},
	vite: {
		define: {
			"process.env.DEBUG": false,
		},
	},
	runtimeConfig: {
		public: {
			baseUrl: process.env.BASE_URL || "/",
			apiUrl: process.env.API_URL || "/api",
		},
	},
});
