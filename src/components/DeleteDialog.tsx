import { useEffect, useRef } from "react";
import closeIcon from "../assets/figma-dashboard/75e8d.svg";

type DeleteDialogProps = {
  title: string;
  message: string;
  busy?: boolean;
  error?: string;
  onCancel: () => void;
  onDelete: () => void;
};

export default function DeleteDialog({ title, message, busy = false, error, onCancel, onDelete }: DeleteDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) {
        onCancel();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, onCancel]);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#00000080] p-[20px]">
      <div role="dialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-message" className="w-full max-w-[524px] rounded-[4px] bg-[#FFFFFF] p-[28px] text-[#131523]">
        <div className="flex items-start justify-between gap-[12px]">
          <h2 id="delete-title" className="text-[20px] font-[700] leading-[28px]">
            {title}
          </h2>
          <button type="button" disabled={busy} aria-label="Close" onClick={onCancel}>
            <img src={closeIcon} alt="" />
          </button>
        </div>

        <p id="delete-message" className="mt-[12px] text-[16px] leading-[24px]">
          {message}
        </p>
        {error && (
          <p role="alert" className="mt-[12px] text-[14px] text-[#B42318]">
            {error}
          </p>
        )}

        <div className="mt-[28px] flex justify-end gap-[12px]">
          <button ref={cancelRef} type="button" disabled={busy} onClick={onCancel} className="h-[40px] w-[120px] rounded-[4px] bg-[#2563EB] text-[14px] text-[#FFFFFF]">
            Cancel
          </button>
          <button type="button" disabled={busy} onClick={onDelete} className="h-[40px] w-[120px] rounded-[4px] border border-[#FF3B30] text-[14px] text-[#FF3B30] disabled:opacity-50">
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
