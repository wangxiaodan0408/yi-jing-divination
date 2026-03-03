import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'secret123';

let mockRecords: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('admin') === ADMIN_SECRET;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    let displayRecords = isAdmin 
      ? mockRecords 
      : mockRecords.filter(r => r.user_id === userId);

    return NextResponse.json({ records: displayRecords });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRecord = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      ...body
    };
    
    mockRecords.push(newRecord);
    return NextResponse.json({ record: newRecord }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
