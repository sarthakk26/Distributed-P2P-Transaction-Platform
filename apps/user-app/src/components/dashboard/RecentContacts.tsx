"use client";

interface Contact {
  id: number;
  name: string | null;
  number: string;
  avatarId: number;
}

export const RecentContacts = ({
  contacts,
  onContactClick,
}: {
  contacts: Contact[];
  onContactClick: (number: string) => void;
}) => {
  return (
    <div className="w-full bg-[#0F172A] border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white tracking-wide mb-6">
        Recent Contacts
      </h3>

      {contacts.length === 0 ? (
        <div className="text-slate-500 text-sm text-center py-4">
          No recent contacts
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {contacts.slice(0, 12).map((contact) => (
            <div
              key={contact.id}
              onClick={() => onContactClick(contact.number)}
              className="flex flex-col items-center justify-start gap-2 group cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-gray-700 group-hover:ring-2 group-hover:ring-[#575DFF] transition-all">
                <img
                  src={`/avatars/${contact.avatarId}.png`}
                  alt={contact.name || contact.number}
                  className="w-full h-full rounded-full object-cover"
                  draggable={false}
                />
              </div>

              {/* Name / Number */}
              <div className="text-[11px] text-slate-400 group-hover:text-white transition-colors font-medium text-center leading-tight w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {contact.name ? contact.name.split(" ")[0] : contact.number}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
