import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RankUpOverlay from "./components/RankUpOverlay";
import ResetButton from "./components/ResetButton";
import AchievementSync from "./components/AchievementSync";
import CelebrationToast from "./components/CelebrationToast";
import BestNextTaskButton from "./components/BestNextTaskButton";
import DashboardHome from "./pages/DashboardHome";
import ActivityPage from "./pages/ActivityPage";
import AchievementMap from "./pages/AchievementMap";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full bg-slate-50">
      {/* Invisible mount that silently syncs pre-existing completions to achievements. */}
      <AchievementSync />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/achievements" element={<AchievementMap />} />
          <Route path="/:groupSlug/:itemSlug" element={<ActivityPage />} />
        </Routes>
      </main>
      {/* Portals over the current route; does not affect navigation/page state. */}
      <RankUpOverlay />
      {/* Achievement toast — sits above the reset button. */}
      <CelebrationToast />
      {/* Appears next to the reset button once the quiz is complete. */}
      <BestNextTaskButton />
      {/* Always-visible control to wipe all saved progress. */}
      <ResetButton />
    </div>
  );
}
