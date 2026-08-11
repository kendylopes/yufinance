type FormErrorProps = {
  message?: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm" role="alert">
      {message}
    </p>
  );
}

type FormSuccessProps = {
  message?: string | null;
};

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) {
    return null;
  }

  return <output className="text-sm">{message}</output>;
}
