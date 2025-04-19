export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 py-6 mt-12">
      <div className="container mx-auto text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </div>
    </footer>
  );
}
