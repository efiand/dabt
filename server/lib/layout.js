import { ALL_STYLESHEETS, BASE_URL, isDev, PROJECT_TITLE } from "#server/constants.js";
import { getCss } from "#server/lib/css.js";
import { html } from "#server/lib/mark-template.js";
import { APM_ASSETS_TEMPLATE } from "#server/templates/amp-assets.js";
import { YANDEX_METRIKA_TEMPLATE } from "#server/templates/yandex-metrika.js";

/** @type {(isAmp?: boolean, hasForms?: boolean) => Promise<string>} */
async function renderAssets(isAmp) {
	if (isAmp) {
		const css = await getCss(ALL_STYLESHEETS);

		return html`
			<style amp-custom>${css}</style>
			${APM_ASSETS_TEMPLATE}
		`;
	}

	const linkTemplates = ALL_STYLESHEETS.map(
		({ media, name }) => html`<link rel="stylesheet" href="/dabt/css/${name}.css" ${media ? `media="${media}"` : ""}>`,
	);
	return html`
		${linkTemplates.join("")}
		${isDev ? html`<script src="/js/dev.js" type="module"></script>` : ""}
	`;
}

/** @type {(pathname: string, isAmp: boolean) => string} */
function renderUrlMeta(pathname, isAmp) {
	const page = pathname === "/" ? "" : pathname;

	let ampTemplate = "";
	if (!isAmp) {
		const ampUrl = pathname === "/" ? "/amp" : `/amp${pathname}`;
		ampTemplate = html`<link rel="ampurl" href="${BASE_URL}${ampUrl}/">`;
	}

	return html`
		${ampTemplate}
		<link rel="canonical" href="${BASE_URL}${page}/">
		<meta property="og:url" content="/dabt${page}/">
	`;
}

/** @type {(data: LayoutData) => Promise<string>} */
export async function renderLayout({ isAmp = false, description, heading = "", pageTemplate = "", pathname = "" }) {
	const title = [PROJECT_TITLE, heading].filter(Boolean).join(". ");
	const assetsTemplate = await renderAssets(isAmp);

	return html`
		<!DOCTYPE html>
		<html lang="ru" prefix="og: http://ogp.me/ns#" ${isAmp ? "⚡" : ""}>
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta name="apple-mobile-web-app-title" content="${PROJECT_TITLE}">

			<title>${title}</title>
			<meta name="description" content="${description}">
			${renderUrlMeta(pathname, isAmp)}
			<meta property="og:title" content="${title}">
			<meta property="og:description" content="${description}">
			<meta property="og:locale" content="ru_RU">
			<meta property="og:type" content="website">
			<meta property="og:site_name" content="${PROJECT_TITLE}">
			<meta property="og:image" content="/dabt/web-app-manifest-512x512.png">
			<meta property="og:image:width" content="512">
			<meta property="og:image:height" content="512">

			${assetsTemplate}

			<link rel="icon" type="image/png" href="/dabt/favicon-96x96.png" sizes="96x96">
			<link rel="icon" type="image/svg+xml" href="/dabt/favicon.svg">
			<link rel="shortcut icon" href="/dabt/favicon.ico">
			<link rel="apple-touch-icon" sizes="180x180" href="/dabt/apple-touch-icon.png">
			<link rel="manifest" href="/dabt/site.webmanifest">

			<link rel="preload" href="/dabt/fonts/tt-polls-normal-400.woff2" as="font" crossorigin>
			<link rel="preload" href="/dabt/images/back.webp" as="image" type="image/webp" media="(min-width: 928px)">
		</head>

		<body class="layout">
			${isAmp || isDev ? "" : YANDEX_METRIKA_TEMPLATE}

			<main class="layout__main _container">
				<h1>${heading || PROJECT_TITLE}</h1>
				${pageTemplate}
			</main>
		</body>
		</html>
	`;
}
