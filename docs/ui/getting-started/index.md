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
	LinchpinAdminMasthead,
	LinchpinAdminTopBar,
} from '@linchpinagency/ui';
import '@linchpinagency/ui/style.css';

const BRAND = defineBrand( { primary: '#318873', deep: '#082318' } );

export default function App() {
	return (
		<LinchpinAdminFrame
			plugin={ { name: 'Psst', slug: 'psst', version: '2.1.0' } }
			brand={ BRAND }
			topBar={ <LinchpinAdminTopBar /> }
		>
			<LinchpinAdminMasthead description="One-time secrets." />
		</LinchpinAdminFrame>
	);
}
```

Everything else — tabs, the two-column body, the help sidebar, the About page — is added a
component at a time. See [Components](../components/index.md).
