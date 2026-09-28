const root = document.querySelector('#app');
const response = await fetch('./src/components/customers.html');
if (!response.ok) throw new Error('Customer manager failed to load.');
root.innerHTML = await response.text();
document.title = 'Customers | Stripe Simulator';

const customers = [
  { id: 'cus_demo_8a31', name: 'Sam Lee', email: 'sam.lee@example.com', company: 'Northstar Studio', status: 'active', joined: 'Aug 14, 2025', lifetime: '$1,248.00', method: 'Visa ···· 4242', payments: [{ date: 'Sep 28, 2026', description: 'Growth subscription', amount: '$49.00', status: 'Paid' }, { date: 'Sep 14, 2026', description: 'Canvas daypack', amount: '$128.00', status: 'Paid' }], invoices: [{ date: 'Sep 28, 2026', description: 'Invoice · INV-1092', amount: '$49.00', status: 'Paid' }, { date: 'Aug 28, 2026', description: 'Invoice · INV-1047', amount: '$49.00', status: 'Paid' }], subscriptions: [{ date: 'Renews Oct 28, 2026', description: 'Growth · Monthly', amount: '$49.00', status: 'Active' }] },
  { id: 'cus_demo_7f42', name: 'Jordan Kim', email: 'jordan.kim@example.com', company: 'Fieldwork', status: 'past_due', joined: 'Jan 9, 2026', lifetime: '$316.50', method: 'Mastercard ···· 4444', payments: [{ date: 'Sep 26, 2026', description: 'Starter subscription', amount: '$19.00', status: 'Failed' }, { date: 'Aug 26, 2026', description: 'Starter subscription', amount: '$19.00', status: 'Paid' }], invoices: [{ date: 'Sep 26, 2026', description: 'Invoice · INV-1090', amount: '$19.00', status: 'Past due' }], subscriptions: [{ date: 'Payment needs attention', description: 'Starter · Monthly', amount: '$19.00', status: 'Past due' }] },
  { id: 'cus_demo_5c17', name: 'Maya Chen', email: 'maya.chen@example.com', company: 'Morrow Goods', status: 'active', joined: 'Mar 21, 2026', lifetime: '$782.20', method: 'Visa ···· 1881', payments: [{ date: 'Sep 25, 2026', description: 'Online order', amount: '$86.00', status: 'Paid' }], invoices: [{ date: 'Sep 25, 2026', description: 'Invoice · INV-1086', amount: '$86.00', status: 'Paid' }], subscriptions: [] },
  { id: 'cus_demo_3d90', name: 'Avery Brooks', email: 'avery.brooks@example.com', company: 'Avery Brooks', status: 'trialing', joined: 'Sep 18, 2026', lifetime: '$0.00', method: 'Visa ···· 4242', payments: [], invoices: [], subscriptions: [{ date: 'Trial ends Oct 2, 2026', description: 'Scale · Annual', amount: '$990.00', status: 'Trialing' }] },
  { id: 'cus_demo_2b64', name: 'Alex Rivera', email: 'alex.rivera@example.com', company: 'Orbit Tools', status: 'active', joined: 'Jul 2, 2025', lifetime: '$2,094.00', method: 'Amex ···· 1005', payments: [{ date: 'Sep 22, 2026', description: 'Scale subscription', amount: '$99.00', status: 'Paid' }, { date: 'Aug 22, 2026', description: 'Scale subscription', amount: '$99.00', status: 'Paid' }], invoices: [{ date: 'Sep 22, 2026', description: 'Invoice · INV-1081', amount: '$99.00', status: 'Paid' }], subscriptions: [{ date: 'Renews Oct 22, 2026', description: 'Scale · Monthly', amount: '$99.00', status: 'Active' }] }
];
let selectedId = customers[0].id;
let activeTab = 'overview';
const customerList = document.querySelector('#customer-list');
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
function statusLabel(status) { return ({ active: 'Active', trialing: 'Trialing', past_due: 'Past due' })[status] || status; }
function renderList() {
  const query = document.querySelector('#customer-search-input').value.trim().toLowerCase();
  const status = document.querySelector('#customer-status-filter').value;
  const filtered = customers.filter(customer => (status === 'all' || customer.status === status) && `${customer.name} ${customer.email} ${customer.id} ${customer.company}`.toLowerCase().includes(query));
  customerList.replaceChildren();
  document.querySelector('#customer-count').textContent = `${customers.length} customer${customers.length === 1 ? '' : 's'}`;
  document.querySelector('#list-empty').hidden = filtered.length > 0;
  filtered.forEach(customer => {
    const button = createElement('button', `customer-list-item ${customer.id === selectedId ? 'current-customer' : ''}`);
    button.type = 'button';
    const avatar = createElement('span', 'customer-avatar', customer.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase());
    const copy = createElement('span', 'customer-row-copy');
    copy.append(createElement('strong', '', customer.name), createElement('small', '', customer.email));
    const badge = createElement('span', `customer-status status-${customer.status}`, statusLabel(customer.status));
    button.append(avatar, copy, badge);
    button.addEventListener('click', () => { selectedId = customer.id; activeTab = 'overview'; renderList(); renderDetail(); });
    customerList.append(button);
  });
}
function renderRecords(customer, records) {
  const table = createElement('div', 'customer-record-list');
  if (!records.length) {
    table.append(createElement('p', 'no-records', 'No records for this customer yet.'));
    return table;
  }
  records.forEach(record => {
    const row = createElement('div', 'customer-record-row');
    const icon = createElement('span', 'record-icon', activeTab === 'payments' ? '↗' : activeTab === 'invoices' ? '▤' : '↻');
    const detail = createElement('span', 'record-detail');
    detail.append(createElement('strong', '', record.description), createElement('small', '', record.date));
    const amount = createElement('strong', 'record-amount', record.amount);
    const badge = createElement('span', `record-status record-${record.status.toLowerCase().replaceAll(' ', '-')}`, record.status);
    row.append(icon, detail, amount, badge);
    table.append(row);
  });
  return table;
}
function renderTab(customer, content) {
  content.replaceChildren();
  if (activeTab === 'overview') {
    const stats = createElement('div', 'customer-stats');
    [['Lifetime payments', customer.lifetime], ['Payments', customer.payments.length], ['Subscriptions', customer.subscriptions.length]].forEach(([label, value]) => {
      const card = createElement('div', 'customer-stat');
      card.append(createElement('span', '', label), createElement('strong', '', value));
      stats.append(card);
    });
    const columns = createElement('div', 'overview-columns');
    const profile = createElement('section', 'profile-info-card');
    profile.append(createElement('h3', '', 'Customer details'));
    [['Email', customer.email], ['Company', customer.company || '—'], ['Customer ID', customer.id], ['Created', customer.joined]].forEach(([label, value]) => {
      const line = createElement('div', 'profile-info-row');
      line.append(createElement('span', '', label), createElement('strong', '', value));
      profile.append(line);
    });
    const payment = createElement('section', 'profile-info-card');
    payment.append(createElement('h3', '', 'Default payment method'));
    const method = createElement('div', 'default-payment');
    method.append(createElement('span', 'payment-card-icon', '▰'), createElement('span', 'default-method-copy'));
    method.lastChild.append(createElement('strong', '', customer.method), createElement('small', '', 'Default payment method'));
    payment.append(method, createElement('p', 'payment-demo-note', 'Payment details are masked in this demo view.'));
    columns.append(profile, payment);
    content.append(stats, columns);
  } else {
    const title = createElement('h3', 'records-title', ({ payments: 'Payments', invoices: 'Invoices', subscriptions: 'Subscriptions' })[activeTab]);
    const records = activeTab === 'payments' ? customer.payments : activeTab === 'invoices' ? customer.invoices : customer.subscriptions;
    content.append(title, renderRecords(customer, records));
  }
}
function renderDetail() {
  const customer = customers.find(item => item.id === selectedId);
  if (!customer) return;
  const panel = document.querySelector('#customer-detail');
  panel.replaceChildren();
  const header = createElement('div', 'customer-profile-header');
  const avatar = createElement('span', 'profile-avatar-large', customer.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase());
  const identity = createElement('div', 'profile-identity');
  identity.append(createElement('h2', '', customer.name), createElement('span', '', customer.email));
  const status = createElement('span', `customer-status status-${customer.status}`, statusLabel(customer.status));
  const mail = createElement('a', 'email-customer-button', 'Email customer');
  mail.href = `mailto:${encodeURIComponent(customer.email)}`;
  header.append(avatar, identity, status, mail);
  const tabs = createElement('div', 'customer-tabs');
  [['overview', 'Overview'], ['payments', 'Payments'], ['invoices', 'Invoices'], ['subscriptions', 'Subscriptions']].forEach(([id, label]) => {
    const button = createElement('button', `customer-tab ${activeTab === id ? 'active-tab' : ''}`, label);
    button.type = 'button';
    button.setAttribute('aria-selected', String(activeTab === id));
    button.addEventListener('click', () => { activeTab = id; renderDetail(); });
    tabs.append(button);
  });
  const content = createElement('div', 'customer-tab-content');
  panel.append(header, tabs, content);
  renderTab(customer, content);
}

document.querySelector('#customer-search-input').addEventListener('input', renderList);
document.querySelector('#customer-status-filter').addEventListener('change', renderList);
document.querySelector('#clear-customer-search').addEventListener('click', () => {
  document.querySelector('#customer-search-input').value = '';
  document.querySelector('#customer-status-filter').value = 'all';
  renderList();
});
const dialog = document.querySelector('#customer-dialog');
document.querySelector('#new-customer').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-customer-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#cancel-customer').addEventListener('click', () => dialog.close());
document.querySelector('#new-customer-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const form = new FormData(event.currentTarget);
  const customer = {
    id: `cus_demo_${Math.random().toString(36).slice(2, 6)}`,
    name: String(form.get('name')).trim(), email: String(form.get('email')).trim(), company: String(form.get('company')).trim(),
    status: 'active', joined: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()),
    lifetime: '$0.00', method: 'No payment method', payments: [], invoices: [], subscriptions: []
  };
  customers.unshift(customer);
  selectedId = customer.id;
  activeTab = 'overview';
  document.querySelector('#customer-search-input').value = '';
  document.querySelector('#customer-status-filter').value = 'all';
  event.currentTarget.reset();
  dialog.close();
  renderList();
  renderDetail();
});
renderList();
renderDetail();
