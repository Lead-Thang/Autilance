import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test if __dirname is defined
    const hasDirname = typeof __dirname !== 'undefined';
    const hasFilename = typeof __filename !== 'undefined';
    
    return NextResponse.json({ 
      hasDirname, 
      hasFilename,
      dirname: hasDirname ? __dirname : 'undefined',
      filename: hasFilename ? __filename : 'undefined'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}