export function formatDataForTable(data) {
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
    rows: tableRows,
    totals: totalsRow,
  };
}
