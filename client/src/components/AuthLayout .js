export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgMain text-white px-4">
        <div className="flex max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl">
          {children}
        </div>
      </div>
    );
  }
  