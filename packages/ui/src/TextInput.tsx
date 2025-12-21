"use client";

export const TextInput = ({
  placeholder,
  onChange,
  label,
  value
}: {
  placeholder: string;
  onChange: (value: string) => void;
  label: string;
  value?: string; // (Optional) Good to have for controlled inputs
}) => {
  return (
    <div className="pt-2">
      <label className="block text-xs font-medium text-slate-400 mb-2 pl-1">
        {label}
      </label>
      <input
        value={value} // Pass value if provided
        onChange={(e) => onChange(e.target.value)}
        type="text"
        className="bg-[#0F172A] border border-gray-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
      />
    </div>
  );
};