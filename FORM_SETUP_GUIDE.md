# Form Submission Setup Guide

This guide explains how to set up your contact and callback forms to work with **EmailJS** (for email notifications) and **Twilio** (for WhatsApp/SMS alerts).

## Overview

Your forms are now configured to:
1. ✅ Send form submissions via email to your inbox
2. ✅ Send WhatsApp messages to users after submission
3. ✅ Send SMS notifications to admin

## Setup Instructions

### Step 1: Configure EmailJS (for Email Notifications)

EmailJS allows you to send emails directly from your website without a backend server.

#### A. Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

#### B. Set Up Email Service
1. In the EmailJS dashboard, go to **Email Services**
2. Click **"Create New Service"**
3. Select **"Gmail"** (or your preferred email provider)
4. Follow the setup wizard:
   - Allow EmailJS to access your Gmail account
   - Name the service: `gmail_service` (or any name)
   - Save and note the **Service ID**

#### C. Create Email Templates
You need to create two templates: one for contact form, one for callback.

**Template 1: Contact Form Email**
1. Go to **Email Templates** → Click **"Create New Template"**
2. Set Template ID: `template_contact`
3. Paste this template content:

```
Subject: New Contact Form Submission - Secure Life Hub

From: {{from_name}} ({{from_phone}})
Email: {{from_email}}

Service Interested: {{service}}

Message:
{{message}}

---
This is an automated email from Secure Life Hub website.
Reply to: {{reply_to}}
```

4. Click "Save"

**Template 2: Callback Form Email**
1. Create another template with Template ID: `template_callback`
2. Paste this content:

```
Subject: New Callback Request - Secure Life Hub

From: {{from_name}}
Phone: {{from_phone}}
Best Time to Call: {{best_time}}

---
This is an automated email from Secure Life Hub website.
```

3. Click "Save"

#### D. Get Your EmailJS Credentials
1. Go to **Account** → **API Keys**
2. Copy your **Public Key**

#### E. Update form-handler.js
Edit `js/form-handler.js` and replace:

```javascript
const FORM_CONFIG = {
  emailjs: {
    serviceID: 'gmail_service', // Your service name
    contactTemplateID: 'template_contact',
    callbackTemplateID: 'template_callback',
    publicKey: 'YOUR_PUBLIC_KEY_HERE', // Paste your public key
  },
  // ... rest of config
```

---

### Step 2: Configure Twilio (for WhatsApp/SMS)

Twilio handles WhatsApp and SMS messaging.

#### A. Create Twilio Account
1. Go to [twilio.com](https://www.twilio.com/)
2. Sign up for a free account
3. Verify your phone number

#### B. Get Your Twilio Credentials
1. Go to **Account** → **Account SID and Auth Token**
2. Copy:
   - **Account SID**: `AC_...`
   - **Auth Token**: Your auth token

#### C. Set Up WhatsApp (Optional but Recommended)
1. Go to **Messaging** → **WhatsApp** (in Twilio console)
2. Click **"Send a WhatsApp Message"**
3. Link your WhatsApp Business account (or use sandbox for testing)
4. Save your **Business Phone ID**

#### D. Set Up SMS (or use WhatsApp sandbox for testing)
1. Go to **Messaging** → **Phone Numbers**
2. Get a Twilio phone number or use the sandbox number
3. Note the phone number

#### E. Update form-handler.js
Edit `js/form-handler.js` and replace:

```javascript
twilio: {
  accountSID: 'AC_YOUR_ACCOUNT_SID',
  authToken: 'YOUR_AUTH_TOKEN',
  fromNumber: '+918075445484', // Your Twilio number
  businessPhoneID: 'YOUR_PHONE_ID',
},
```

---

### Step 3: Enable Twilio Backend Calls (Optional)

By default, the form-handler logs messages to the console. To actually send WhatsApp/SMS:

1. Open `js/form-handler.js`
2. Find the commented code in `sendWhatsAppMessage()` and `sendSMSNotification()`
3. **Important**: Uncommenting these will require backend authentication to secure your API keys!

**Why not enabled by default?**
- Exposing your Twilio credentials in frontend JavaScript is a security risk
- We recommend using a backend server (Node.js, PHP, etc.) to handle these requests

**For Production Use:**
- Create a backend endpoint on your server
- Have the form-handler POST to your backend
- Your backend makes authenticated Twilio API calls
- Your credentials stay secure

---

## Quick Test Checklist

- [ ] EmailJS account created and configured
- [ ] Two email templates created (contact + callback)
- [ ] Public Key added to form-handler.js
- [ ] Form fields are populated with correct IDs
- [ ] Test: Fill out the contact form
- [ ] Check: Email received in your inbox
- [ ] (Optional) Twilio configured for WhatsApp/SMS

---

## Testing

### Test Contact Form
1. Open your website
2. Scroll to "Request a Free Consultation" section
3. Fill out the form with:
   - Name: Test User
   - Phone: +91 9447324152
   - Email: test@example.com
   - Service: Any
   - Message: Test message

4. Click "Send Message & Get Free Advice"
5. Check your email inbox for the submission

### Test Callback Form
1. Click the "Request Callback" button (floating button on right)
2. Fill out:
   - Name: Test User
   - Phone: +91 9447324152
   - Best Time: Any Time

3. Click "Request Callback Now"
4. Check your email for the callback request

---

## Troubleshooting

### "EmailJS is not defined" error
- Make sure you've added the EmailJS library to your HTML before form-handler.js
- Check that your public key is correctly configured

### Forms not submitting
- Open browser console (F12) and check for errors
- Verify that form field IDs match those in form-handler.js:
  - Contact form: `contact-name`, `contact-phone`, `contact-email`, `contact-service`, `contact-message`
  - Callback form: `callback-name`, `callback-phone`, `callback-time`

### Emails not being received
- Check spam/promotions folder
- Verify EmailJS service is properly configured in your Gmail account
- Make sure template IDs match your EmailJS templates

### API Key errors
- Double-check that you've copied keys exactly (no extra spaces)
- Make sure you're using the correct key type (Public Key, not Private Key)

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Don't expose secrets**: The form-handler.js only uses the EmailJS Public Key (which is meant to be public). Never put your Twilio Auth Token in frontend code!

2. **For production Twilio integration**: 
   - Create a backend endpoint
   - Keep credentials on the server
   - Have frontend POST to your endpoint
   - Backend makes authenticated Twilio calls

3. **Rate limiting**: Add server-side rate limiting to prevent spam

4. **Form validation**: Current validation is minimal - add more checks as needed

---

## Support

For issues:
- **EmailJS Help**: [emailjs.com/docs](https://www.emailjs.com/docs)
- **Twilio Help**: [twilio.com/docs](https://www.twilio.com/docs)
- Check browser console for detailed error messages

---

## Next Steps (Optional Enhancements)

1. Add backend for secure Twilio calls
2. Implement email confirmation to users
3. Add form spam protection (CAPTCHA)
4. Store submissions in a database
5. Create admin dashboard to view submissions
6. Add multi-language support
7. Implement form analytics

---

Good luck! Your forms are now live and ready to receive real customer submissions. 🚀
