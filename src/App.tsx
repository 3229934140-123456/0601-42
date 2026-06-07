import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ChannelWall from "@/pages/ChannelWall";
import LiveDetail from "@/pages/LiveDetail";
import InteractionPage from "@/pages/Interaction";
import ProductsPage from "@/pages/Products";
import RisksPage from "@/pages/Risks";
import AnalyticsPage from "@/pages/Analytics";
import SchedulePage from "@/pages/Schedule";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ChannelWall />} />
          <Route path="channels" element={<ChannelWall />} />
          <Route path="live" element={<LiveDetail />} />
          <Route path="live/:id" element={<LiveDetail />} />
          <Route path="interaction" element={<InteractionPage />} />
          <Route path="interaction/:id" element={<InteractionPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductsPage />} />
          <Route path="risks" element={<RisksPage />} />
          <Route path="risks/:id" element={<RisksPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
