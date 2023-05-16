import React from "react";
import ReactDOM from "react-dom/client";
import MainApp from "./App";
import { store, persistor } from "./store/store";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import "./lib/reactifyCss";
import "./custom-css/responsive.css";
// import "./custom-css/landing-page.css"
import { NotificationContainer } from "react-notifications";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorFallback from "./control-components/error-boundry/error-boundry";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <>
    {/* <ErrorBoundary FallbackComponent={ErrorFallback}> */}
    <NotificationContainer />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </PersistGate>
    </Provider>
    {/* </ErrorBoundary> */}
  </>
  // </React.StrictMode>
);

reportWebVitals();
