import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="font-serif text-4xl mb-4">Wedding Not Found</h1>
        <p className="text-muted mb-8">This wedding site doesn&apos;t exist or hasn&apos;t been published yet.</p>
        <Link href="/" className="text-primary hover:text-primary-light underline">
          Go home
        </Link>
      </div>
    </div>
  );
}