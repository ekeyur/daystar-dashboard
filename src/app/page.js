"use client";

import {
  formatTickDataForTable,
  formatCampaignDataForTable,
  extractSummaryData,
} from "@/utils";
import DashboardClient from "@/components/DashboardClient";
import { useDashboardStream } from "@/hooks/useDashboardStream";

export default function Home() {
  const { data: dashboardData, isLoading, error } = useDashboardStream();
  const { tickRows, tickTotals } = formatTickDataForTable(dashboardData);
  const { campaignTitle, campaignRows } = formatCampaignDataForTable(dashboardData);
  const { summaryRows } = extractSummaryData(dashboardData);

  const summaryTotal = summaryRows.reduce((total, curr) => total + curr.rawAmount, 0);
  const tickWebPercent = (dashboardData?.tickWebPercent * 100).toFixed(0) || 0;

  const totalCount = summaryRows.reduce((sum, row) => sum + row.count, 0);
  const pieChartDataCount = summaryRows.map((row, index) => ({
    id: index,
    value: row.count,
    label: `${((row.count / totalCount) * 100).toFixed(0)}%`,
    color: index === 0 ? "#3b82f6" : "#10b981",
    source: row.source,
  }));

  const totalAmount = summaryRows.reduce((sum, row) => sum + row.rawAmount, 0);
  const pieChartDataAmount = summaryRows.map((row, index) => ({
    id: index,
    value: row.rawAmount.toFixed(0),
    label: `${((row.rawAmount / totalAmount) * 100).toFixed(0)}%`,
    color: index === 0 ? "#3b82f6" : "#10b981",
    source: row.source,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-100">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-100">
        <span className="text-red-500">
          Error loading dashboard data: {error.message}
        </span>
      </div>
    );
  }

  return (
    <DashboardClient
      dashboardData={dashboardData}
      tickRows={tickRows}
      tickTotals={tickTotals}
      campaignTitle={campaignTitle}
      campaignRows={campaignRows}
      summaryRows={summaryRows}
      summaryTotal={summaryTotal}
      tickWebPercent={tickWebPercent}
      pieChartDataCount={pieChartDataCount}
      pieChartDataAmount={pieChartDataAmount}
    />
  );
}
