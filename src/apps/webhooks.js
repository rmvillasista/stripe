const root = document.querySelector('#app');
const response = await fetch('./src/components/webhooks.html');
if (!response.ok) throw new Error('Webhook simulator failed to load.');
root.innerHTML = await response.text();
document.title = 'Webhooks | Stripe Simulator';

const endpointInput = document.querySelector('#endpoint-url');
const deliveries = [
  { id: 'evt_demo_71KQ2', type: 'payment_intent.succeeded', attempts: 1, response: 200, status: 'delivered', endpoint: 'https://api.northstar.test/webhooks/stripe', time: '10:42:18 AM', data: { object: 'payment_intent', amount: 12800, currency: 'usd', status: 'succeeded' } },
  { id: 'evt_demo_68RB5', type: 'invoice.payment_failed', attempts: 1, response: 500, status: 'failed', endpoint: 'https://api.northstar.test/webhooks/stripe', time: '10:39:02 AM', data: { object: 'invoice', amount_due: 4900, currency: 'usd', attempt_count: 1 } },
  { id: 'evt_demo_22MG8', type: 'customer.subscription.updated', attempts: 1, response: 200, status: 'delivered', endpoint: 'https://api.northstar.test/webhooks/stripe', time: '10:31:47 AM', data: { object: 'subscription', status: 'active', cancel_at_period_end: false } }
];
let selectedId = null;
function id() { return `evt_demo_${Math.random().toString(36).slice(2, 7).toUpperCase()}`; }
function updateSummary() {
  const delivered = deliveries.filter(item => item.status === 'delivered').length;
  const failed = deliveries.length - delivered;
  document.querySelector('#delivered-count').textContent = delivered;
  document.querySelector('#failed-count').textContent = failed;
  document.querySelector('#success-rate').textContent = `${deliveries.length ? Math.round(delivered / deliveries.length * 1000) / 10 : 0}%`;
}
function renderDeliveries() {
  const rows = document.querySelector('#delivery-rows');
  rows.replaceChildren();
  const filter = document.querySelector('#delivery-filter').value;
  const visible = deliveries.filter(item => filter === 'all' || item.status === filter);
  document.querySelector('#empty-deliveries').hidden = visible.length > 0;
  visible.forEach(item => {
    const row = document.createElement('tr');
    row.className = item.id === selectedId ? 'selected-delivery' : '';
    const values = [item.id, item.type, `${item.attempts} ${item.attempts === 1 ? 'attempt' : 'attempts'}`, `HTTP ${item.response}`, item.status === 'delivered' ? 'Delivered' : 'Failed'];
    values.forEach((value, index) => {
      const cell = document.createElement('td');
      if (index === 0) {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'event-id-button'; button.textContent = value;
        button.addEventListener('click', () => selectDelivery(item.id)); cell.append(button);
      } else if (index === 4) {
        const badge = document.createElement('span'); badge.className = `delivery-status ${item.status}`; badge.textContent = value; cell.append(badge);
      } else {
        cell.textContent = value;
      }
      row.append(cell);
    });
    const actionCell = document.createElement('td');
    if (item.status === 'failed') {
      const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'retry-button'; retry.textContent = 'Retry';
      retry.addEventListener('click', event => { event.stopPropagation(); retryDelivery(item.id); }); actionCell.append(retry);
    } else {
      const view = document.createElement('button'); view.type = 'button'; view.className = 'view-event-button'; view.textContent = 'View';
      view.addEventListener('click', () => selectDelivery(item.id)); actionCell.append(view);
    }
    row.append(actionCell);
    row.addEventListener('click', () => selectDelivery(item.id));
    rows.append(row);
  });
  updateSummary();
}
function selectDelivery(eventId) {
  const item = deliveries.find(delivery => delivery.id === eventId);
  if (!item) return;
  selectedId = item.id;
  document.querySelector('#detail-empty').hidden = true;
  document.querySelector('#detail-content').hidden = false;
  document.querySelector('#event-detail-title').textContent = item.type;
  const status = document.querySelector('#detail-status');
  status.className = `detail-status ${item.status}`;
  status.textContent = `${item.status === 'delivered' ? 'Delivered' : 'Failed'} · HTTP ${item.response} · ${item.time}`;
  document.querySelector('#detail-endpoint').textContent = item.endpoint;
  document.querySelector('#detail-id').textContent = item.id;
  document.querySelector('#event-payload').textContent = JSON.stringify({ id: item.id, type: item.type, created: new Date().toISOString(), data: { object: item.data } }, null, 2);
  renderDeliveries();
}
function retryDelivery(eventId) {
  const item = deliveries.find(delivery => delivery.id === eventId);
  if (!item) return;
  item.attempts += 1;
  item.response = 200;
  item.status = 'delivered';
  item.time = new Date().toLocaleTimeString('en-US');
  selectDelivery(item.id);
}
document.querySelector('#event-form').addEventListener('submit', event => {
  event.preventDefault();
  const endpoint = endpointInput.value.trim();
  let parsed;
  try { parsed = new URL(endpoint); } catch { parsed = null; }
  const validation = document.querySelector('#endpoint-validation');
  if (!parsed || !['https:', 'http:'].includes(parsed.protocol)) {
    validation.textContent = 'Enter a valid HTTP or HTTPS endpoint URL.';
    validation.className = 'endpoint-validation invalid';
    endpointInput.focus();
    return;
  }
  validation.textContent = 'Endpoint URL looks valid for this simulation.';
  validation.className = 'endpoint-validation valid';
  const type = document.querySelector('#event-type').value;
  const failed = document.querySelector('#simulate-failure').checked;
  const item = { id: id(), type, attempts: 1, response: failed ? 500 : 200, status: failed ? 'failed' : 'delivered', endpoint, time: new Date().toLocaleTimeString('en-US'), data: { object: type.split('.')[0], simulated: true, livemode: false } };
  deliveries.unshift(item);
  document.querySelector('#delivery-filter').value = 'all';
  selectDelivery(item.id);
});
document.querySelector('#delivery-filter').addEventListener('change', renderDeliveries);
document.querySelector('#clear-deliveries').addEventListener('click', () => {
  deliveries.splice(0, deliveries.length);
  selectedId = null;
  document.querySelector('#detail-empty').hidden = false;
  document.querySelector('#detail-content').hidden = true;
  document.querySelector('#event-detail-title').textContent = 'Select a delivery';
  renderDeliveries();
});
document.querySelector('#edit-endpoint').addEventListener('click', () => endpointInput.focus());
renderDeliveries();
selectDelivery(deliveries[0].id);
