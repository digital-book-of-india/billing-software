import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    // Determine the base URL dynamically based on the request
    // In dev: typically http://localhost:3000 or 3001
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;
    
    // Construct the URL to the invoice page
    const invoiceUrl = `${baseUrl}/invoice/${id}`;

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    // Navigate to the invoice page and wait for network connections to finish
    // We use networkidle2 instead of networkidle0 because Next.js dev server keeps a websocket open
    await page.goto(invoiceUrl, { waitUntil: 'networkidle2' });

    // Generate high-quality vector PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: true, // respects the 210mm x 297mm defined in CSS
    });

    await browser.close();

    // Return the PDF buffer as a downloadable response
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice_${id}.pdf"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Could not generate PDF' }, { status: 500 });
  }
}
