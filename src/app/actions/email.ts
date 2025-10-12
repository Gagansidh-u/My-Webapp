
"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Grock Technologies <noreply@grock.fun>',
            to: to,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email Sending Error:', error);
        return { success: false, error: 'An unexpected error occurred.' };
    }
};
