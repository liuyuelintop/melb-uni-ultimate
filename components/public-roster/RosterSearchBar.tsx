import { Search } from "lucide-react";

interface RosterSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function RosterSearchBar({
  searchTerm,
  setSearchTerm,
}: RosterSearchBarProps) {
  return (
    <div className="relative flex-1 md:w-80">
      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search players..."
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
