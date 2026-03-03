import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardOverview } from "./pages/DashboardOverview";
import { ManagersPage } from "./pages/ManagersPage";
import { CallsPage } from "./pages/CallsPage";
import { TasksPage } from "./pages/TasksPage";
import { PlansPage } from "./pages/PlansPage";
import { ForecastPage } from "./pages/ForecastPage";
import { SettingsPage } from "./pages/SettingsPage";
import { I18nProvider } from "./i18n";

function App() {
  return (
    <I18nProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/managers" element={<ManagersPage />} />
          <Route path="/calls" element={<CallsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </I18nProvider>
  );
}

export default App;

