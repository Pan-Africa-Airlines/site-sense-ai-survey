
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-4 text-center border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Powered by Akhanya IT. All rights reserved &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
