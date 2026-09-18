import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
};

const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'dobitoursethiopia@gmail.com';

/**
 * Send Tour Booking Confirmation email to Customer and Alert email to Admin
 */
export const sendBookingNotification = async ({
  booking,
  customerName,
  customerEmail,
  customerPhone,
  tourTitle,
  guests,
  startDate,
  endDate,
  comments,
  orderNumber,
}) => {
  const transporter = createTransporter();

  const formattedStart = startDate ? new Date(startDate).toLocaleDateString() : 'N/A';
  const formattedEnd = endDate ? new Date(endDate).toLocaleDateString() : 'N/A';

  // Customer Email Content
  const customerSubject = `Tour Booking Confirmation - ${tourTitle} (${orderNumber || '#00001'})`;
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fcfdf9;">
      <div style="background-color: #556B2F; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">ANDI TOURS ETHIOPIA</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Your Ethiopian Adventure Awaits!</p>
      </div>
      
      <div style="padding: 24px; color: #333333;">
        <h2 style="color: #556B2F; margin-top: 0;">Thank You for Booking, ${customerName}!</h2>
        <p style="font-size: 15px; line-height: 1.6;">We have received your tour booking request. Our travel expert team will review your details and reach out to confirm your itinerary shortly.</p>
        
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2d3748; border-bottom: 2px solid #556B2F; padding-bottom: 8px;">Booking Summary</h3>
          <p style="margin: 8px 0;"><strong>Booking ID:</strong> ${orderNumber || '#00001'}</p>
          <p style="margin: 8px 0;"><strong>Tour Package:</strong> ${tourTitle}</p>
          <p style="margin: 8px 0;"><strong>Number of Tourists:</strong> ${guests} Person(s)</p>
          <p style="margin: 8px 0;"><strong>Travel Dates:</strong> ${formattedStart} ➔ ${formattedEnd}</p>
          <p style="margin: 8px 0;"><strong>Contact Phone:</strong> ${customerPhone || 'N/A'}</p>
          ${comments ? `<p style="margin: 8px 0;"><strong>Special Requests:</strong> ${comments}</p>` : ''}
          <p style="margin: 8px 0;"><strong>Booking Status:</strong> <span style="background-color: #fff3e0; color: #e65100; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">PENDING APPROVAL</span></p>
        </div>

        <p style="font-size: 14px; color: #555555; line-height: 1.5;">If you have any urgent questions, feel free to reply directly to this email or contact us via WhatsApp/Phone at <strong>+251 911 661 377</strong>.</p>
        <p style="margin-top: 30px; font-size: 14px; color: #777777;">Warm regards,<br /><strong>Andi Tours Team</strong><br />Addis Ababa, Ethiopia</p>
      </div>
    </div>
  `;

  // Admin Alert Email Content
  const adminSubject = `🚨 New Tour Booking Request from ${customerName} (${orderNumber || '#00001'})`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #c62828;">New Tour Booking Received!</h2>
      <p>A new customer has submitted a tour booking form:</p>
      <ul>
        <li><strong>Customer Name:</strong> ${customerName}</li>
        <li><strong>Email:</strong> ${customerEmail}</li>
        <li><strong>Phone:</strong> ${customerPhone}</li>
        <li><strong>Tour Package:</strong> ${tourTitle}</li>
        <li><strong>Visitors:</strong> ${guests} Person(s)</li>
        <li><strong>Travel Dates:</strong> ${formattedStart} ➔ ${formattedEnd}</li>
        <li><strong>Comments:</strong> ${comments || 'None'}</li>
      </ul>
      <p><a href="${process.env.FRONTEND_URL || 'https://anditours.vercel.app'}/admin" style="background-color: #556B2F; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; display: inline-block;">Open Admin Control Center</a></p>
    </div>
  `;

  if (transporter) {
    try {
      // 1. Send to Customer
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Andi Tours'}" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: customerSubject,
        html: customerHtml,
      });
      // 2. Send to Admin
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Andi Tours'}" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      });
      console.log(`Booking emails sent successfully to ${customerEmail} and Admin (${adminEmail})`);
    } catch (err) {
      console.error('SMTP Email sending error:', err.message);
    }
  } else {
    console.log(`[Email Service Notice] SMTP not configured. Simulated emails:
- Customer Email: ${customerEmail} | Subject: ${customerSubject}
- Admin Alert: ${adminEmail} | Subject: ${adminSubject}`);
  }
};

/**
 * Send Contact Message Alert email to Admin
 */
export const sendContactNotification = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  const transporter = createTransporter();

  const adminSubject = `📩 New Contact Inquiry from ${name}: "${subject}"`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #556B2F;">New Contact Inquiry Received</h2>
      <p>A user submitted a question on the Contact page:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
        <li><strong>Subject:</strong> ${subject}</li>
      </ul>
      <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #556B2F; border-radius: 4px; margin: 15px 0;">
        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
      </div>
      <p><a href="${process.env.FRONTEND_URL || 'https://anditours.vercel.app'}/admin" style="background-color: #556B2F; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Admin Messages</a></p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Andi Tours'}" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      });
      console.log(`Contact message email alert sent to Admin (${adminEmail})`);
    } catch (err) {
      console.error('SMTP Email sending error:', err.message);
    }
  } else {
    console.log(`[Email Service Notice] SMTP not configured. Simulated Admin Alert for Contact Message:
- Admin Alert: ${adminEmail} | Subject: ${adminSubject}`);
  }
};
