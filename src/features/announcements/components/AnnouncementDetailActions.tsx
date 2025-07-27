import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AnnouncementDetailActions() {
  return (
    <div className="mt-6 flex justify-center">
      <Link
        href="/announcements"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to All Announcements
      </Link>
    </div>
  );
}
