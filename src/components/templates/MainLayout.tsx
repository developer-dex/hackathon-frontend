import React from "react";
import Header from "@/components/organisms/Header";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Main layout template with header and footer
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = "Next.js App",
}) => {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} links={navLinks} />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Next.js Application. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
