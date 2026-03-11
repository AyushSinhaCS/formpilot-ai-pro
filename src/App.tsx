/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreateFormPage from "./pages/CreateFormPage";
import FormPage from "./pages/FormPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateFormPage />} />
        <Route path="/form/:id" element={<FormPage />} />
        <Route path="/dashboard/:id" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
