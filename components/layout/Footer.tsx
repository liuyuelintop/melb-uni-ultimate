import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Melbourne University Ultimate Frisbee Club
            </h3>
            <p className="text-gray-300">
              Promoting the sport of Ultimate Frisbee at the University of
              Melbourne since 1995.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/announcements" className="hover:text-white">
                  Announcements
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>📍 University Sports Complex</p>
              <p>📧 ultimate@unimelb.edu.au</p>
              <p>📱 +61 3 8344 4000</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>
            &copy; 2024 Melbourne University Ultimate Frisbee Club. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
