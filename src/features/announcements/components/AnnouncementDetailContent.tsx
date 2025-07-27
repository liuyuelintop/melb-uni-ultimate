export function AnnouncementDetailContent({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
