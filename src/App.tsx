/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InvestigationProvider, useInvestigation } from './context/InvestigationContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PresentationGuide } from './components/PresentationGuide';
import { DashboardView } from './components/dashboard/DashboardView';
import { CasesEvidenceView } from './components/cases/CasesEvidenceView';
import { NetworkAnalysisView } from './components/network/NetworkAnalysisView';
import { FinancialTrailView } from './components/financial/FinancialTrailView';
import { ReportsView } from './components/reports/ReportsView';
import { LoginPage } from './components/auth/LoginPage';

const MainContent: React.FC = () => {
  const { activeTab } = useInvestigation();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-[#050c20] to-indigo-950/25">
      <Header />
      
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'cases' && <CasesEvidenceView />}
        {activeTab === 'network' && <NetworkAnalysisView />}
        {activeTab === 'financial' && <FinancialTrailView />}
        {activeTab === 'reports' && <ReportsView />}
      </main>

      {/* Floating Presentation Mode Guide */}
      <PresentationGuide />
    </div>
  );
};

const AppShell: React.FC = () => {
  const { isAuthenticated } = useInvestigation();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-[#04091a] to-indigo-950/20 text-slate-100 font-sans selection:bg-[#00f2fe]/30 selection:text-[#00f2fe]">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default function App() {
  return (
    <InvestigationProvider>
      <AppShell />
    </InvestigationProvider>
  );
}
