const root = document.querySelector('#app');
const response = await fetch('./src/components/checkout.html');
if (!response.ok) throw new Error('Checkout component failed to load.');
root.innerHTML = await response.text();

document.title = 'Checkout | Northstar Goods';
const quantityElement = document.querySelector('#quantity');
const emailInput = document.querySelector('#customer-email');
const payButton = document.querySelector('#pay-button');
const state = { quantity: 1, promoApplied: false, paymentMethod: 'card' };
const unitPrice = 64;

function currency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function updateOrder() {
  const subtotal = unitPrice * state.quantity;
  const shipping = subtotal >= 75 ? 0 : 4.95;
  const discount = state.promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;
  quantityElement.textContent = state.quantity;
  document.querySelector('#item-count').textContent = state.quantity;
  document.querySelector('#product-subtotal').textContent = currency(subtotal);
  document.querySelector('#subtotal').textContent = currency(subtotal);
  document.querySelector('#shipping').textContent = shipping === 0 ? 'Free' : currency(shipping);
  document.querySelector('#discount-row').hidden = !state.promoApplied;
  document.querySelector('#discount').textContent = `−${currency(discount)}`;
  document.querySelector('#total').textContent = currency(total);
  payButton.querySelector('span').textContent = `${state.paymentMethod === 'link' ? 'Continue with Link' : 'Pay'} ${currency(total)}`;
}

document.querySelector('#quantity-decrease').addEventListener('click', () => {
  state.quantity = Math.max(1, state.quantity - 1);
  updateOrder();
});
document.querySelector('#quantity-increase').addEventListener('click', () => {
  state.quantity = Math.min(9, state.quantity + 1);
  updateOrder();
});
document.querySelectorAll('input[name="payment-method"]').forEach(input => {
  input.addEventListener('change', () => {
    state.paymentMethod = input.value;
    document.querySelectorAll('.payment-option').forEach(option => {
      option.classList.toggle('selected', option.contains(input) && input.checked);
    });
    updateOrder();
  });
});
document.querySelector('#promo-form').addEventListener('submit', event => {
  event.preventDefault();
  const code = document.querySelector('#promo-code').value.trim().toUpperCase();
  const message = document.querySelector('#promo-message');
  state.promoApplied = code === 'STUDIO10';
  message.textContent = state.promoApplied ? 'STUDIO10 applied. You saved 10%.' : 'That code is not valid. Try STUDIO10.';
  message.classList.toggle('promo-success', state.promoApplied);
  updateOrder();
});
document.querySelector('#checkout-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const formData = new FormData(event.currentTarget);
  const total = document.querySelector('#total').textContent;
  payButton.disabled = true;
  payButton.querySelector('span').textContent = 'Simulating payment…';
  window.setTimeout(() => {
    document.querySelector('#checkout-layout').hidden = true;
    document.querySelector('#checkout-success').hidden = false;
    document.querySelector('#confirmation-id').textContent = `NG-${Math.floor(10000 + Math.random() * 90000)}`;
    document.querySelector('#confirmation-total').textContent = total;
    document.querySelector('#confirmation-email').textContent = formData.get('email');
    document.querySelector('.checkout-steps').innerHTML = '<span class="step-complete">01 <b>Cart</b></span><span class="step-rule"></span><span class="step-complete">02 <b>Checkout</b></span><span class="step-rule"></span><span class="step-current">03 <b>Confirmation</b></span>';
    document.querySelector('.checkout-intro h1').textContent = 'Order confirmed.';
    document.querySelector('.checkout-intro p').textContent = 'This was a simulation. No payment was collected.';
    document.querySelector('#restart-checkout').addEventListener('click', () => window.location.reload());
  }, 650);
});
updateOrder();
