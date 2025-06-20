import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  // Placeholder implementation
  return NextResponse.json({
    success: true,
    message: `Received shareId: ${params.shareId}`
  })
} 