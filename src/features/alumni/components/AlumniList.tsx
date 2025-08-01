import type { Alumni } from "@shared/types/alumni";
import { AlumniCard } from "./AlumniCard";

export function AlumniList({ alumni }: { alumni: Alumni[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alumni.map((alum) => (
        <AlumniCard key={alum._id} alum={alum} />
      ))}
    </div>
  );
}
