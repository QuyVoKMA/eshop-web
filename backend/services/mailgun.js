import Mailgun from 'mailgun.js';
import formData from 'form-data'

import {resetEmail, 
  confirmResetPasswordEmail,
   signupEmail,
   merchantSignup,
   merchantWelcome,
   newsletterSubscriptionEmail,
   contactEmail,
   merchantApplicationEmail,
   merchantDeactivateAccount,
   orderConfirmationEmail
   } from '../config/template.js'

   import keys from '../config/keys.js';
const { key, domain, sender } = keys.mailgun;
const mailgun = new Mailgun(formData)
class MailgunService {
  init() {
    try {
      return new mailgun.client({
        apiKey: key,
        domain: domain
      });
    } catch (error) {
      console.warn('Missing mailgun keys');
    }
  }
}

const mailguns = new MailgunService().init();

export const sendEmail = async (email, type, host, data) => {
  try {
    const message = prepareTemplate(type, host, data);

    const config = {
      from: `MERN Store! <${sender}>`,
      to: email,
      subject: message.subject,
      text: message.text
    };

    return await mailgun.messages().send(config);
  } catch (error) {
    return error;
  }
};

const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case 'reset':
      message = resetEmail(host, data);
      break;

    case 'reset-confirmation':
      message = confirmResetPasswordEmail();
      break;

    case 'signup':
      message = signupEmail(data);
      break;

    case 'merchant-signup':
      message = merchantSignup(host, data);
      break;

    case 'merchant-welcome':
      message = merchantWelcome(data);
      break;

    case 'newsletter-subscription':
      message = newsletterSubscriptionEmail();
      break;

    case 'contact':
      message = contactEmail();
      break;

    case 'merchant-application':
      message = merchantApplicationEmail();
      break;

    case 'merchant-deactivate-account':
      message = merchantDeactivateAccount();
      break;

    case 'order-confirmation':
      message = orderConfirmationEmail(data);
      break;

    default:
      message = '';
  }

  return message;
};

export default mailgun