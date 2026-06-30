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
    <div className="relative flex h-full overflow-hidden bg-gradient-to-br from-[#F3EFFF] via-[#EDE7FF] to-[#F6F1FF]">
      {/* Ambient aurora glow orbs — sit behind everything, never intercept clicks. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-aurora-drift absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-violet-400/20 blur-3xl" />
        <div className="animate-aurora-drift absolute -bottom-40 right-[-6rem] h-[32rem] w-[32rem] rounded-full bg-fuchsia-300/15 blur-3xl [animation-delay:-8s]" />
        <div className="animate-aurora-drift absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-indigo-300/10 blur-3xl [animation-delay:-4s]" />
      </div>
      {/* Invisible mount that silently syncs pre-existing completions to achievements. */}
      <AchievementSync />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="relative z-10 flex-1 overflow-y-auto">
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
