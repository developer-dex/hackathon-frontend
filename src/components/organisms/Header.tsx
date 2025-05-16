import React from "react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  links?: Array<{ href: string; label: string }>;
}

/**
 * Site header component with navigation links
 */
export const Header: React.FC<HeaderProps> = ({ title, links = [] }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                {title}
              </Link>
            </div>
            <nav className="ml-6 flex items-center space-x-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
