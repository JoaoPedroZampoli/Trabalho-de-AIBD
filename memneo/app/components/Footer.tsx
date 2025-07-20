import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold ">Memneo</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Uma forma inteligente de aprender e lembrar de qualquer coisa com flashcards inteligentes e repetição espaçada.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/features" className="hover:text-white transition-colors duration-200">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors duration-200">Pricing</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors duration-200">Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/help" className="hover:text-white transition-colors duration-200">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors duration-200">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors duration-200">About</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors duration-200">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors duration-200">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Memneo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
