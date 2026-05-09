// =====================================================
// FORM HANDLER WITH EMAILJS & TWILIO INTEGRATION
// =====================================================

// Configuration - UPDATE THESE WITH YOUR API KEYS
const FORM_CONFIG = {
  // EmailJS Configuration
  emailjs: {
    serviceID: 'service_mfplpzf', // Replace with your EmailJS Service ID
    contactTemplateID: 'template_contact', // Contact form template
    callbackTemplateID: 'template_callback', // Callback form template
    publicKey: 'zMZNVHWnLrHpyAYpT', // Replace with your EmailJS Public Key
  },
  
  // Twilio Configuration (for WhatsApp/SMS)
  twilio: {
    accountSID: '', // Replace with your Twilio Account SID
    authToken: '', // Replace with your Twilio Auth Token
    fromNumber: '+918075445484', // Your Twilio number (for SMS)
    businessPhoneID: 'PHONE_ID_XXXXX', // Your WhatsApp Business Phone ID
  },
  
  // Admin Details
  admin: {
    email: 'licmanikandan@gmail.com',
    whatsapp: '+918075445484',
  }
};

// Initialize EmailJS when document is ready
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init(FORM_CONFIG.emailjs.publicKey);
    } catch (error) {
      console.error('❌ Failed to initialize EmailJS:', error);
    }
  } else {
    console.warn('⚠ EmailJS library not found. Make sure the CDN script is loaded before form-handler.js');
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEmailJS);
} else {
  initEmailJS();
}

// =====================================================
// CONTACT FORM HANDLER
// =====================================================
async function handleFormSubmit(btn) {
  try {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS library not loaded. Please check the CDN link in HTML.');
    }

    // Get form data
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const service = document.getElementById('contact-service').value;
    const message = document.getElementById('contact-message').value.trim();

    // Validate required fields
    if (!name || !phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    // Update button to loading state
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Prepare email data
    const emailData = {
      to_email: FORM_CONFIG.admin.email,
      name: name,
      phone: phone,
      email: email || 'Not provided',
      service: service || 'Not specified',
      message: message || 'No message',
      time: new Date().toLocaleString(),
      reply_to: email || phone,
    };

    // Send email via EmailJS
    await emailjs.send(
      FORM_CONFIG.emailjs.serviceID,
      FORM_CONFIG.emailjs.contactTemplateID,
      emailData
    );

    // Send WhatsApp message via Twilio
    await sendWhatsAppMessage(name, phone, service, message);

    // Send SMS notification
    await sendSMSNotification(name, phone, service);

    // Show success message
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent! We\'ll contact you soon.';
    btn.style.background = '#22c55e';

    // Reset form after 2 seconds
    setTimeout(() => {
      document.querySelector('.contact-form').reset();
      btn.disabled = false;
      btn.style.background = '';
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message & Get Free Advice';
    }, 2000);

  } catch (error) {
    console.error('Error submitting form:', error);
    btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error! Please try again.';
    btn.style.background = '#ef4444';
    
    setTimeout(() => {
      btn.disabled = false;
      btn.style.background = '';
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message & Get Free Advice';
    }, 3000);
  }
}

// =====================================================
// CALLBACK FORM HANDLER
// =====================================================
async function handleCallbackSubmit(btn) {
  try {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS library not loaded. Please check the CDN link in HTML.');
    }

    // Get form data
    const name = document.getElementById('callback-name').value.trim();
    const phone = document.getElementById('callback-phone').value.trim();
    const bestTime = document.getElementById('callback-time').value;

    // Validate required fields
    if (!name || !phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    // Update button to loading state
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Requesting...';

    // Prepare email data
    const emailData = {
      to_email: FORM_CONFIG.admin.email,
      name: name,
      phone: phone,
      best_time: bestTime,
      reply_to: phone,
    };

    // Send email via EmailJS
    await emailjs.send(
      FORM_CONFIG.emailjs.serviceID,
      FORM_CONFIG.emailjs.callbackTemplateID,
      emailData
    );

    // Send WhatsApp message
    await sendWhatsAppMessage(name, phone, 'Callback Request', `Preferred time: ${bestTime}`);

    // Send SMS notification
    await sendSMSNotification(name, phone, 'Callback Request');

    // Show success message
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Callback Requested! We\'ll call shortly.';
    btn.style.background = '#22c55e';

    // Reset and close modal after 2 seconds
    setTimeout(() => {
      closeModal();
      btn.disabled = false;
      btn.style.background = '';
      btn.innerHTML = '<i class="fas fa-phone"></i> Request Callback Now';
    }, 2000);

  } catch (error) {
    console.error('Error submitting callback:', error);
    btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error! Please try again.';
    btn.style.background = '#ef4444';
    
    setTimeout(() => {
      btn.disabled = false;
      btn.style.background = '';
      btn.innerHTML = '<i class="fas fa-phone"></i> Request Callback Now';
    }, 3000);
  }
}

// =====================================================
// TWILIO WHATSAPP SENDER
// =====================================================
async function sendWhatsAppMessage(name, phone, service, message) {
  try {
    // Format phone number for WhatsApp
    const formattedPhone = phone.replace(/\D/g, ''); // Remove all non-digits
    
    const whatsappMessage = `
Hello ${name},

Thank you for reaching out to Secure Life Hub! 🎉

We received your inquiry about ${service}.
${message ? `Your message: ${message}` : ''}

We'll contact you shortly with personalized solutions for your insurance and financial planning needs.

Stay secure! 🛡️
Secure Life Hub
    `.trim();

    // Using a simple approach - you can integrate Twilio API here
    // For now, we'll log it for testing purposes
    console.log('WhatsApp Message would be sent to:', phone);
    console.log('Message:', whatsappMessage);

    // To actually send WhatsApp via Twilio, uncomment and configure:
    /*
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + FORM_CONFIG.twilio.accountSID + '/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(FORM_CONFIG.twilio.accountSID + ':' + FORM_CONFIG.twilio.authToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'From': 'whatsapp:' + FORM_CONFIG.twilio.fromNumber,
        'To': 'whatsapp:' + formattedPhone,
        'Body': whatsappMessage,
      }),
    });
    */

  } catch (error) {
    console.error('WhatsApp error:', error);
  }
}

// =====================================================
// TWILIO SMS SENDER (for admin notification)
// =====================================================
async function sendSMSNotification(name, phone, service) {
  try {
    const adminPhone = FORM_CONFIG.admin.whatsapp;
    
    const smsMessage = `New submission from ${name} (${phone}) - Service: ${service}`;

    console.log('SMS would be sent to admin:', adminPhone);
    console.log('Message:', smsMessage);

    // To actually send SMS via Twilio, uncomment and configure:
    /*
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + FORM_CONFIG.twilio.accountSID + '/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(FORM_CONFIG.twilio.accountSID + ':' + FORM_CONFIG.twilio.authToken),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'From': FORM_CONFIG.twilio.fromNumber,
        'To': adminPhone,
        'Body': smsMessage,
      }),
    });
    */

  } catch (error) {
    console.error('SMS error:', error);
  }
}
