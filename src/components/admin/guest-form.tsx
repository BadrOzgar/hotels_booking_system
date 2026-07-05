"use client";

import { useDrawerForm } from "@/hooks/use-drawer-form";

type GuestFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

export function GuestForm({
  action,
  initial,
  submitLabel,
  onSuccess,
  onCancel,
}: {
  action: (formData: FormData) => Promise<string | undefined>;
  initial?: GuestFormValues;
  submitLabel: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { error, pending, submit } = useDrawerForm(action, onSuccess);

  return (
    <form action={submit}>
      <div className="grid grid-cols-2 gap-[14px]">
        <Field label="First name" name="firstName" defaultValue={initial?.firstName} />
        <Field label="Last name" name="lastName" defaultValue={initial?.lastName} />
      </div>
      <div className="mt-[14px]">
        <Field label="Email" name="email" type="email" defaultValue={initial?.email} />
      </div>
      <div className="mt-[14px]">
        <Field label="Phone" name="phone" required={false} defaultValue={initial?.phone} />
      </div>
      <div className="mt-[14px]">
        <label className="text-[13px] font-semibold text-[#374151]">
          Notes <span className="font-medium text-[#9CA3AF]">(optional)</span>
        </label>
        <textarea
          name="notes"
          defaultValue={initial?.notes}
          className="mt-2 min-h-[80px] w-full resize-none rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3 text-[15px] outline-none"
        />
      </div>

      {error && <p className="mt-4 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}

      <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="btns rounded-[13px] border border-[#E7E8EC] bg-white px-[22px] py-3.5 text-center text-[15px] font-semibold text-[#1F2937]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="btnp flex items-center justify-center gap-2 rounded-[13px] px-[26px] py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? undefined}
        required={required}
        className="mt-2 w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
      />
    </div>
  );
}
