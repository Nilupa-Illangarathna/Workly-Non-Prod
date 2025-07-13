import Link from "next/link";
import ThemedLogoLink from "../themed-logo-link";

export default function ContactFooter() {
  return (
    <footer className="bg-dark-bg text-white">
      <div className="container mx-auto max-w-6xl pt-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <ThemedLogoLink href="/" imgWidth={150} imgHeight={50} />
            <p className="mt-4 mb-8 text-white/80">
              Sri Lanka&apos;s premier digital marketing training program with
              guaranteed job placements.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="bg-primary/20 hover:bg-primary/30 p-2 rounded-full text-white hover:text-highlight-yellow transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-primary/20 hover:bg-primary/30 p-2 rounded-full text-white hover:text-highlight-yellow transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-primary/20 hover:bg-primary/30 p-2 rounded-full text-white hover:text-highlight-yellow transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white/90">Contact</h3>
            <div className="p-4 mb-4">
              <address className="not-italic text-gray-300">
                <p className="mb-2">1/23, Embilmeegama, Pilimathalawa,</p>
                <p>Sri Lanka.</p>
              </address>
            </div>
            <p className="mt-4 flex items-center text-white p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-highlight-yellow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +94 777 703 449
            </p>
            <p className="mt-2 flex items-center p-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-highlight-yellow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              info@workly.cloud
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white/90">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href="#"
                  className="flex items-center p-2 hover:text-highlight-yellow transition-colors">
                  <span className="w-2 h-2 rounded-full bg-highlight-yellow mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center p-2 hover:text-highlight-yellow transition-colors">
                  <span className="w-2 h-2 rounded-full bg-highlight-yellow mr-2"></span>
                  Curriculum
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center p-2 hover:text-highlight-yellow transition-colors">
                  <span className="w-2 h-2 rounded-full bg-highlight-yellow mr-2"></span>
                  Success Stories
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center p-2 hover:text-highlight-yellow transition-colors">
                  <span className="w-2 h-2 rounded-full bg-highlight-yellow mr-2"></span>
                  Job Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center p-2 hover:text-highlight-yellow transition-colors">
                  <span className="w-2 h-2 rounded-full bg-highlight-yellow mr-2"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white/90">Newsletter</h3>
            <div className="">
              <p className="text-gray-300 mb-4">
                Subscribe to receive updates and digital marketing tips.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-highlight-yellow"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-highlight-yellow hover:bg-highlight-yellow/90 text-dark-bg font-medium rounded">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 py-2 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-highlight-yellow/90">
            Powered by Gainro Global Group (PVT) Ltd
          </p>
          <div className="text-center md:text-right flex flex-col md:flex-row items-center gap-x-4">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Workly. All rights reserved.
            </p>
            <div className="flex items-center justify-center md:justify-end space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-highlight-yellow">
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-highlight-yellow">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
