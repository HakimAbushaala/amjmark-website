import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "AMJ Mark <orders@amjmark.com>";
const ADMIN_EMAIL = "aabushaa@gmail.com";

type OrderEmailInfo = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  items: { description: string; qty: number }[];
};

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function sendOrderConfirmationEmail(order: OrderEmailInfo) {
  const itemLines = order.items
    .map((i) => `<li>${i.qty} × ${i.description}</li>`)
    .join("");

  await resend.emails.send({
    from: FROM,
    to: order.customerEmail,
    subject: `AMJ Mark — Order Confirmed (#${order.orderId.slice(0, 8)})`,
    html: `
      <h2>Thanks for your order, ${order.customerName}!</h2>
      <p>We've received order <b>#${order.orderId.slice(0, 8)}</b> and it's now in our queue.</p>
      <ul>${itemLines}</ul>
      <p><b>Total: ${money(order.totalCents)}</b></p>
      <p>Standard turnaround: 48 hours. Questions? Reply to this email or contact ${ADMIN_EMAIL}.</p>
    `,
  });
}

export async function sendAdminOrderAlertEmail(order: OrderEmailInfo) {
  const itemLines = order.items
    .map((i) => `<li>${i.qty} × ${i.description}</li>`)
    .join("");

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New order #${order.orderId.slice(0, 8)} — ${money(order.totalCents)}`,
    html: `
      <h2>New paid order</h2>
      <p>${order.customerName} (${order.customerEmail})</p>
      <ul>${itemLines}</ul>
      <p><b>Total: ${money(order.totalCents)}</b></p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${order.orderId}">View in admin dashboard</a></p>
    `,
  });
}

export async function sendOrderShippedEmail(order: OrderEmailInfo) {
  await resend.emails.send({
    from: FROM,
    to: order.customerEmail,
    subject: `Your AMJ Mark order has shipped (#${order.orderId.slice(0, 8)})`,
    html: `
      <h2>Your order is on its way!</h2>
      <p>Order <b>#${order.orderId.slice(0, 8)}</b> has shipped.</p>
      <p>Questions? Contact ${ADMIN_EMAIL}.</p>
    `,
  });
}
