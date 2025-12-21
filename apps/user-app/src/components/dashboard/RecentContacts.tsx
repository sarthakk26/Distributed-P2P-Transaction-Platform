"use client";

interface Contact {
  id: number;
  name: string | null;
  number: string;
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
        // Grid: Strictly 4 columns
        <div className="grid grid-cols-4 gap-4">
          {/* CHANGED: Slice(0, 12) allows 3 rows of 4 (Total 12) */}
          {contacts.slice(0, 12).map((contact) => (
            <div
              key={contact.id}
              onClick={()=>onContactClick(contact.number)}
              className="flex flex-col items-center justify-start gap-2 group cursor-pointer"
            >
              {/* Avatar Circle */}
              <div className="w-12 h-12 bg-[#1e293b] group-hover:bg-[#575DFF] border border-gray-700 transition-all rounded-full flex items-center justify-center text-blue-400 group-hover:text-white font-bold text-sm">
                {(
                  contact.name?.slice(0, 1) || contact.number.slice(0, 1)
                ).toUpperCase()}
              </div>

              {/* Name/Number */}
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
