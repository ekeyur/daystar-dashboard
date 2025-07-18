"use client";

import { useDashboardData } from "@/hooks/useApi";
import { useEffect } from "react";
import { formatDataForTable } from "@/utils";
import { useAuth } from "@/contexts/authcontext";
import Header from "@/components/Header";

export default function Home() {
  const { isAuthenticated, loading: authLoading, login } = useAuth();
  const {
    data,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useDashboardData();

  const dashboardData = data?.result?.[0]?.outputValues || {};

  const { rows, totals } = formatDataForTable(dashboardData);

  const tickWebPercent = (dashboardData?.tickWebPercent * 100).toFixed(2) || 0;

  useEffect(() => {
    const autoLogin = async () => {
      if (!isAuthenticated && !authLoading) {
        try {
          await login();
        } catch (error) {
          console.error("Auto-login failed:", error);
        }
      }
    };
    autoLogin();
  }, [isAuthenticated, login]);

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
            {dashboardData.tickTitle}
          </h1>
          {!!dashboardData?.tickSubtitle && (
            <h2 className="font-light lg:font-bold text-sm md:text-md text-center lg:text-left lg:flex-1">
              {dashboardData?.tickSubtitle}
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
            <span className="block leading-none">{tickWebPercent}%</span>
            <span className="block text-xs lg:text-sm">web</span>
          </div>
          <div className="font-bold text-2xl lg:text-4xl text-secondary">
            {dashboardData?.tickTotal?.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }) || 0}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <section className="w-full">
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-md md:text-xl">
              {/* head */}
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
                {/* row 1 */}
                {rows.map((row, index) => (
                  <tr key={index}>
                    <th>{row.appeal}</th>
                    <td>{row.us}</td>
                    <td>{row.ca}</td>
                    <td>{row.intl}</td>
                    <td>{row.total}</td>
                  </tr>
                ))}
                <tr className="text-xs md:text-2xl bg-base-200">
                  <th>{totals.appeal}</th>
                  <th>{totals.us}</th>
                  <th>{totals.ca}</th>
                  <th>{totals.intl}</th>
                  <th>{totals.total}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full mt-4 bg-primary rounded-xl p-4 shadow-md">
        <section className="w-full lg:w-1/2">
          <h2 className="font-bold text-xl md:text-3xl text-center my-4">
            2025 Fundraiser Monies Campaign Total
          </h2>
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-md md:text-xl">
              {/* head */}
              <thead>
                <tr className="text-xs md:text-2xl">
                  <th>USD</th>
                  <th>TOTAL</th>
                  <th>US</th>
                  <th>CA & INTL</th>
                  <th>WEB</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr className="">
                  <th>One Time Gift</th>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>Recurring Received</th>
                  <td>50</td>
                  <td>2</td>
                  <td>0</td>
                  <td>52</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>Recurring Potential</th>
                  <td>2</td>
                  <td>0</td>
                  <td>0</td>
                  <td>2</td>
                </tr>
                <tr>
                  <th>Monthly/One Time Pledged</th>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <th>Total</th>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="w-full lg:w-1/2">
          <h2 className="font-bold text-xl md:text-3xl text-center my-4">
            2025 Fundraiser - Total Campaign
          </h2>
          <div className="overflow-x-auto font-bold">
            <table className="table w-full text-mx md:text-xl">
              {/* head */}

              <thead>
                <tr />
                <tr className="text-xs md:text-2xl">
                  <th />
                  <th>PLEDGES</th>
                  <th>PERCENT</th>
                  <th>DOLLARS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <th>LIVE</th>
                  <td>1,282</td>
                  <td>78</td>
                  <td>$217,356</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>WEB</th>
                  <td>352</td>
                  <td>22</td>
                  <td>$62,647</td>
                </tr>

                <tr className="text-xs md:text-2xl">
                  <th>TOTAL</th>
                  <td>1634</td>
                  <td>100</td>
                  <td>$280,004</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
