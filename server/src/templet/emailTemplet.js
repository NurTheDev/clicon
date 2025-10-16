exports.verifyEmail = (name, otp, expiry, verifyLink) => {
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Verify Your Email Address</title>
    <style>
      body {
        background: #f6f8fa;
        font-family: 'Segoe UI', Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 480px;
        background: #fff;
        margin: 40px auto;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(60, 60, 60, 0.12);
        padding: 32px 24px;
      }
      .logo {
        display: block;
        margin: 0 auto 24px auto;
        width: 72px;
      }
      h2 {
        text-align: center;
        color: #2a2a2a;
        margin-bottom: 16px;
      }
      p {
        color: #434343;
        font-size: 16px;
        line-height: 1.7;
        margin-bottom: 20px;
      }
      .button {
        display: block;
        width: 80%;
        margin: 0 auto 18px auto;
        background: linear-gradient(90deg, #4f8cff 0%, #38c9ff 100%);
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
        border-radius: 8px;
        font-size: 18px;
        box-shadow: 0 2px 4px rgba(60, 60, 60, 0.13);
        transition: background 0.2s;
      }
      .button:hover {
        background: linear-gradient(90deg, #38c9ff 0%, #4f8cff 100%);
      }
      .footer {
        text-align: center;
        color: #8a8a8a;
        font-size: 13px;
        margin-top: 22px;
      }
      .otp-box {
        display: inline-block;
        font-size: 22px;
        font-weight: bold;
        letter-spacing: 2px;
        background: #f5f5fa;
        color: #3a3a3a;
        padding: 12px 24px;
        border-radius: 6px;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .expiry {
        text-align: center;
        color: #e74c3c;
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 14px;
      }
      .link {
        color: #4f8cff;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Optional: Insert your logo below -->
      <!-- <img src="https://yourdomain.com/logo.png" alt="Logo" class="logo"> -->
      <h2>Welcome to Clicon- The E-commerce Platform</h2>
      <p>
        Hi ${name},<br>
        Thank you for joining <strong>Clicon- The E-commerce Platform</strong>! To activate your account, please verify your email address by clicking the button below.
      </p>
      <a href="${verifyLink}" class="button">Verify Email</a>
      <div class="expiry">
        This code/link will expire on <strong>${expiry.toLocaleString()}</strong>
      </div>
      <p style="text-align: center;">
        Or copy and paste this OTP code into your browser or app:<br>
        <span class="otp-box">${otp}</span>
      </p>
      <p class="footer">
        If you did not sign up for this account, you can safely ignore this email.<br><br>
        &copy; 2025 Clicon. All rights reserved.
      </p>
    </div>
  </body>
</html>
    `
}
exports.forgetPassword = ( otp, expiry, verifyLink) => {
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Verify Your Email Address</title>
    <style>
      body {
        background: #f6f8fa;
        font-family: 'Segoe UI', Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 480px;
        background: #fff;
        margin: 40px auto;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(60, 60, 60, 0.12);
        padding: 24px;
      }
      .logo {
        display: block;
        margin: 0 auto 24px auto;
        width: 72px;
      }
      h2 {
        text-align: center;
        color: #2a2a2a;
        margin-bottom: 16px;
      }
      p {
        color: #434343;
        font-size: 16px;
        line-height: 1.7;
        margin-bottom: 20px;
      }
      .button {
        display: block;
        width: 80%;
        margin: 0 auto 18px auto;
        background: linear-gradient(90deg, #4f8cff 0%, #38c9ff 100%);
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
        border-radius: 8px;
        font-size: 18px;
        box-shadow: 0 2px 4px rgba(60, 60, 60, 0.13);
        transition: background 0.2s;
      }
      .button:hover {
        background: linear-gradient(90deg, #38c9ff 0%, #4f8cff 100%);
      }
      .footer {
        text-align: center;
        font-size: 13px;
        margin-top: 22px;
      }
      .otp-box {
        display: inline-block;
        font-size: 22px;
        font-weight: bold;
        letter-spacing: 2px;
        background: #f5f5fa;
        color: #3a3a3a;
        padding: 12px 24px;
        border-radius: 6px;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .expiry {
        text-align: center;
        color: #e74c3c;
        font-size: 15px;
        margin-bottom: 14px;
      }
      .link {
        color: #4f8cff;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Optional: Insert your logo below -->
      <!-- <img src="https://yourdomain.com/logo.png" alt="Logo" class="logo"> -->
      <h2>Welcome to Clicon- The E-commerce Platform</h2>
      <p>
        Hi,<br>
        Thank you for joining <strong>Clicon- The E-commerce Platform</strong>! To reset your password, please verify your email address by clicking the button below.
      </p>
      <a href="${verifyLink}" class="button">Verify Email</a>
      <div class="expiry">
        This code/link will expire on <strong>${expiry.toLocaleString()}</strong>
      </div>
      <p style="text-align: center;">
        Or copy and paste this OTP code into your browser or app:<br>
        <span class="otp-box">${otp}</span>
      </p>
      <p class="footer">
        If you did not sign up for this account, you can safely ignore this email.<br><br>
        &copy; 2025 Clicon. All rights reserved.
      </p>
    </div>
  </body>
</html>
    `
}

exports.orderConfirmation = (orderData) => {
    const {
        orderNumber,
        customerName,
        orderDate,
        lineItems,
        subtotal,
        shippingAmount,
        taxAmount,
        totalAmount,
        currency,
        shippingAddress,
        paymentMethod,
        estimatedDelivery
    } = orderData;

    const lineItemsHTML = lineItems.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <div style="display: flex; align-items: center;">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 12px; border-radius: 6px;">` : ''}
                    <div>
                        <div style="font-weight: 500; color: #2a2a2a;">${item.name}</div>
                        <div style="font-size: 13px; color: #777;">Qty: ${item.quantity}</div>
                    </div>
                </div>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">${currency} ${item.totalPrice}</td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
    <style>
      body {
        background: #f6f8fa;
        font-family: 'Segoe UI', Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        background: #fff;
        margin: 40px auto;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(60, 60, 60, 0.12);
        padding: 32px 24px;
      }
      .logo {
        display: block;
        margin: 0 auto 24px auto;
        width: 72px;
      }
      .success-icon {
        text-align: center;
        font-size: 48px;
        color: #27ae60;
        margin-bottom: 16px;
      }
      h2 {
        text-align: center;
        color: #2a2a2a;
        margin-bottom: 8px;
      }
      .order-number {
        text-align: center;
        color: #666;
        font-size: 14px;
        margin-bottom: 24px;
      }
      .order-number strong {
        color: #4f8cff;
      }
      p {
        color: #434343;
        font-size: 15px;
        line-height: 1.7;
        margin-bottom: 20px;
      }
      .section-title {
        font-weight: 600;
        color: #2a2a2a;
        font-size: 16px;
        margin-top: 24px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 2px solid #f0f0f0;
      }
      .order-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .summary-table {
        width: 100%;
        margin-top: 16px;
      }
      .summary-table td {
        padding: 8px 0;
        font-size: 15px;
      }
      .summary-table .label {
        color: #666;
      }
      .summary-table .value {
        text-align: right;
        font-weight: 500;
        color: #2a2a2a;
      }
      .summary-table .total {
        font-size: 18px;
        font-weight: bold;
        color: #27ae60;
        padding-top: 12px;
        border-top: 2px solid #eee;
      }
      .address-box {
        background: #f9f9f9;
        padding: 16px;
        border-radius: 8px;
        margin-top: 12px;
        font-size: 14px;
        line-height: 1.6;
        color: #434343;
      }
      .button {
        display: block;
        width: fit-content;
        margin: 24px auto;
        background: linear-gradient(90deg, #4f8cff 0%, #38c9ff 100%);
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        text-align: center;
        padding: 14px 32px;
        border-radius: 8px;
        font-size: 16px;
        box-shadow: 0 2px 4px rgba(60, 60, 60, 0.13);
        transition: background 0.2s;
      }
      .button:hover {
        background: linear-gradient(90deg, #38c9ff 0%, #4f8cff 100%);
      }
      .footer {
        text-align: center;
        color: #8a8a8a;
        font-size: 13px;
        margin-top: 32px;
        padding-top: 20px;
        border-top: 1px solid #eee;
      }
      .highlight {
        background: #fff3cd;
        padding: 12px;
        border-radius: 6px;
        margin: 16px 0;
        font-size: 14px;
        color: #856404;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Optional: Insert your logo below -->
      <!-- <img src="https://yourdomain.com/logo.png" alt="Logo" class="logo"> -->
      
      <div class="success-icon">✓</div>
      <h2>Order Confirmed!</h2>
      <div class="order-number">
        Order Number: <strong>#${orderNumber}</strong>
      </div>
      
      <p>
        Hi ${customerName},<br>
        Thank you for your order! We're happy to confirm that we've received your order and it's being processed.
      </p>
      
      <div class="highlight">
        <strong>📦 Estimated Delivery:</strong> ${estimatedDelivery || 'Within 5-7 business days'}
      </div>

      <div class="section-title">Order Details</div>
      <table class="order-table">
        ${lineItemsHTML}
      </table>

      <table class="summary-table">
        <tr>
          <td class="label">Subtotal:</td>
          <td class="value">${currency} ${subtotal}</td>
        </tr>
        <tr>
          <td class="label">Shipping:</td>
          <td class="value">${currency} ${shippingAmount}</td>
        </tr>
        <tr>
          <td class="label">Tax:</td>
          <td class="value">${currency} ${taxAmount}</td>
        </tr>
        <tr class="total">
          <td class="label">Total:</td>
          <td class="value">${currency} ${totalAmount}</td>
        </tr>
      </table>

      <div class="section-title">Shipping Address</div>
      <div class="address-box">
        <strong>${shippingAddress.fullName}</strong><br>
        ${shippingAddress.addressLine1}<br>
        ${shippingAddress.addressLine2 ? `${shippingAddress.addressLine2}<br>` : ''}
        ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
        ${shippingAddress.country}<br>
        Phone: ${shippingAddress.phoneNumber}
      </div>

      <div class="section-title">Payment Method</div>
      <p style="margin-top: 8px; font-weight: 500;">${paymentMethod}</p>

      <a href="${process.env.CLIENT_URL}/orders/${orderNumber}" class="button">Track Your Order</a>

      <p style="text-align: center; font-size: 14px; color: #666;">
        You will receive a shipping confirmation email with tracking information once your order ships.
      </p>

      <p class="footer">
        Need help? Contact us at <a href="mailto:support@clicon.com" style="color: #4f8cff;">support@clicon.com</a><br>
        or call us at 1-800-XXX-XXXX<br><br>
        &copy; 2025 Clicon. All rights reserved.
      </p>
    </div>
  </body>
</html>
    `;
};
