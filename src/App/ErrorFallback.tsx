const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}): JSX.Element => {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center p-3">
      <div role="alert">
        <div className="rounded-t bg-red-700 px-4 py-2 font-bold text-white">Oops!</div>
        <div className="flex flex-col rounded-b border border-t-0 border-red-700 bg-red-50 px-4 py-3 text-red-900">
          <h2>Something went wrong:</h2>
          <pre className="whitespace-pre-wrap break-all">{error.message}</pre>
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="mx-auto mt-5 h-12 w-24 whitespace-nowrap rounded-lg border border-red-700 bg-white px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-700/25"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
};

export { ErrorFallback };
