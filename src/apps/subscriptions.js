const root = document.querySelector('#app');
const response = await fetch('./src/components/subscriptions.html');
if (!response.ok) throw new Error('Subscription simulator failed to load.');
root.innerHTML = await response.text();
document.title = 'Subscriptions | Stripe Simulator';

const plans = [
  { id: 'starter', name: 'Starter', description: 'For getting started', monthly: 19, annual: 190, features: ['Core billing tools', 'Email support', 'One team member'] },
  { id: 'growth', name: 'Growth', description: 'For growing teams', monthly: 49, annual: 490, features: ['Everything in Starter', 'Automated workflows', 'Up to 10 team members'] },
  { id: 'scale', name: 'Scale', description: 'For established teams', monthly: 99, annual: 990, features: ['Everything in Growth', 'Advanced analytics', 'Priority support'] }
];
let selectedPlan = plans[1];
let annual = false;
let subscription = null;
const invoices = [];
const planGrid = document.querySelector('#plan-grid');

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
function planPrice(plan) {
  return annual ? plan.annual : plan.monthly;
}
function renderPlans() {
  planGrid.innerHTML = plans.map(plan => `<article class="plan-card ${plan.id === selectedPlan.id ? 'plan-selected' : ''}" data-plan-card="${plan.id}"><div class="plan-card-top"><div><p>${plan.description}</p><h3>${plan.name}</h3></div><span class="plan-radio" aria-hidden="true"></span></div><div class="plan-price"><strong>${money(planPrice(plan))}</strong><span>/${annual ? 'year' : 'month'}</span></div><ul>${plan.features.map(feature => `<li>${feature}</li>`).join('')}</ul><button type="button" class="select-plan" data-select-plan="${plan.id}">${subscription?.plan.id === plan.id ? 'Current plan' : `Select ${plan.name}`}</button></article>`).join('');
  planGrid.querySelectorAll('[data-select-plan]').forEach(button => button.addEventListener('click', () => {
    selectedPlan = plans.find(plan => plan.id === button.dataset.selectPlan);
    if (subscription) subscription.plan = selectedPlan;
    renderPlans();
    updateSummary();
  }));
}
function nextBillingDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}
function renderInvoices() {
  const list = document.querySelector('#invoice-list');
  list.replaceChildren();
  document.querySelector('#invoice-count').textContent = invoices.length;
  document.querySelector('#invoice-empty').hidden = invoices.length > 0;
  invoices.forEach(invoice => {
    const row = document.createElement('div');
    row.className = 'invoice-row';
    row.innerHTML = `<span class="invoice-file">↗</span><span class="invoice-copy"><strong>${invoice.number}</strong><small>${invoice.date} · ${invoice.plan}</small></span><strong class="invoice-amount">${money(invoice.amount)}</strong><span class="invoice-badge">${invoice.status}</span>`;
    list.append(row);
  });
}
function updateSummary() {
  const empty = document.querySelector('#subscription-empty');
  const active = document.querySelector('#subscription-active');
  empty.hidden = Boolean(subscription);
  active.hidden = !subscription;
  if (!subscription) return;
  const { plan, trial, cancelAtPeriodEnd } = subscription;
  document.querySelector('#active-plan-name').textContent = plan.name;
  document.querySelector('#active-plan-description').textContent = plan.description;
  document.querySelector('#active-price').textContent = money(planPrice(plan));
  document.querySelector('#active-interval').textContent = annual ? 'per year' : 'per month';
  document.querySelector('#subscription-status').textContent = cancelAtPeriodEnd ? 'Canceling' : trial ? 'Trialing' : 'Active';
  document.querySelector('#renewal-label').textContent = cancelAtPeriodEnd ? 'Access ends' : trial ? 'Trial ends' : 'Next invoice';
  document.querySelector('#renewal-date').textContent = cancelAtPeriodEnd ? subscription.endDate : nextBillingDate(trial ? 14 : annual ? 365 : 30);
  document.querySelector('#subscription-message').textContent = cancelAtPeriodEnd ? `Plan access continues until ${subscription.endDate}.` : trial ? 'Your trial is active. No payment is due today.' : 'Your subscription is active and ready to renew.';
  document.querySelector('#cancel-subscription').textContent = cancelAtPeriodEnd ? 'Resume subscription' : 'Cancel at period end';
  document.querySelector('#start-subscription').disabled = true;
  document.querySelector('#start-subscription').innerHTML = 'Subscription active <span aria-hidden="true">✓</span>';
}

document.querySelector('#annual-toggle').addEventListener('change', event => {
  annual = event.currentTarget.checked;
  document.querySelector('#monthly-label').classList.toggle('cycle-active', !annual);
  document.querySelector('#annual-label').classList.toggle('cycle-active', annual);
  renderPlans();
  updateSummary();
});
document.querySelector('#subscription-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity() || subscription) return;
  const trial = document.querySelector('#trial-toggle').checked;
  subscription = { plan: selectedPlan, trial, cancelAtPeriodEnd: false, endDate: nextBillingDate(trial ? 14 : annual ? 365 : 30) };
  invoices.unshift({ number: 'DRAFT-' + Math.random().toString(36).slice(2, 7).toUpperCase(), date: 'Upcoming', plan: selectedPlan.name, amount: planPrice(selectedPlan), status: trial ? 'Trial' : 'Upcoming' });
  renderPlans();
  renderInvoices();
  updateSummary();
});
document.querySelector('#cancel-subscription').addEventListener('click', () => {
  subscription.cancelAtPeriodEnd = !subscription.cancelAtPeriodEnd;
  updateSummary();
});
renderPlans();
renderInvoices();
