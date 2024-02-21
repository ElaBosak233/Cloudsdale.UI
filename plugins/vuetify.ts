// plugins/vuetify.js
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from "vuetify/util/colors";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import "@fontsource/jetbrains-mono";

export default defineNuxtPlugin((nuxtApp) => {
	const Vuetify = createVuetify({
		ssr: false,
		theme: {
			defaultTheme: "pgsThemeLight",
			themes: {
				pgsThemeLight: {
					dark: false,
					colors: {
						primary: colors.blue.darken4,
					},
				},
				pgsThemeDark: {
					dark: true,
					colors: {
						primary: colors.blue.darken4,
					},
				},
			},
		},
		components,
		directives,
		icons: {
			defaultSet: "mdi",
			aliases,
			sets: {
				mdi,
			},
		},
	});
	nuxtApp.vueApp.use(Vuetify);
});
