// filename: src/components/Footer.tsx

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} Raices Perfectas. All rights reserved.
          <span className="legal-text">
            {" "}
            | Terms of Service | Privacy Policy
          </span>
        </p>
      </div>
    </footer>
  );
};
