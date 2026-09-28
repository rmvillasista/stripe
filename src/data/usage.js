/** @type {Record<7 | 30 | 90, import('../types.js').UsagePeriod>} */
export const periodData = {
  7: {
    requests: '1.96M', webhooks: '28.4K', data: '76 GB', cost: '$67.24', change: '8.1%', percent: 19.6,
    labels: ['Sep 23', 'Sep 24', 'Sep 25', 'Sep 26', 'Sep 27', 'Sep 28', 'Sep 29'],
    points: [30, 42, 36, 61, 55, 72, 82]
  },
  30: {
    requests: '8.42M', webhooks: '124.6K', data: '342 GB', cost: '$284.60', change: '12.8%', percent: 84.2,
    labels: ['Aug 31', 'Sep 5', 'Sep 10', 'Sep 15', 'Sep 20', 'Sep 25', 'Sep 29'],
    points: [18, 32, 29, 48, 44, 67, 82]
  },
  90: {
    requests: '24.8M', webhooks: '361.2K', data: '1.08 TB', cost: '$842.18', change: '18.4%', percent: 100,
    labels: ['Jul 2', 'Jul 17', 'Aug 1', 'Aug 16', 'Aug 31', 'Sep 14', 'Sep 29'],
    points: [15, 28, 24, 41, 53, 66, 82]
  }
};
