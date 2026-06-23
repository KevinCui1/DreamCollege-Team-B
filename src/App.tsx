import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./pages/DashboardHome";
import ActivityPage from "./pages/ActivityPage";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full bg-slate-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/:groupSlug/:itemSlug" element={<ActivityPage />} />
        </Routes>
      </main>
    </div>
  );
}
