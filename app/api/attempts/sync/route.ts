// app/api/attempts/sync/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Sync attempts endpoint in development' })
}
