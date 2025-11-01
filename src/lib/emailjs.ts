import emailjs from '@emailjs/browser';

const emailjsConfig = {
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
};

export const initEmailJS = (): boolean => {
  if (typeof window !== 'undefined' && emailjsConfig.publicKey) {
    emailjs.init(emailjsConfig.publicKey);
    return true;
  }
  return false;
};

export const sendEmail = async (templateParams: {
  from_name: string;
  from_email: string;
  message: string;
  to_email: string;
}): Promise<void> => {
  if (!emailjsConfig.serviceId || !emailjsConfig.templateId) {
    throw new Error('EmailJS not configured properly');
  }

  await emailjs.send(
    emailjsConfig.serviceId,
    emailjsConfig.templateId,
    templateParams
  );
};