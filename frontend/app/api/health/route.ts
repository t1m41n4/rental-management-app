import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test backend connectivity
    const backendHealth = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
    const backendStatus = await backendHealth.json();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      backend: backendStatus
    });
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      error: 'Backend connection failed'
    }, { status: 503 });
  }
}
