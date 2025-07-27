import { Combobox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

interface Tournament {
  _id: string;
  name: string;
  year: number;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface TournamentComboboxProps {
  tournaments: Tournament[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export default function TournamentCombobox({
  tournaments,
  value,
  onChange,
  disabled,
}: TournamentComboboxProps) {
  const [query, setQuery] = useState("");

  const filteredTournaments =
    query === ""
      ? tournaments
      : tournaments.filter(
          (tournament) =>
            tournament.name.toLowerCase().includes(query.toLowerCase()) ||
            tournament.location.toLowerCase().includes(query.toLowerCase()) ||
            tournament.type.toLowerCase().includes(query.toLowerCase())
        );

  const selectedTournament = tournaments.find((t) => t._id === value) || null;

  return (
    <Combobox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Combobox.Input
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          displayValue={() =>
            selectedTournament
              ? `${selectedTournament.name} (${selectedTournament.year}) - ${selectedTournament.location}`
              : ""
          }
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tournaments by name, location, or type..."
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronsUpDown
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {filteredTournaments.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              No tournaments found.
            </div>
          ) : (
            filteredTournaments.map((tournament) => (
              <Combobox.Option
                key={tournament._id}
                value={tournament._id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-600 text-white" : "text-gray-900"
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <div className="flex flex-col">
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {tournament.name} ({tournament.year})
                      </span>
                      <span
                        className={`block truncate text-xs ${
                          active ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {tournament.location} • {tournament.type}
                      </span>
                    </div>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-blue-600"
                        }`}
                      >
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
