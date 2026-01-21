import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  console.log('Creating email transporter...');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST ? 'Set' : 'Not set');
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'Not set');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

// Verify transporter connection
export const verifyEmailConnection = async () => {
  try {
    console.log('Verifying email connection...');
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email server connection verified successfully');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
};

// Get base URL for email links
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://your-domain.com'; // Replace with your production domain
  }
  return 'http://localhost:3000';
};

// Send email function (generic)
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration is missing. Email will not be sent.');
      console.warn('Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in your .env.local file');
      return { success: false, error: 'Email configuration missing' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'UAE Followers'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send verification email
export const sendVerificationEmail = async ({ email, firstName, verificationToken }) => {
  console.log('Preparing verification email...');
  const baseUrl = getBaseUrl();
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

  const subject = 'Verify Your Email Address';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
        <h1 style="color: #4a5568; margin-top: 0;">Welcome to UAE Followers!</h1>
        <p>Hello ${firstName || 'there'},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4a5568; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationUrl}</p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} UAE Followers. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: email, subject, html });
};

// Send welcome email
export const sendWelcomeEmail = async ({ email, firstName }) => {
  console.log('Preparing welcome email...');
  const baseUrl = getBaseUrl();

  const subject = 'Welcome to UAE Followers!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
        <h1 style="color: #4a5568; margin-top: 0;">Welcome to UAE Followers, ${firstName || 'there'}!</h1>
        <p>We're excited to have you join our community of flower and gift lovers.</p>
        <p>Here's what you can do:</p>
        <ul style="color: #4a5568;">
          <li>Browse our beautiful collection of flowers and gifts</li>
          <li>Order fresh flowers with same-day or scheduled delivery</li>
          <li>Explore our special occasions and seasonal collections</li>
          <li>Read our blog for tips and inspiration</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/products" style="background-color: #4a5568; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Shopping</a>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} UAE Followers. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: email, subject, html });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async ({ email, firstName, order }) => {
  console.log('Preparing order confirmation email...');
  const baseUrl = getBaseUrl();
  const orderUrl = `${baseUrl}/orders`;

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">AED ${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">AED ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  const subject = `Order Confirmation - Order #${order.id}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
        <h1 style="color: #4a5568; margin-top: 0;">Thank You for Your Order!</h1>
        <p>Hello ${firstName || 'there'},</p>
        <p>We've received your order and are processing it. Here are your order details:</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #4a5568; margin-top: 0; font-size: 18px;">Order Information</h2>
          <p><strong>Order Number:</strong> ${order.id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
          <p><strong>Order Status:</strong> ${order.order_status}</p>
          <p><strong>Payment Status:</strong> ${order.payment_status}</p>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #4a5568; margin-top: 0; font-size: 18px;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e2e8f0;">Quantity</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e2e8f0;">Price</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e2e8f0;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #e2e8f0;">Total Amount:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #e2e8f0;">AED ${order.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${
          order.shipping_address
            ? `
        <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #4a5568; margin-top: 0; font-size: 18px;">Delivery Address</h2>
          <p>
            ${order.shipping_address.full_name || ''}<br>
            ${order.shipping_address.address_line1 || ''}<br>
            ${order.shipping_address.address_line2 ? order.shipping_address.address_line2 + '<br>' : ''}
            ${order.shipping_address.city || ''}, ${order.shipping_address.state || ''} ${order.shipping_address.postal_code || ''}<br>
            ${order.shipping_address.country || ''}<br>
            ${order.shipping_address.phone ? 'Phone: ' + order.shipping_address.phone : ''}
          </p>
        </div>
        `
            : ''
        }

        <div style="text-align: center; margin: 30px 0;">
          <a href="${orderUrl}" style="background-color: #4a5568; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Your Orders</a>
        </div>

        <p>We'll send you another email when your order is shipped. If you have any questions, please contact our support team.</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} UAE Followers. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: email, subject, html });
};



