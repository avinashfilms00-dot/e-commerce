import { NextResponse } from 'next/server';

export async function POST() {
    // In a real-world app, you might invalidate the token in a database
    // For now, we just return success and let the client handle token removal
    return NextResponse.json({
        success: true,
        message: 'Logged out successfully',
    });
}
