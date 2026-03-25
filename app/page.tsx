import InvoiceForm from "@/components/InvoiceForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">GST Invoice Generator</h1>
          <p className="mt-2 text-lg text-gray-600">Create, manage, and print professional GST tax invoices quickly.</p>
        </header>
        <InvoiceForm />
      </div>
    </main>
  );
}
