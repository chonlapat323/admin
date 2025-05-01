import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export function handleHttpError<T extends FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>
): void {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { status?: number; message?: string };

    if (maybeError.status === 409) {
      const message = maybeError.message || "Conflict detected.";
      debugger;
      if (setError) {
        if (message.includes("name")) {
          setError("name" as Path<T>, { type: "manual", message: "This name is already in use." });
        } else if (message.includes("link")) {
          setError("link" as Path<T>, { type: "manual", message: "This link is already in use." });
        }
      }

      return;
    }
  }

  console.error("Unhandled HTTP Error", error);
  throw new Error("Unexpected error occurred.");
}
