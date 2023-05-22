import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SocketContextProvider } from './Context/SocketThing';
import { SocketProviderGesture } from './Context/SocketHand';
import { BrowserRouter } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
   <SocketProviderGesture>
  <SocketContextProvider>
      <React.StrictMode>
          <App/>
      </React.StrictMode>
    </SocketContextProvider>
    </SocketProviderGesture>
  </BrowserRouter>
);
