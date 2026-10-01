"use client";

import { useRef, useState } from "react";
import type { MockApiResult, SubmitStatus } from "@/types";

interface SubmitState {
  status: SubmitStatus;
  response: MockApiResult | null;
}

/** Shared idle → submitting → success | error state machine for the mock forms. */
export function useSubmitStatus() {
  const [state, setState] = useState<SubmitState>({ status: "idle", response: null });
  const inFlight = useRef(false);

  async function submit(request: () => Promise<MockApiResult>) {
    if (inFlight.current) return;
    inFlight.current = true;
    setState((previous) => ({ status: "submitting", response: previous.response }));
    try {
      const response = await request();
      setState({ status: response.success ? "success" : "error", response });
    } finally {
      inFlight.current = false;
    }
  }

  return { status: state.status, response: state.response, submit };
}
