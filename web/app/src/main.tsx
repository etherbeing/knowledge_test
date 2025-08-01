import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/index.ts";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HelmetProvider>
            <SnackbarProvider maxSnack={5} preventDuplicate>
              <App />
            </SnackbarProvider>
          </HelmetProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
