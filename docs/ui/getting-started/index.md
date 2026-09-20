---
title: Getting started
---

Install the package, import the stylesheet, wrap the screen in a frame.

- [Installation](installation.md)

The shortest useful screen is a frame, a top bar and a masthead:

```jsx
import {
	defineBrand,
	LinchpinAdminFrame,
	LinchpinAdminPage,
	LinchpinAdminTopBar,
} from '@linchpinagency/ui';
import '@linchpinagency/ui/style.css';
import PsstLogo from './logo';

const BRAND = defineBrand( { primary: '#318873', deep: '#082318' } );

export default function App() {
	return (
		<LinchpinAdminFrame
			plugin={ { name: 'Psst', slug: 'psst', version: '2.1.0' } }
			brand={ BRAND }
			topBar={ <LinchpinAdminTopBar logo={ <PsstLogo /> } /> }
		>
			<LinchpinAdminPage subTitle="One-time secrets.">
				{ /* the screen */ }
			</LinchpinAdminPage>
		</LinchpinAdminFrame>
	);
}
```

The top bar expects the plugin's own mark — a node, or a URL to a file the plugin ships. The
name is the fallback for a plugin that has no artwork yet, not the default.

Everything else — section navigation, the two-column body, the help sidebar, the About page —
is added a component at a time. See [Components](../components/index.md).
