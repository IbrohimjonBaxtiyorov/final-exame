import { Link } from "react-router-dom";
import logo from "../assets/gapclub.png";
import { ToggleMode } from "./ToggleMode";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" width={30} />
          <h3 className="text-lg font-bold">Gap Club</h3>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <Link to="/">Asosiy</Link>
          <Link to="/rounds">Rounds</Link>
          <Link to="/statistics">Statistica</Link>
          <Link to="/settings">Sozlamalar</Link>
          <ToggleMode />
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 shadow">
          <Link to="/" onClick={() => setIsOpen(false)} className="block">Asosiy</Link>
          <Link to="/rounds" onClick={() => setIsOpen(false)} className="block">Rounds</Link>
          <Link to="/statistics" onClick={() => setIsOpen(false)} className="block">Statistica</Link>
          <Link to="/settings" onClick={() => setIsOpen(false)} className="block">Sozlamalar</Link>
          <ToggleMode />
        </div>
      )}
    </header>
  );
}
