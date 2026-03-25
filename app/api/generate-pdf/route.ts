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
    
    // To set localStorage, we first need to be on the same domain
    await page.goto(baseUrl, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.setItem("isLoggedIn", "true");
    });
    
    // Now navigate to the actual invoice page
    await page.goto(invoiceUrl, { waitUntil: 'networkidle0' });

    // Inject CSS to ensure only the invoice is rendered and fits perfectly
    await page.addStyleTag({
      content: `
        @page { size: A4; margin: 0; }
        body, html { margin: 0 !important; padding: 0 !important; height: auto !important; min-height: auto !important; background: white !important; }
        main { margin: 0 !important; padding: 0 !important; min-height: auto !important; height: auto !important; }
        .print\\:hidden { display: none !important; }
        /* Hide everything except the invoice template container */
        body > *:not(main), main > *:not(div:last-child) { display: none !important; }
      `
    });

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
