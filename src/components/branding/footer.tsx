import { siteConfig } from '@/app/siteConfig';

export function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-text hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text hover:text-gray-900">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text hover:text-gray-900">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-text hover:text-gray-900">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text hover:text-gray-900">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text hover:text-gray-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={siteConfig.baseLinks.privacy}
                  className="text-sm text-text hover:text-gray-900"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.baseLinks.terms}
                  className="text-sm text-text hover:text-gray-900"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-text">
            © {new Date().getFullYear()} Your Brand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
