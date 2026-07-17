import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './app/providers/AppProvider';
import AppRoutes from './app/router/AppRoutes';
import './shared/styles/index.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
