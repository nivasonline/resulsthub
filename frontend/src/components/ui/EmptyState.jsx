import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4 text-mist-400">
        <Icon size={24} />
      </div>
      <h3 className="text-mist-100 font-medium mb-1">{title}</h3>
      {description && <p className="text-sm text-mist-400 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
