import { useEffect, useState } from "react";
import { useTermsAndConditionsStore } from "../store/termsAndConditionsStore";

export default function TermsAndConditionsModal({ onAccept }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchTermsAndConditions, termsAndConditions, isLoading, error } =
    useTermsAndConditionsStore();

  useEffect(() => {
    const hasAcceptedTerms = sessionStorage.getItem("hasAcceptedTerms");
    if (!hasAcceptedTerms) {
      fetchTermsAndConditions();
      setIsModalOpen(true);
    }
  }, [fetchTermsAndConditions]);

  const handleAccept = () => {
    sessionStorage.setItem("hasAcceptedTerms", "true");
    setIsModalOpen(false);
    onAccept();
  };

  const handleDecline = () => {
    window.location.href = "/";
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-8 w-11/12 max-w-4xl md:max-w-2xl rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Terms & Conditions
        </h2>

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto space-y-6 text-justify pr-4">
            {termsAndConditions.map((term) => (
              <div key={term.no} className="mb-4">
                <p className="font-bold">
                  {term.no}. {term.title}
                </p>
                <p>{term.text}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={handleDecline}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
