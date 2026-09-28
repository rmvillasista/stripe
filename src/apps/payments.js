const root = document.querySelector('#app');
const response = await fetch('./src/components/payments.html');
if (!response.ok) throw new Error('Payments simulator failed to load.');
root.innerHTML = await response.text();
document.title = 'Payments | Stripe Simulator';

const amountInput = document.querySelector('#payment-amount');
const currencyInput = document.querySelector('#payment-currency');
const methodInput = document.querySelector('#payment-method');
const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
const outcomeLabels = {
  succeeded: ['Succeeded', 'Payment simulated successfully. The intent is ready for fulfillment.', 'succeeded'],
  requires_action: ['Authentication required', 'The customer must complete authentication before this payment can succeed.', 'failed'],
  requires_payment_method: ['Payment method declined', 'The payment failed. Choose another method and try again.', 'failed']
};
let latestIntent = 'pi_demo_••••••';

function amount() {
  return Math.max(0, Number(amountInput.value) || 0);
}
function format(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyInput.value }).format(value);
}
function updatePreview() {
  const value = amount();
  const fee = value * 0.029 + 0.3;
  document.querySelector('#currency-symbol').textContent = currencySymbols[currencyInput.value];
  document.querySelector('#preview-amount').textContent = format(value);
  document.querySelector('#preview-fee').textContent = format(fee);
  document.querySelector('#preview-net').textContent = format(value - fee);
  document.querySelector('#preview-method').textContent = methodInput.value;
}
function appendPayment(id, email, method, status, value) {
  const row = document.createElement('tr');
  row.dataset.status = status === 'succeeded' ? 'succeeded' : 'failed';
  const values = [id, email, method, status === 'succeeded' ? 'Succeeded' : 'Needs attention', format(value)];
  values.forEach((value, index) => {
    const cell = document.createElement('td');
    if (index === 0) {
      const code = document.createElement('code');
      code.textContent = value;
      const time = document.createElement('small');
      time.textContent = 'Just now';
      cell.append(code, time);
    } else if (index === 3) {
      const badge = document.createElement('span');
      badge.className = `payment-status ${row.dataset.status}`;
      badge.textContent = value;
      cell.append(badge);
    } else {
      cell.textContent = value;
    }
    row.append(cell);
  });
  document.querySelector('#payment-rows').prepend(row);
  filterPayments();
}
function filterPayments() {
  const filter = document.querySelector('#payment-filter').value;
  document.querySelectorAll('#payment-rows tr').forEach(row => {
    row.hidden = filter === 'succeeded' ? row.dataset.status !== 'succeeded' : filter === 'failed' ? row.dataset.status !== 'failed' : false;
  });
}

amountInput.addEventListener('input', updatePreview);
currencyInput.addEventListener('change', updatePreview);
methodInput.addEventListener('change', updatePreview);
document.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => {
  amountInput.value = button.dataset.amount;
  updatePreview();
}));
document.querySelector('#payment-filter').addEventListener('change', filterPayments);
document.querySelector('#copy-intent').addEventListener('click', event => {
  event.currentTarget.textContent = 'Copied';
  window.setTimeout(() => { event.currentTarget.textContent = 'Copy ID'; }, 1300);
});
document.querySelector('#payment-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const email = document.querySelector('#payment-email').value.trim();
  const outcome = document.querySelector('#payment-outcome').value;
  const [label, message, rowStatus] = outcomeLabels[outcome];
  latestIntent = `pi_demo_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  document.querySelector('#intent-id').textContent = latestIntent;
  document.querySelector('#preview-status').className = `preview-status ${rowStatus}`;
  document.querySelector('#preview-status').lastElementChild.textContent = label;
  document.querySelector('#preview-response').textContent = message;
  appendPayment(latestIntent, email, methodInput.value, outcome, amount());
});
updatePreview();
