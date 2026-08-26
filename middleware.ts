import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS sub_links (id SERIAL PRIMARY KEY, subdomain TEXT UNIQUE, url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
    const { rows } = await sql`SELECT * FROM sub_links ORDER BY id DESC;`;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { url, subdomain } = await request.json();
    const cleanSub = subdomain.toLowerCase().trim();
    
    await sql`CREATE TABLE IF NOT EXISTS sub_links (id SERIAL PRIMARY KEY, subdomain TEXT UNIQUE, url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
    await sql`INSERT INTO sub_links (subdomain, url) VALUES (${cleanSub}, ${url}) ON CONFLICT (subdomain) DO UPDATE SET url = ${url};`;
    
    return NextResponse.json({ success: true, subdomain: cleanSub });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
