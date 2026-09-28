import { periodData } from './data/usage.js';

const componentPaths = [
  './src/components/sidebar.html',
  './src/components/topbar.html',
  './src/components/page-heading.html',
  './src/components/usage-metrics.html',
  './src/components/usage-chart.html',
  './src/components/product-usage.html',
  './src/components/invoice-summary.html'
];
const root = document.querySelector('#app');
let toast;
let selectedPeriod = 30;
let toastTimeout;

async function loadComponents() {
  const responses = await Promise.all(componentPaths.map(path => fetch(path)));
  if (responses.some(response => !response.ok)) {
    throw new Error('A dashboard component could not be loaded.');
  }
  return Promise.all(responses.map(response => response.text()));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
}

function setMetric(name, value) {
  document.querySelectorAll(`[data-metric="${name}"]`).forEach(element => {
    element.textContent = value;
  });
}

function updateChart(data) {
  const width = 700;
  const height = 168;
  const points = data.points.map((value, index) => ({
    x: index * width / (data.points.length - 1),
    y: height - (value / 100 * 158) - 5
  }));
  const path = points.map((point, index) => `${index ? 'L' : 'M'}${point.x},${point.y}`).join(' ');
  document.querySelector('#chart-line').setAttribute('d', path);
  document.querySelector('#chart-area').setAttribute('d', `${path} L${width},${height} L0,${height} Z`);
  const lastPoint = points.at(-1);
  document.querySelector('#chart-point').setAttribute('cx', lastPoint.x);
  document.querySelector('#chart-point').setAttribute('cy', lastPoint.y);
  document.querySelector('#x-labels').innerHTML = data.labels.map(label => `<span>${label}</span>`).join('');
}

function updatePeriod() {
  const data = periodData[selectedPeriod];
  setMetric('requests', data.requests);
  setMetric('tableRequests', data.requests);
  setMetric('webhooks', data.webhooks);
  setMetric('data', data.data);
  setMetric('cost', data.cost);
  setMetric('invoice', data.cost);
  setMetric('summaryUsage', data.cost);
  setMetric('change', data.change);
  setMetric('included', data.requests);
  setMetric('percent', data.percent.toFixed(1));
  document.querySelector('#progress-fill').style.width = `${Math.min(data.percent, 100)}%`;
  document.querySelector('#chart-tooltip').textContent = `Requests · ${data.requests}`;
  updateChart(data);
}

try {
  const [sidebar, topbar, heading, metrics, chart, productUsage, invoice] = await loadComponents();
  root.innerHTML = `
    <div class="shell">
      ${sidebar}
      <main class="main">
        ${topbar}
        <div class="page">
          ${heading}
          ${metrics}
          ${chart}
          <div class="lower-grid">${productUsage}${invoice}</div>
        </div>
      </main>
    </div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
  `;

  toast = document.querySelector('#toast');
  document.querySelector('#period').addEventListener('change', event => {
    selectedPeriod = Number(event.currentTarget.value);
    updatePeriod();
  });

  document.querySelectorAll('.mode-option').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.mode-option').forEach(option => {
        option.classList.toggle('active', option === button);
      });
      const isTest = button.dataset.mode === 'Test';
      document.querySelector('.eyebrow').innerHTML = `<span class="eyebrow-mark"></span> ${isTest ? 'TEST DATA · BILLING & ANALYTICS' : 'BILLING & ANALYTICS'}`;
      if (isTest) {
        setMetric('requests', '12.4K');
        setMetric('tableRequests', '12.4K');
        setMetric('webhooks', '840');
        setMetric('data', '3.2 GB');
        setMetric('cost', '$0.00');
        setMetric('invoice', '$0.00');
        setMetric('summaryUsage', '$0.00');
        setMetric('included', '12.4K');
        setMetric('percent', '0.1');
        document.querySelector('#progress-fill').style.width = '0.1%';
        document.querySelector('#chart-tooltip').textContent = 'Test requests · 12.4K';
      } else {
        updatePeriod();
      }
    });
  });

  document.querySelectorAll('[data-message]').forEach(button => {
    button.addEventListener('click', () => showToast(button.dataset.message));
  });
  document.querySelector('.workspace-switch').addEventListener('click', () => {
    showToast('Northstar Studio is your active workspace.');
  });
  document.querySelector('#export-button').addEventListener('click', () => {
    const rows = [
      ['Product', 'Usage', 'Status', 'Cost'],
      ['API requests', document.querySelector('[data-metric="tableRequests"]').textContent, 'On track', '$0.00'],
      ['Billing events', '2,418', 'On track', '$48.36'],
      ['Data pipeline', '342 GB', 'Near limit', '$136.80'],
      ['Radar evaluations', '18.2K', 'On track', '$99.44']
    ];
    const csv = rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'stripe-usage.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Usage report exported as CSV.');
  });
  updatePeriod();
} catch (error) {
  root.innerHTML = '<p class="load-error">The usage dashboard could not be loaded. Start the local web server and refresh.</p>';
  console.error(error);
}
