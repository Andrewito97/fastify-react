import React from 'react';
import { createRoot, Root } from 'react-dom/client';

import { App } from './modules/app/App';

const container: Element = document.getElementById('root') as Element;
const root: Root = createRoot(container);

root.render(<App />);
