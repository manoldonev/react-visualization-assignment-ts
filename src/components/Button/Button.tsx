const Button = ({
  children,
  className = '',
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}): JSX.Element => {
  return (
    <button
      type="button"
      className={`h-12 w-24 rounded bg-blue-500 px-4 py-2 text-sm font-medium uppercase text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { Button };
