// // src/App.tsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import MainLayout from "./layout/MainLayout";
// import DashboardPage from "./pages/DashboardPage";
// import CalendarPage from "./pages/CalendarPage";
// import ProfilePage from "./pages/ProfilePage";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<DashboardPage />} />
//           <Route path="/dashboard" element={<DashboardPage />} />
//           <Route path="/calendar" element={<CalendarPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
       <Route path="/" element={<LandingPage />} />
       <Route path="/signup" element={<SignupPage />} />
       <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
