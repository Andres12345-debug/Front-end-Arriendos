// App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContextProvider } from '../src/app/shared/components/Theme/ThemeContext';
import { RuteoPrincipal } from './routes/RuteoPrincipal';

const cargarComponente = () => (
  <div className="d-flex justify-content-center">
    <div className="mt-3">
      <span className="spinner-grow-sm fs-4 fw-bold text-danger"></span>
      <br />
      <span className="text-center fst-italic fs-3 text-primary">Cargando ...</span>
    </div>
  </div>
);

function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <ToastContainer />
        <Suspense fallback={cargarComponente()}>
          <RuteoPrincipal />
        </Suspense>
      </BrowserRouter>
    </ThemeContextProvider>
  );
}

export default App;
