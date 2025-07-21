"use client";

import { useDashboardData } from "@/hooks/useApi";
import { formatTickDataForTable, formatCampaignDataForTable } from "@/utils";
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

  const tickWebPercent = (dashboardData?.tickWebPercent * 100).toFixed(2) || 0;

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:gap-4 px-2 md:px-4">
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
        <div className="flex flex-col items-center justify-center my-2 gap-2 lg:flex-row lg:gap-4 px-2 md:px-6">
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

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <section className="w-full">
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-md md:text-xl">
              <thead>
                <tr className="text-xs md:text-2xl">
                  <th>APPEAL</th>
                  <th>US</th>
                  <th>CA</th>
                  <th>INTL</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {tickRows.map((row, index) => (
                  <tr key={index}>
                    <th>{row.appeal}</th>
                    <td>
                      <AnimatedValue value={row.us}>{row.us}</AnimatedValue>
                    </td>
                    <td>
                      <AnimatedValue value={row.ca}>{row.ca}</AnimatedValue>
                    </td>
                    <td>
                      <AnimatedValue value={row.intl}>{row.intl}</AnimatedValue>
                    </td>
                    <td>
                      <AnimatedValue value={row.total}>
                        {row.total}
                      </AnimatedValue>
                    </td>
                  </tr>
                ))}
                <tr className="text-xs md:text-2xl bg-base-200">
                  <th>{tickTotals.appeal}</th>
                  <th>
                    <AnimatedValue value={tickTotals.us}>
                      {tickTotals.us}
                    </AnimatedValue>
                  </th>
                  <th>
                    <AnimatedValue value={tickTotals.ca}>
                      {tickTotals.ca}
                    </AnimatedValue>
                  </th>
                  <th>
                    <AnimatedValue value={tickTotals.intl}>
                      {tickTotals.intl}
                    </AnimatedValue>
                  </th>
                  <th>
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
      <div className="flex flex-col lg:flex-row gap-4 w-full mt-4 bg-primary rounded-xl p-4 shadow-md">
        <section className="w-full lg:w-1/2">
          <h2 className="font-bold text-xl md:text-3xl text-center my-4">
            <AnimatedValue value={campaignTitle}>{campaignTitle}</AnimatedValue>
          </h2>
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-md md:text-xl">
              <thead>
                <tr className="text-xs md:text-2xl">
                  <th></th>
                  <th>US</th>
                  <th>CA</th>
                  <th>INTL</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {campaignRows.map((row, index) => (
                  <tr key={index}>
                    <th>{row.header}</th>
                    <td>
                      <AnimatedValue value={row.us}>
                        {row.us?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td>
                      <AnimatedValue value={row.ca}>
                        {row.ca?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td>
                      <AnimatedValue value={row.intl}>
                        {row.intl?.toLocaleString() || 0}
                      </AnimatedValue>
                    </td>
                    <td>
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
      </div>
    </div>
  );
}
