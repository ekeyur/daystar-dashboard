"use client";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Header from "@/components/Header";
import AnimatedValue from "@/components/AnimatedValue";

export default function DashboardClient({
  dashboardData,
  tickRows,
  tickTotals,
  campaignTitle,
  campaignRows,
  summaryRows,
  summaryTotal,
  tickWebPercent,
  pieChartDataCount,
  pieChartDataAmount,
}) {
  return (
    <div className="">
      <Header />
      <div className="flex flex-col xl:flex-row gap-4 w-full mt-1 lg:mt-4 bg-blue-800 rounded-xl shadow-md px-2 md:px-12">
        <section className="w-full xl:w-1/2">
          <h2 className="font-bold text-xl md:text-3xl text-center my-2 lg:my-4">
            <AnimatedValue value={summaryTotal}>{campaignTitle} </AnimatedValue>
          </h2>
          <div className="mt-2 lg:hidden flex justify-center">
            <table className="text-white text-md">
              <thead>
                <tr>
                  <th className="text-left text-sm font-semibold pb-2 pr-4"></th>
                  {summaryRows.map((row, index) => (
                    <th
                      key={`mobile-header-${row.source}-${index}`}
                      className="text-center text-sm font-semibold pb-2 px-3"
                    >
                      {row.source}
                    </th>
                  ))}
                  <th className="text-center text-sm font-semibold pb-2 pl-3">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-sm font-semibold py-1 text-left pr-4">
                    Amount
                  </td>
                  {summaryRows.map((row, index) => (
                    <td
                      key={`mobile-amount-${row.source}-${index}`}
                      className="text-center py-1 px-3"
                    >
                      <AnimatedValue
                        value={row.rawAmount}
                        key={`mobile-amount-value-${row.source}`}
                      >
                        <span className="text-amber-300 text-shadow-md text-xl font-semibold">
                          {row.rawAmount?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </AnimatedValue>
                    </td>
                  ))}
                  <td className="text-center py-1 pl-3">
                    <AnimatedValue
                      value={summaryRows.reduce(
                        (sum, row) => sum + (row.rawAmount || 0),
                        0
                      )}
                      key="mobile-total-amount"
                    >
                      <span className="text-amber-300 text-shadow-md text-xl font-semibold">
                        {summaryRows
                          .reduce((sum, row) => sum + (row.rawAmount || 0), 0)
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                      </span>
                    </AnimatedValue>
                  </td>
                </tr>
                <tr>
                  <td className="text-sm font-semibold py-1 text-left pr-4">
                    Count
                  </td>
                  {summaryRows.map((row, index) => (
                    <td
                      key={`mobile-count-${row.source}-${index}`}
                      className="text-center py-1 px-3"
                    >
                      <AnimatedValue
                        value={row.count}
                        key={`mobile-count-value-${row.source}`}
                      >
                        <span className="text-amber-300 text-shadow-md text-xl font-semibold">
                          {row.count?.toLocaleString()}
                        </span>
                      </AnimatedValue>
                    </td>
                  ))}
                  <td className="text-center py-1 pl-3">
                    <AnimatedValue
                      value={summaryRows.reduce(
                        (sum, row) => sum + (row.count || 0),
                        0
                      )}
                      key="mobile-total-count"
                    >
                      <span className="text-amber-300 text-shadow-md text-xl font-semibold">
                        {summaryRows
                          .reduce((sum, row) => sum + (row.count || 0), 0)
                          .toLocaleString()}
                      </span>
                    </AnimatedValue>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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
                    <th className="text-left truncate py-1 md:py-3">
                      {row.header}
                    </th>
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
          <div className="flex flex-col xl:flex-row gap-1 items-center justify-center">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-lg text-white mb-2 hidden lg:block">
                Count
              </h3>
              <div className="items-center justify-center h-60 hidden lg:flex">
                <PieChart
                  series={[
                    {
                      data: pieChartDataCount,
                      arcLabel: (item) => ``,
                      arcLabelMinAngle: 25,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 20, additionalRadius: -20 },
                    },
                  ]}
                  width={200}
                  height={180}
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
            </div>

            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-lg text-white mb-2 hidden lg:block">
                Amount
              </h3>
              <div className="items-center justify-center h-60 hidden lg:flex">
                <PieChart
                  series={[
                    {
                      data: pieChartDataAmount,
                      arcLabel: (item) => ``,
                      arcLabelMinAngle: 25,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 20, additionalRadius: -20 },
                    },
                  ]}
                  width={200}
                  height={180}
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
            </div>
          </div>

          <div className="mt-2 hidden lg:flex justify-center">
            <table className="text-white">
              <thead>
                <tr>
                  <th className="text-left text-lg font-semibold pb-2 pr-6"></th>
                  {summaryRows.map((row, index) => (
                    <th
                      key={`desktop-header-${row.source}-${index}`}
                      className="text-center text-lg font-semibold pb-2 px-4"
                    >
                      {row.source}
                    </th>
                  ))}
                  <th className="text-center text-lg font-semibold pb-2 pl-4">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-lg font-semibold py-2 text-left pr-6">
                    Amount
                  </td>
                  {summaryRows.map((row, index) => (
                    <td
                      key={`desktop-amount-${row.source}-${index}`}
                      className="text-center py-2 px-4"
                    >
                      <AnimatedValue
                        value={row.rawAmount}
                        key={`desktop-amount-value-${row.source}`}
                      >
                        <span className="text-amber-300 text-shadow-md text-lg font-semibold">
                          {row.rawAmount?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </AnimatedValue>
                    </td>
                  ))}
                  <td className="text-center py-2 pl-4">
                    <AnimatedValue
                      value={summaryRows.reduce(
                        (sum, row) => sum + (row.rawAmount || 0),
                        0
                      )}
                      key="desktop-total-amount"
                    >
                      <span className="text-amber-300 text-shadow-md text-lg font-semibold">
                        {summaryRows
                          .reduce((sum, row) => sum + (row.rawAmount || 0), 0)
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                      </span>
                    </AnimatedValue>
                  </td>
                </tr>
                <tr>
                  <td className="text-lg font-semibold py-2 text-left pr-6">
                    Count
                  </td>
                  {summaryRows.map((row, index) => (
                    <td
                      key={`desktop-count-${row.source}-${index}`}
                      className="text-center py-2 px-4"
                    >
                      <AnimatedValue
                        value={row.count}
                        key={`desktop-count-value-${row.source}`}
                      >
                        <span className="text-amber-300 text-shadow-md text-xl font-semibold">
                          {row.count?.toLocaleString()}
                        </span>
                      </AnimatedValue>
                    </td>
                  ))}
                  <td className="text-center py-2 pl-4">
                    <AnimatedValue
                      value={summaryRows.reduce(
                        (sum, row) => sum + (row.count || 0),
                        0
                      )}
                      key="desktop-total-count"
                    >
                      <span className="text-amber-300 text-shadow-md text-xl font-semibold">
                        {summaryRows
                          .reduce((sum, row) => sum + (row.count || 0), 0)
                          .toLocaleString()}
                      </span>
                    </AnimatedValue>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:gap-4 px-2 md:px-12">
        <div>
          <h1 className="font-bold text-lg md:text-4xl text-center lg:text-left lg:flex-1">
            <AnimatedValue value={dashboardData.tickTitle}>
              {dashboardData.tickTitle}
            </AnimatedValue>
          </h1>
          {!!dashboardData?.tickSubtitle && (
            <h2 className="font-light lg:font-bold text-xs md:text-lg text-center lg:text-left lg:flex-1">
              <AnimatedValue value={dashboardData.tickSubtitle}>
                {dashboardData?.tickSubtitle}
              </AnimatedValue>
            </h2>
          )}
        </div>
        <div className="flex flex-col items-center justify-center my-1 gap-1 lg:my-2 lg:gap-2 lg:flex-row">
          <div className="font-bold text-2xl lg:text-4xl text-secondary">
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
              &nbsp;| Web : {tickWebPercent}
            </AnimatedValue>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full px-2 py-1 md:px-12 md:py-4 bg-black">
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
                    <th className="text-left break-words md:truncate py-1 md:py-3">
                      {row.appeal}
                    </th>
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
                  <th className="text-left break-words md:truncate py-1 md:py-3">
                    {tickTotals.appeal}
                  </th>
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
    </div>
  );
}
