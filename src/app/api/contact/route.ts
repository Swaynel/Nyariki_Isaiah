import { NextRequest, NextResponse } from 'next/server';
import { saveContact } from '@/src/lib/firebase';
import { sendEmail } from '@/src/lib/emailjs';
import { personalInfo } from '@/src/config/site';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save to Firebase
    await saveContact({ name, email, message });

    // Send email via EmailJS
    await sendEmail({
      from_name: name,
      from_email: email,
      message,
      to_email: personalInfo.email
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}