import { ThemeToggle } from "@/components/layout/themeToggle";
import { Home } from "lucide-react";
import { Link } from "react-router";

export function Header() {
  return (
    <header className="w-full px-4 py-1 border-2 border-t-0 bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8">
              <Home size={24} className="rounded-sm" />
            </div>
            <h1 className="text-lg font-bold text-foreground">AI Blog</h1>{" "}
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6"></nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
