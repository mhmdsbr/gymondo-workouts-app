export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-gray-200 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-white">Workout Assessment</h3>
            <p className="text-sm text-white mt-1">
              Stay healthy with Gymondo workout programs
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-100">
          <p>© {currentYear}Gymondo Workout Assessment App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}