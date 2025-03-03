import React, { Suspense } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { RuteoPrincipal } from './routes/RuteoPrincipal';

const cargarComponente = ()=>{
 return(
 <div className='d-flex justify-content-center'>
    <div className='mt-3'>
      <span className='spinner-grow-sm fs-4 fw-bold text-danger'></span>
      <br/>
      <span className='text-center fst-italic fs-3 text-primary'>Cargando ...</span>
    </div>
  </div>
 );
}

function App() {
  return (
    <BrowserRouter>
    <ToastContainer/>
    <Suspense fallback={cargarComponente()}>
    <RuteoPrincipal/>
    </Suspense>
    
    </BrowserRouter>    
  );
}

export default App;
