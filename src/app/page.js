"use client";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useMemo } from "react";

import { useDashboardData } from "@/hooks/useApi";
import {
  formatTickDataForTable,
  formatCampaignDataForTable,
  extractSummaryData,
} from "@/utils";
import { useAuth } from "@/contexts/authcontext";
import Header from "@/components/Header";
import AnimatedValue from "@/components/AnimatedValue";

export default function Home() {
  const { loading: authLoading } = useAuth();
  const {
    data,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useDashboardData();

  const dashboardData = data?.result?.[0]?.outputValues || {};
  const { tickRows, tickTotals } = formatTickDataForTable(dashboardData);

  const { campaignTitle, campaignRows } =
    formatCampaignDataForTable(dashboardData);

  const { summaryRows } = extractSummaryData(dashboardData);

  const summaryTotal = useMemo(
    () => summaryRows.reduce((total, curr) => total + curr.rawAmount, 0),
    [summaryRows]
  );

  const tickWebPercent = (dashboardData?.tickWebPercent * 100).toFixed(0) || 0;

  const pieChartDataCount = useMemo(() => {
    const totalCount = summaryRows.reduce((sum, row) => sum + row.count, 0);

    return summaryRows.map((row, index) => ({
      id: index,
      value: row.count,
      label: `${((row.count / totalCount) * 100).toFixed(0)}%`,
      color: index === 0 ? "#3b82f6" : "#10b981",
      source: row.source,
    }));
  }, [summaryRows]);

  const pieChartDataAmount = useMemo(() => {
    const totalAmount = summaryRows.reduce(
      (sum, row) => sum + row.rawAmount,
      0
    );

    return summaryRows.map((row, index) => ({
      id: index,
      value: row.rawAmount.toFixed(0),
      label: `${((row.rawAmount / totalAmount) * 100).toFixed(0)}%`,
      color: index === 0 ? "#3b82f6" : "#10b981",
      source: row.source,
    }));
  }, [summaryRows]);

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:gap-4 px-2 md:px-12">
        <div>
          <h1 className="font-bold text-lg md:text-4xl text-center lg:text-left lg:flex-1">
            <AnimatedValue value={dashboardData.tickTitle}>
              {dashboardData.tickTitle}
            </AnimatedValue>
          </h1>
          {!!dashboardData?.tickSubtitle && (
            <h2 className="font-light lg:font-bold text-xs md:text-md text-center lg:text-left lg:flex-1">
              <AnimatedValue value={dashboardData.tickSubtitle}>
                {dashboardData?.tickSubtitle}
              </AnimatedValue>
            </h2>
          )}
        </div>
        <div className="flex flex-col items-center justify-center my-1 gap-1 lg:my-2 lg:gap-2 lg:flex-row lg:gap-4">
          <div className="font-bold text-lg lg:text-4xl text-secondary">
            <AnimatedValue
              value={dashboardData?.tickTotal?.amount}
              animationType="value-changed-currency"
            >
              Segment:{" "}
              {dashboardData?.tickTotal?.amount?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }) || 0}
            </AnimatedValue>
          </div>
          <div
            className="font-bold radial-progress bg-primary text-primary-content border-primary border-4 flex-col items-center justify-center hidden lg:flex"
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full px-2 py-1 md:px-12 md:py-4">
        <section className="w-full">
          <div className="font-bold">
            <table className="table w-full text-sm md:text-xl table-fixed compact">
              <thead>
                <tr className="text-xs md:text-2xl h-8 md:h-auto">
                  <th className="text-left w-2/5 py-1 md:py-3">APPEAL</th>
                  <th className="text-right w-2/12 py-1 md:py-3">US</th>
                  <th className="text-right w-2/12 py-1 md:py-3">CA</th>
                  <th className="text-right w-2/12 py-1 md:py-3">INTL</th>
                  <th className="text-right w-1/6 py-1 md:py-3">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {tickRows.map((row, index) => (
                  <tr key={index} className="h-6 md:h-auto">
                    <th className="text-left truncate py-1 md:py-3">{row.appeal}</th>
                    <td className="text-right py-1 md:py-3">
                      <AnimatedValue value={row.us}>
                        {row.us?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td className="text-right py-1 md:py-3">
                      <AnimatedValue value={row.ca}>
                        {row.ca?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td className="text-right py-1 md:py-3">
                      <AnimatedValue value={row.intl}>
                        {row.intl?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td className="text-right py-1 md:py-3">
                      <AnimatedValue value={row.total}>
                        {row.total?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                  </tr>
                ))}
                <tr className="text-sm md:text-2xl bg-base-200 h-6 md:h-auto font-extrabold">
                  <th className="text-left truncate py-1 md:py-3">{tickTotals.appeal}</th>
                  <th className="text-right py-1 md:py-3">
                    <AnimatedValue value={tickTotals.us}>
                      {tickTotals.us?.toLocaleString() || 0}
                    </AnimatedValue>
                  </th>
                  <th className="text-right py-1 md:py-3">
                    <AnimatedValue value={tickTotals.ca}>
                      {tickTotals.ca?.toLocaleString() || 0}
                    </AnimatedValue>
                  </th>
                  <th className="text-right py-1 md:py-3">
                    <AnimatedValue value={tickTotals.intl}>
                      {tickTotals.intl?.toLocaleString() || 0}
                    </AnimatedValue>
                  </th>
                  <th className="text-right py-1 md:py-3">
                    <AnimatedValue value={tickTotals.total}>
                      {tickTotals.total?.toLocaleString() || 0}
                    </AnimatedValue>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 w-full mt-1 lg:mt-4 bg-primary rounded-xl shadow-md px-2 md:px-12">
        <section className="w-full xl:w-1/2">
          <h2 className="font-bold text-lg md:text-3xl text-center my-2 lg:my-4">
            <AnimatedValue value={summaryTotal}>
              {campaignTitle}:{" "}
              {summaryTotal.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }) || 0}
            </AnimatedValue>
          </h2>
          <div className="font-bold">
            <table className="table w-full text-sm md:text-xl table-fixed compact">
              <thead>
                <tr className="text-xs md:text-2xl h-8 md:h-auto">
                  <th className="text-left w-2/5 py-1 md:py-3">Category</th>
                  <th className="text-right w-2/12 py-1 md:py-3">US</th>
                  <th className="text-right w-2/12 py-1 md:py-3">CA</th>
                  <th className="text-right w-2/12 py-1 md:py-3">INTL</th>
                  <th className="text-right w-1/6 py-1 md:py-3">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {campaignRows.map((row, index) => (
                  <tr key={index} className="h-6 md:h-auto">
                    <th className="text-left truncate py-1 md:py-3">{row.header}</th>
                    <td className="text-right py-1 md:py-3">
                      <AnimatedValue value={row.us}>
                        {row.us?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td className="text-right py-1 md:py-3">
                      <AnimatedValue value={row.ca}>
                        {row.ca?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td className="text-right py-1 md:py-3">
                      <AnimatedValue value={row.intl}>
                        {row.intl?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td className="text-right py-1 md:py-3">
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

        <section className="w-full xl:w-1/2 mb-4">
          {/* <h2 className="font-bold text-xl md:text-3xl text-center my-2 text-white">
            Live vs Web
          </h2> */}

          {/* Two pie charts side by side */}
          <div className="flex flex-col xl:flex-row gap-4 items-center justify-center">
            {/* Count Chart */}
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-lg text-white mb-2 hidden lg:block">Count</h3>
              <div className="flex items-center justify-center h-60 hidden lg:flex">
                <PieChart
                  series={[
                    {
                      data: pieChartDataCount,
                      arcLabel: (item) => ``,
                      // `${item.source}: ${item.value.toLocaleString()} \n(${
                      //   item.label
                      // })`,
                      arcLabelMinAngle: 35,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 30, additionalRadius: -30 },
                    },
                  ]}
                  width={350}
                  height={240}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: "white",
                      fontWeight: "bold",
                      fontSize: 14,
                    },
                  }}
                  slotProps={{
                    legend: { hidden: true },
                    arc: {
                      style: { stroke: "white", strokeWidth: 2 },
                    },
                  }}
                />
              </div>

              {/* Count Legend */}
              <div className="flex justify-center gap-2 lg:gap-4 mt-2 lg:hidden">
                {summaryRows.map((row, index) => (
                  <div
                    key={`count-${row.source}-${index}`}
                    className="flex items-center gap-1 lg:gap-2"
                  >
                    <div
                      className="w-2 h-2 lg:w-3 lg:h-3 rounded"
                      style={{
                        backgroundColor: index === 0 ? "#3b82f6" : "#10b981",
                      }}
                    ></div>
                    <span className="text-white text-sm lg:text-xl font-semibold">
                      <AnimatedValue
                        value={row.count}
                        key={`count-legend-${row.source}`}
                      >
                        <span className="text-xs lg:text-lg">{row.source}</span>:{" "}
                        {row.count?.toLocaleString()}
                      </AnimatedValue>
                    </span>
                  </div>
                ))}
              </div>
              <div className="justify-center gap-4 mt-2 hidden lg:flex">
                {summaryRows.map((row, index) => (
                  <div
                    key={`count-${row.source}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded"
                      style={{
                        backgroundColor: index === 0 ? "#3b82f6" : "#10b981",
                      }}
                    ></div>
                    <span className="text-white text-xl font-semibold">
                      <AnimatedValue
                        value={row.count}
                        key={`count-legend-${row.source}`}
                      >
                        <span className="text-lg">{row.source}</span>:{" "}
                        {row.count?.toLocaleString()}
                      </AnimatedValue>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Chart */}
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-lg text-white mb-2 hidden lg:block">Amount</h3>
              <div className="flex items-center justify-center h-60 hidden lg:flex">
                <PieChart
                  series={[
                    {
                      data: pieChartDataAmount,
                      arcLabel: (item) => ``,
                      // `${item.source}: $${parseInt(
                      //   item.value
                      // ).toLocaleString()} \n(${item.label})`,
                      arcLabelMinAngle: 35,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 30, additionalRadius: -30 },
                    },
                  ]}
                  width={350}
                  height={240}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: "white",
                      fontWeight: "bold",
                      fontSize: 14,
                    },
                  }}
                  slotProps={{
                    legend: { hidden: true },
                    arc: {
                      style: { stroke: "white", strokeWidth: 2 },
                    },
                  }}
                />
              </div>

              {/* Amount Legend */}
              <div className="flex justify-center gap-2 lg:gap-4 mt-2 lg:hidden">
                {summaryRows.map((row, index) => (
                  <div
                    key={`amount-${row.source}-${index}`}
                    className="flex items-center gap-1 lg:gap-2"
                  >
                    <div
                      className="w-2 h-2 lg:w-3 lg:h-3 rounded"
                      style={{
                        backgroundColor: index === 0 ? "#3b82f6" : "#10b981",
                      }}
                    ></div>
                    <span className="text-white text-sm lg:text-2xl font-semibold">
                      <AnimatedValue
                        value={row.rawAmount}
                        key={`amount-legend-${row.source}`}
                      >
                        <span className="text-xs lg:text-lg">{row.source}</span>:{" "}
                        {row.rawAmount?.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                      </AnimatedValue>
                    </span>
                  </div>
                ))}
              </div>
              <div className="justify-center gap-4 mt-2 hidden lg:flex">
                {summaryRows.map((row, index) => (
                  <div
                    key={`amount-${row.source}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded"
                      style={{
                        backgroundColor: index === 0 ? "#3b82f6" : "#10b981",
                      }}
                    ></div>
                    <span className="text-white text-2xl font-semibold">
                      <AnimatedValue
                        value={row.rawAmount}
                        key={`amount-legend-${row.source}`}
                      >
                        <span className="text-lg">{row.source}</span>:{" "}
                        {row.rawAmount?.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                      </AnimatedValue>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
