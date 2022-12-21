import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId="99821976135-cepj7cubjqcsq4h2ma970k4epokc84mk.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </GoogleOAuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  // </React.StrictMode>
);
