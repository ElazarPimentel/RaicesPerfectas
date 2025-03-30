// filename: src/components/Header.tsx

import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export const Header: React.FC = () => {
  return (
    <header className="container-basic-border">
      <div className="header-content">
        <h1>Raices Perfectas</h1>
        <ThemeToggle />
      </div>
    </header>
  );
};
