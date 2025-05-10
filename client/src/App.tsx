import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.tsx';
import './i18n';
import { useGlobalStore } from './store/useGlobalStore.ts';
import ScreenLoader from './shared/components/ScreenLoader.tsx';

function App() {
  const isLoading = useGlobalStore((state) => state.isLoading);
  return (
    <BrowserRouter>
      <AppRoutes />
      {isLoading && <ScreenLoader />}
    </BrowserRouter>
  );
}

export default App;
