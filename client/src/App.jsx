import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LeadershipPage from './pages/LeadershipPage';
import ProgramsPage from './pages/ProgramsPage';
import ConferencePage from './pages/ConferencePage';
import RegistrationPage from './pages/RegistrationPage';
import PaymentPoliciesPage from './pages/PaymentPoliciesPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import CommitteeGuidePage from './pages/CommitteeGuidePage';
import AdminPage from './pages/AdminPage';
import PaymentTestPage from './pages/PaymentTestPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="leadership" element={<LeadershipPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="conference" element={<ConferencePage />} />
        <Route path="registration" element={<RegistrationPage />} />
        <Route path="payment-policies" element={<PaymentPoliciesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="committee-guides/:committeeId" element={<CommitteeGuidePage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="payment-test" element={<PaymentTestPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
