import { render } from 'preact';
import { App } from './app/App';
import './styles/app.css';

const target = document.getElementById('app');
if (target) render(<App />, target);
