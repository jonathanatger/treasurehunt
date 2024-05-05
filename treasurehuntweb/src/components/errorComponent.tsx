import { useRouter } from "next/router";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }

    return this.props.children;
  }
}

function ErrorScreen() {
  const router = useRouter();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <h2>Something went wrong!</h2>
      <button onClick={() => router.reload()}>Try again</button>
    </div>
  );
}

export default ErrorBoundary;
