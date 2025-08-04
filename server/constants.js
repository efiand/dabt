const { DEV, PORT } = process.env;

export const isDev = Boolean(DEV);

export const port = Number(PORT) || 4102;
export const host = `http://localhost:${port}`;
export const baseLocalUrl = `${host}/dabt`;

export const BASE_URL = "https://efiand.github.io/dabt";

export const PROJECT_TITLE = "Сказки о деде Андрее и бабке Тане";

export const PROJECT_DESCRIPTION = "Юмор. Современные бытовые сказки о деде Андрее и бабке Тане.";

/** @type {Record<string, string>} */
export const STATIC_MIME_TYPES = {
	".js": "application/javascript",
	".css": "text/css",
	".html": "text/html",
	".png": "image/png",
	".ico": "image/x-icon",
	".svg": "image/svg+xml",
	".txt": "plain/text",
	".webmanifest": "application/json",
	".webp": "image/webp",
	".woff2": "font/woff2",
};

/** @type {Set<string>} */
export const staticExtensions = new Set(Object.keys(STATIC_MIME_TYPES));

/** @type {Stylesheet[]} */
export const ALL_STYLESHEETS = [
	{
		name: "common",
	},
	{
		name: "hover",
		media: "(hover: hover)",
	},
	{
		name: "motion",
		media: "(prefers-reduced-motion: no-preference)",
	},
	{
		name: "768+",
		media: "print, (min-width: 768px)",
	},
	{
		name: "928+",
		media: "print, (min-width: 928px)",
	},
	{
		name: "print",
		media: "print",
	},
];
