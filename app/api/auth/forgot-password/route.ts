import { NextRequest, NextResponse } from 'next/server';
import { executeQuerySingle, executeQuery } from '@/lib/sqlite-database';
import { sendPasswordResetEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();
		console.log('Forgot password request for email:', email);
		
		if (!email) {
			return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
		}

		// Find user by email
		const user = executeQuerySingle(
			'SELECT id, email, full_name FROM users WHERE email = ? AND is_active = 1',
			[email]
		);
		
		console.log('User found:', user ? `${user.full_name} (${user.email})` : 'No user found');
		
		if (!user) {
			// For security, always respond with success
			return NextResponse.json({ success: true, message: 'If your email exists, you will receive a password reset link.' });
		}

		// Generate a secure reset token
		const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes from now

		console.log('Generated token:', token);

		// Store token in DB
		executeQuery(
			'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
			[user.id, token, expiresAt]
		);
		
		console.log('Token stored in database');

		// Send email
		console.log('Attempting to send email...');
		try {
			await sendPasswordResetEmail(user.email, user.full_name, token);
			console.log('Email sent successfully to:', user.email);
		} catch (emailError) {
			console.error('Email sending failed:', emailError);
			// Don't fail the request, just log the error
		}

		return NextResponse.json({ success: true, message: 'If your email exists, you will receive a password reset link.' });
	} catch (error) {
		console.error('Forgot password error:', error);
		return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
	}
}
