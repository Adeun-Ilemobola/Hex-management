import React from "react";
import Loading from "./Loading";

interface DropBackProps {
  is: boolean;
  children: React.ReactNode;
  isTextMessage?: {
    data: string | React.ReactNode;
    show?: boolean;
  };
}

export default function DropBack({ is, children, isTextMessage }: DropBackProps) {
  const shouldShowLoading = is || isTextMessage?.show;
  const loadingText = isTextMessage?.show ? isTextMessage.data : undefined;

  return (
    <div className="relative w-full h-full">
      {/* The actual page content */}
      <div className={shouldShowLoading ? "pointer-events-none opacity-50 select-none" : ""}>
        {children}
      </div>

      {/* The Loader Overlay */}
      {shouldShowLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          {/* We turn off 'full' here because the parent div controls the size now */}
          <Loading text={loadingText} />
        </div>
      )}
    </div>
  );
}