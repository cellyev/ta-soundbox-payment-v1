const nodemailer = require("nodemailer");

exports.sendPaymentEmail = async (
  customer_email,
  customer_name,
  transaction_id,
  gross_amount,
  items,
  payment_url
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Format jumlah uang menjadi format IDR (Rp)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const itemsTable = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
        item.name
      }</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${formatCurrency(
        item.quantity * item.price
      )}</td>
    </tr>
  `
    )
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customer_email,
    subject: "Your Order is Created - Complete Your Payment",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #FFA500;">Hello ${customer_name},</h2>
        <p>Your transaction has been successfully created. Please complete your payment using the details below:</p>
        <hr>
        <p><strong>Transaction ID:</strong> ${transaction_id}</p>
        <p><strong>Total Amount:</strong> ${formatCurrency(gross_amount)}</p>
        <p><strong>Status:</strong> Pending Payment</p>
        <hr>
        <h3>Items in Your Order</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f1f1f1;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTable}
          </tbody>
          <tfoot>
            <tr style="background-color: #f1f1f1;">
              <td colspan="2" style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>Total Amount</strong></td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${formatCurrency(
                gross_amount
              )}</td>
            </tr>
          </tfoot>
        </table>

        <p style="font-size: 16px; text-align: center; color: #333;">Click the button below to proceed with your payment:</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${payment_url}" style="padding: 12px 30px; background-color: #FFA500; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Complete Payment</a>
        </div>
        
        <p style="font-size: 16px; margin-top: 20px;">If you have any questions, feel free to contact us.</p>
        <p style="font-size: 16px;">Thank you for shopping with us!</p>
        <p style="font-size: 16px; text-align: center; color: #777;">Best Regards,</p>
        <p style="font-size: 16px; text-align: center; color: #FFA500;"><strong>Vailovent</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Payment email sent successfully.");
  } catch (error) {
    console.log("Failed to send payment email:", error);
  }
};
