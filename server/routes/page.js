import { database } from "#server/lib/db.js";
import { html, sql } from "#server/lib/mark-template.js";

const sqlQuery = database.prepare(sql`
	SELECT
		heading,
		description,
		content,
		writedAt,
		STRFTIME('%d.%m.%Y', writedAt ) AS formattedWritedAt
	FROM pages WHERE id = ? ORDER BY id;
`);

export const pageRoute = {
	/** @type {RouteMethod} */
	GET({ isAmp, pathname }) {
		const { content, formattedWritedAt, description, heading, writedAt } =
			sqlQuery.get(Number(pathname.slice(1))) || {};

		const contentTemplate = content
			? html`
					${content}
					<time class="separated" datetime="${writedAt}">${formattedWritedAt}</time>
				`
			: "";

		return {
			page: {
				description: `${description}`,
				heading: heading ? `${heading}` : "Страница не найдена",
				pathname,
				pageTemplate: html`
					${contentTemplate}
					<nav>
						<a class="toc-link" href="/dabt${isAmp ? "/amp" : ""}/" aria-label="Содержание"></a>
					</nav>
				`,
			},
		};
	},
};
