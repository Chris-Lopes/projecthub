"use client";

import React, { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebsiteEmbedProps {
  url: string;
  title?: string;
  height?: string | number;
  className?: string;
}

const WebsiteEmbed: React.FC<WebsiteEmbedProps> = ({
  url,
  title = "Project Preview",
  height = "500px",
  className = "",
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullHeight, setIsFullHeight] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(
      "This website cannot be embedded. It may have restricted iframe embedding."
    );
  };

  const refreshEmbed = () => {
    setLoading(true);
    setError(null);
    // Force iframe refresh by recreating it
    const iframe = document.getElementById(
      "project-embed"
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = url;
    }
  };

  const toggleHeight = () => {
    setIsFullHeight(!isFullHeight);
  };

  const currentHeight = isFullHeight ? "70vh" : height;

  return (
    <div className={`website-embed-container w-full ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Live Preview</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-slate-800 border-slate-700 hover:bg-slate-700"
            onClick={refreshEmbed}
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-300" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-slate-800 border-slate-700 hover:bg-slate-700"
            onClick={toggleHeight}
            title={isFullHeight ? "Reduce height" : "Expand height"}
          >
            {isFullHeight ? (
              <Minimize2 className="h-3.5 w-3.5 text-slate-300" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5 text-slate-300" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-slate-800 border-slate-700 hover:bg-slate-700"
            onClick={() => window.open(url, "_blank")}
            title="Open in new tab"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-300" />
          </Button>
        </div>
      </div>

      <div
        className="relative w-full rounded-lg overflow-hidden border border-slate-700/50 bg-slate-800/50"
        style={{ height: currentHeight }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/70 z-10">
            <Spinner className="h-8 w-8 text-teal-500" />
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Alert
              variant="destructive"
              className="bg-red-950/30 border-red-800/50 text-red-200"
            >
              <AlertDescription className="flex flex-col gap-3">
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-950/50 border-red-800/70 text-red-200 hover:bg-red-900/30 w-fit"
                  onClick={() => window.open(url, "_blank")}
                >
                  Open website in new tab
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <iframe
            id="project-embed"
            src={url}
            title={title}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleLoad}
            onError={handleError}
            className="bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Source:{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-400 hover:underline"
        >
          {url}
        </a>
      </p>
    </div>
  );
};

export default WebsiteEmbed;
