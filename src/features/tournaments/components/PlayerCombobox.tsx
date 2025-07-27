import { Combobox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

interface Player {
  _id: string;
  name: string;
  gender: string;
}

interface PlayerComboboxProps {
  players: Player[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export default function PlayerCombobox({
  players,
  value,
  onChange,
  disabled,
}: PlayerComboboxProps) {
  const [query, setQuery] = useState("");

  const filteredPlayers =
    query === ""
      ? players
      : players.filter((player) =>
          player.name.toLowerCase().includes(query.toLowerCase())
        );

  const selectedPlayer = players.find((p) => p._id === value) || null;

  return (
    <Combobox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Combobox.Input
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          displayValue={() =>
            selectedPlayer
              ? `${selectedPlayer.name} (${selectedPlayer.gender})`
              : ""
          }
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search player..."
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronsUpDown
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {filteredPlayers.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              No players found.
            </div>
          ) : (
            filteredPlayers.map((player) => (
              <Combobox.Option
                key={player._id}
                value={player._id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-600 text-white" : "text-gray-900"
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {player.name} ({player.gender})
                    </span>
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
