/*
 * Linchpin's admin chrome for WordPress plugins — @linchpinagency/ui.
 *
 * Wrappers and layout primitives on top of @wordpress/admin-ui,
 * @wordpress/ui and @wordpress/components. Every @wordpress/* import is a
 * peer dependency: the consuming plugin's build resolves one copy, and a
 * nested one would fork the ThemeProvider context as well as double the
 * bytes.
 *
 * Import the stylesheet once, from the plugin's own entry point:
 *
 *     import '@linchpinagency/ui/style.css';
 */

export { default as LinchpinAdminFrame } from './components/admin-frame';
export { default as LinchpinAdminTopBar } from './components/admin-top-bar';
export { default as LinchpinAdminPage } from './components/admin-page';
export { default as LinchpinAdminLayout } from './components/admin-layout';
export { default as LinchpinAdminNav } from './components/admin-nav';
export { default as LinchpinBreadcrumbs } from './components/breadcrumbs';
export { default as LinchpinNotices } from './components/notices';
export { default as LinchpinAdminFooter } from './components/admin-footer';
export { default as LinchpinLogo } from './components/linchpin-logo';
export { default as VersionBadge } from './components/version-badge';

export { default as SettingsCard } from './components/cards/settings-card';
export { default as HelpCard } from './components/cards/help-card';
export { default as FeatureListCard } from './components/cards/feature-list-card';
export { default as AboutLinchpinCard } from './components/cards/about-linchpin-card';
export { default as AboutLinchpinPage } from './components/about-linchpin-page';
export { default as DangerZone } from './components/danger-zone';

export { sectionNavigation, currentSection } from './utils/navigation';

export {
	default as usePlatformStatus,
	statusLabel,
} from './hooks/use-platform-status';

export { defineBrand, brandStyle } from './brand/define-brand';
export { LINCHPIN_COLORS, colorVar, colorVars } from './brand/colors';
export { linchpinLinks } from './brand/links';

export { AdminContext, useAdminContext } from './context';
export { aboutBlurb, aboutPageCopy } from './copy';
