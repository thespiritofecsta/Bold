import { Routes, Route, Outlet } from 'react-router-dom';
import WalletProvider from "@/components/WalletProvider";
import Home from '@/pages/Home';
import MarketPage from '@/pages/MarketPage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ProfilePage from '@/pages/ProfilePage';
import TermsOfService from '@/pages/TermsOfService';
import Footer from '@/components/Footer';
import MarqueeBar from '@/components/MarqueeBar'; // Import the new MarqueeBar component

function Layout() {
  return (
    <div className="dark flex flex-col min-h-screen">
      <MarqueeBar /> {/* Include the MarqueeBar component at the top */}
      <WalletProvider>
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </WalletProvider>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/market/:marketId" element={<MarketPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
