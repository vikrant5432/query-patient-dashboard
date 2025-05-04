import { SuccessModalProps } from "./interface";

export function SuccessRegisterModal({
  show,
  onClose,
  username,
}: SuccessModalProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
        <p className="mb-6">
          Thanks for registering with us,{" "}
          <span className="font-semibold">{username}</span>.<br />
          Please login to continue.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
