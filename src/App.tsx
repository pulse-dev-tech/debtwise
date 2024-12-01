import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Calculators from './pages/Calculators';
import Goals from './pages/Goals';
import Budget from './pages/Budget';
import Strategies from './pages/Strategies';
import Schedule from './pages/Schedule';
import Insights from './pages/Insights';
import Education from './pages/Education';
import Alerts from './pages/Alerts';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/education" element={<Education />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;