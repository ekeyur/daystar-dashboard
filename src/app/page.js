"use client";
// http://localhost:3000/?piechart=amount

import { PieChart } from "@mui/x-charts/PieChart";
import { use, useMemo } from "react";

import { useDashboardData } from "@/hooks/useApi";
import {
  formatTickDataForTable,
  formatCampaignDataForTable,
  extractSummaryData,
} from "@/utils";
import { useAuth } from "@/contexts/authcontext";
import Header from "@/components/Header";
import AnimatedValue from "@/components/AnimatedValue";

export default function Home({ searchParams }) {
  const { loading: authLoading } = useAuth();
  const {
    data,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useDashboardData();

  // Use React.use() to unwrap searchParams
  const resolvedSearchParams = use(searchParams);
  const { piechart } = resolvedSearchParams;
  console.log("Piechart param:", piechart);

  const dashboardData = data?.result?.[0]?.outputValues || {};
  const { tickRows, tickTotals } = formatTickDataForTable(dashboardData);

  const { campaignTitle, campaignRows } =
    formatCampaignDataForTable(dashboardData);

  const { summaryRows } = extractSummaryData(dashboardData);

  const tickWebPercent = (dashboardData?.tickWebPercent * 100).toFixed(2) || 0;

  const pieChartData = useMemo(() => {
    const totalCount = summaryRows.reduce((sum, row) => sum + row.count, 0);
    const totalAmount = summaryRows.reduce(
      (sum, row) => sum + row.rawAmount,
      0
    );

    return summaryRows.map((row, index) => ({
      id: index,
      value: piechart ? row.rawAmount.toFixed(0) : row.count,
      label: piechart
        ? `${((row.rawAmount / totalAmount) * 100).toFixed(0)}%`
        : `${((row.count / totalCount) * 100).toFixed(0)}%`,
      color: index === 0 ? "#3b82f6" : "#10b981",
      source: row.source,
    }));
  }, [summaryRows, piechart]);

  if (authLoading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-100">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex items-center justify-center h-100">
        <span className="text-red-500">
          Error loading dashboard data: {dashboardError.message}
        </span>
      </div>
    );
  }

  return (
    <div className="">
      <Header />
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:gap-4 px-4 md:px-12">
        <div>
          <h1 className="font-bold text-xl md:text-4xl text-center lg:text-left lg:flex-1">
            <AnimatedValue value={dashboardData.tickTitle}>
              {dashboardData.tickTitle}
            </AnimatedValue>
          </h1>
          {!!dashboardData?.tickSubtitle && (
            <h2 className="font-light lg:font-bold text-sm md:text-md text-center lg:text-left lg:flex-1">
              <AnimatedValue value={dashboardData.tickSubtitle}>
                {dashboardData?.tickSubtitle}
              </AnimatedValue>
            </h2>
          )}
        </div>
        <div className="flex flex-col items-center justify-center my-2 gap-2 lg:flex-row lg:gap-4">
          <div
            className="font-bold radial-progress bg-primary text-primary-content border-primary border-4 flex flex-col items-center justify-center"
            style={{ "--value": tickWebPercent }}
            aria-valuenow={tickWebPercent}
            role="progressbar"
          >
            <AnimatedValue
              value={tickWebPercent}
              className="block leading-none"
            >
              {tickWebPercent}%
            </AnimatedValue>
            <span className="block text-xs lg:text-sm">web</span>
          </div>
          <div className="font-bold text-2xl lg:text-4xl text-secondary">
            <AnimatedValue
              value={dashboardData?.tickTotal?.amount}
              animationType="value-changed-currency"
            >
              {dashboardData?.tickTotal?.amount?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }) || 0}
            </AnimatedValue>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full p-4 md:px-12">
        <section className="w-full">
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-md md:text-xl">
              <thead>
                <tr className="text-xs md:text-2xl">
                  <th className="text-left">APPEAL</th>
                  <th className="text-right">US</th>
                  <th className="text-right">CA</th>
                  <th className="text-right">INTL</th>
                  <th className="text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {tickRows.map((row, index) => (
                  <tr key={index}>
                    <th className="text-left">{row.appeal}</th>
                    <td className="text-right">
                      <AnimatedValue value={row.us}>{row.us}</AnimatedValue>
                    </td>
                    <td className="text-right">
                      <AnimatedValue value={row.ca}>{row.ca}</AnimatedValue>
                    </td>
                    <td className="text-right">
                      <AnimatedValue value={row.intl}>{row.intl}</AnimatedValue>
                    </td>
                    <td className="text-right">
                      <AnimatedValue value={row.total}>
                        {row.total}
                      </AnimatedValue>
                    </td>
                  </tr>
                ))}
                <tr className="text-xs md:text-2xl bg-base-200">
                  <th className="text-left">{tickTotals.appeal}</th>
                  <th className="text-right">
                    <AnimatedValue value={tickTotals.us}>
                      {tickTotals.us}
                    </AnimatedValue>
                  </th>
                  <th className="text-right">
                    <AnimatedValue value={tickTotals.ca}>
                      {tickTotals.ca}
                    </AnimatedValue>
                  </th>
                  <th className="text-right">
                    <AnimatedValue value={tickTotals.intl}>
                      {tickTotals.intl}
                    </AnimatedValue>
                  </th>
                  <th className="text-right">
                    <AnimatedValue value={tickTotals.total}>
                      {tickTotals.total}
                    </AnimatedValue>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full mt-4 bg-primary rounded-xl shadow-md px-4 md:px-12">
        <section className="w-full lg:w-2/3">
          <h2 className="font-bold text-xl md:text-3xl text-center my-4">
            <AnimatedValue value={campaignTitle}>{campaignTitle}</AnimatedValue>
          </h2>
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-md md:text-xl">
              <thead>
                <tr className="text-xs md:text-2xl">
                  <th className="text-left">Category</th>
                  <th className="text-right">US</th>
                  <th className="text-right">CA</th>
                  <th className="text-right">INTL</th>
                  <th className="text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {campaignRows.map((row, index) => (
                  <tr key={index}>
                    <th className="text-left">{row.header}</th>
                    <td className="text-right">
                      <AnimatedValue value={row.us}>
                        {row.us?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td className="text-right">
                      <AnimatedValue value={row.ca}>
                        {row.ca?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td className="text-right">
                      <AnimatedValue value={row.intl}>
                        {row.intl?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td className="text-right">
                      <AnimatedValue value={row.total}>
                        {row.total?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="w-full lg:w-1/3">
          <h2 className="font-bold text-xl md:text-3xl text-center my-2 text-white">
            Live vs Web
          </h2>
          <div className="flex items-center justify-center h-60">
            <PieChart
              series={[
                {
                  data: pieChartData,
                  arcLabel: (item) => `${item.source}: \n${item.label}`,
                  arcLabelMinAngle: 35,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              width={400}
              height={240}
              slotProps={{
                legend: { hidden: true },
                arc: {
                  style: { stroke: "white", strokeWidth: 2 },
                },
              }}
            />
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6">
            {summaryRows.map((row, index) => (
              <div
                key={`${row.source}-${index}`}
                className="flex items-center gap-2"
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: index === 0 ? "#3b82f6" : "#10b981",
                  }}
                ></div>
                <span className="text-white font-semibold">
                  <AnimatedValue
                    value={piechart ? row.rawAmount : row.count}
                    key={`legend-${row.source}`}
                  >
                    {row.source}:{" "}
                    {piechart
                      ? row.rawAmount?.toFixed(0).toLocaleString({
                          style: "currency",
                          currency: "USD",
                        })
                      : row.count?.toFixed(0).toLocaleString()}
                  </AnimatedValue>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
