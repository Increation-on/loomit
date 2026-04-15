// app/api/auth/[...nextauth]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Auth endpoint in development' })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Auth endpoint in development' })
}