import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/**
 * VAPI recordings are no longer publicly downloadable — the URL must be
 * fetched fresh (server-side, with our VAPI key) each time it's needed,
 * since it resolves to a short-lived signed link.
 */
export function useCallRecordingUrl(callId: string | undefined) {
  const token = useAppSelector((state) => state.auth?.token);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRecordingUrl(null);

    if (!callId || !token) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const response = await fetch(
          `${SERVER_URL}/calls/${encodeURIComponent(callId)}/recording-url`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { url?: string };
        if (!cancelled && data.url) {
          setRecordingUrl(data.url);
        }
      } catch {
        // No recording available or request failed — leave recordingUrl null.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [callId, token]);

  return { recordingUrl, isLoading };
}
