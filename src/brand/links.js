/**
 * Where a plugin's admin screen sends people, and how we know it sent them.
 */

const SUPPORT_EMAIL = 'sayhi@linchpin.com';
const LINCHPIN_URL = 'https://linchpin.com/';

/**
 * The links every Linchpin admin screen needs.
 *
 * UTM parameters follow the convention linchpin-blocks established, so the
 * agency site can tell which plugin sent a visitor. `plugin` is the slug, not
 * the display name, because that is what lands in the analytics report.
 *
 * @param {Object} options                Options.
 * @param {string} options.plugin         Plugin slug, e.g. `psst`.
 * @param {string} [options.repo]         GitHub repo, `owner/name`. Defaults to `linchpin/<plugin>`.
 * @param {string} [options.docs]         Documentation URL. Defaults to the repo README.
 * @param {string} [options.supportEmail] Support address.
 * @param {string} [options.campaign]     UTM campaign. Defaults to `admin`.
 * @return {Object} Links, ready to spread onto a component.
 */
export function linchpinLinks( {
	plugin,
	repo,
	docs,
	supportEmail = SUPPORT_EMAIL,
	campaign = 'admin',
} = {} ) {
	if ( ! plugin ) {
		throw new Error( 'linchpinLinks: a plugin slug is required.' );
	}

	const repository = repo || `linchpin/${ plugin }`;
	const github = `https://github.com/${ repository }`;
	const utm = new URLSearchParams( {
		utm_source: plugin,
		utm_medium: 'plugin',
		utm_campaign: campaign,
	} );

	return Object.freeze( {
		linchpin: `${ LINCHPIN_URL }?${ utm.toString() }`,
		github,
		issues: `${ github }/issues`,
		readme: docs || `${ github }#readme`,
		support: `mailto:${ supportEmail }`,
		supportEmail,
	} );
}
