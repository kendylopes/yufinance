type SubmitButtonProps = {
  isSubmitting: boolean;
  idleLabel: string;
  submittingLabel: string;
};

export function SubmitButton({ isSubmitting, idleLabel, submittingLabel }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-lg border px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? submittingLabel : idleLabel}
    </button>
  );
}
