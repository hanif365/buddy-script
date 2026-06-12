type FieldProps = { label: string } & React.InputHTMLAttributes<HTMLInputElement>;

export default function Field({ label, ...props }: FieldProps) {
  return (
    <div className="mb-3.5">
      <label className="mb-2 block text-[16px] font-medium leading-[1.4] text-label">
        {label}
      </label>
      <input
        className="h-12 w-full rounded-md border border-input bg-surface dark:bg-input px-3 text-[14px] text-body transition-colors focus:border-primary focus:outline-none"
        {...props}
      />
    </div>
  );
}
