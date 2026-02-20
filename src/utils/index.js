export function formatTickDataForTable(data) {
  const appeals = data.tickMatrixRowHeader || [];
  const usData = data.tickPledgeCountUScollection || [];
  const caData = data.tickPledgeCountCAcollection || [];
  const intlData = data.tickPledgeCountINTLcollection || [];
  const totalData = data.tickPledgeCountTotal || [];

  // Create table rows
  const tableRows = [];

  for (let i = 0; i < appeals.length; i++) {
    tableRows.push({
      appeal: appeals[i],
      us: usData[i],
      ca: caData[i],
      intl: intlData[i],
      total: totalData[i],
    });
  }

  // Calculate totals row
  const totalsRow = {
    appeal: "TOTAL",
    us: usData.reduce((sum, val) => sum + val, 0),
    ca: caData.reduce((sum, val) => sum + val, 0),
    intl: intlData.reduce((sum, val) => sum + val, 0),
    total: totalData.reduce((sum, val) => sum + val, 0),
  };

  return {
    tickRows: tableRows,
    tickTotals: totalsRow,
  };
}

export function formatCampaignDataForTable(data) {
  const campHeaders = data.campHeaders || [];
  const usData = data.campCountUS || [];
  const caData = data.campCountCA || [];
  const intlData = data.campCountINTL || [];

  // Create table rows
  const tableRows = [];

  for (let i = 0; i < campHeaders.length; i++) {
    tableRows.push({
      header: campHeaders[i],
      us: usData[i],
      ca: caData[i],
      intl: intlData[i],
      total: (usData[i] || 0) + (caData[i] || 0) + (intlData[i] || 0),
    });
  }

  return {
    campaignRows: tableRows,
    campaignTitle: data.campTableTitle || "Campaign Totals",
  };
}

export const extractSummaryData = (dashboardData) => {
  // Summary data
  const summaryNonWebCount = dashboardData?.summaryNonWebCount || 0;
  const summaryWebCount = dashboardData?.summaryWebCount || 0;
  const summaryNonWebTotal =
    dashboardData?.summaryNonWebTotal?.valueForDisplay || "$0";
  const summaryWebTotal =
    dashboardData?.summaryWebTotal?.valueForDisplay || "$0";
  const totalCount = summaryNonWebCount + summaryWebCount;
  const totalAmount = dashboardData?.tickTotal?.valueForDisplay || "$0";

  // Israel breakdown amounts
  const liveIsraelAmount = dashboardData?.summaryNonWebIsrael?.amount || 0;
  const webIsraelAmount = dashboardData?.summaryWebTotalIsrael?.amount || 0;
  const liveTotalAmount = dashboardData?.summaryNonWebTotal?.amount || 0;
  const webTotalAmount = dashboardData?.summaryWebTotal?.amount || 0;

  // Calculate percentages
  const livePercent =
    totalCount > 0 ? Math.round((summaryNonWebCount / totalCount) * 100) : 0;
  const webPercent =
    totalCount > 0 ? Math.round((summaryWebCount / totalCount) * 100) : 0;

  const summaryRows = [
    {
      source: dashboardData?.summaryLiveLabel || "LIVE",
      count: summaryNonWebCount,
      percent: livePercent,
      amount: summaryNonWebTotal,
      rawAmount: liveTotalAmount,
      israelAmount: liveIsraelAmount,
      generalAmount: liveTotalAmount - liveIsraelAmount,
    },
    {
      source: dashboardData?.summaryWebLabel || "WEB",
      count: summaryWebCount,
      percent: webPercent,
      amount: summaryWebTotal,
      rawAmount: webTotalAmount,
      israelAmount: webIsraelAmount,
      generalAmount: webTotalAmount - webIsraelAmount,
    },
  ];

  return {
    summaryRows,
  };
};
