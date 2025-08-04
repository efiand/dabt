import { PROJECT_DESCRIPTION } from "#server/constants.js";
import { database } from "#server/lib/db.js";
import { html, sql } from "#server/lib/mark-template.js";

const sqlQuery = database.prepare(sql`SELECT heading, id FROM pages ORDER BY id;`);

/** @type {(page: DbItem, ampPrefix: string) => string} */
function renderItem({ heading, id }, ampPrefix) {
	return html`
		<li class="toc__item">
			<a class="toc__link" href="/dabt${ampPrefix}/${id}/">
				<span class="toc__content">${heading}</span>
			</a>
		</li>
	`;
}

export const mainRoute = {
	/** @type {RouteMethod} */
	GET({ isAmp }) {
		const pagesTemplate = sqlQuery
			.all()
			.map((page) => renderItem(page, isAmp ? `/amp` : ""))
			.join("");

		return {
			page: {
				description: PROJECT_DESCRIPTION,
				pageTemplate: html`<ol class="toc">${pagesTemplate}</ol>`,
			},
		};
	},
};
