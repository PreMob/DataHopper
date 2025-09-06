"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { GoogleIcon, RedditIcon, BingIcon } from "@/components/source-icons"

export interface SourcePayload {
  google_results?: any
  bing_results?: any
  reddit_results?: any
}

export function ResearchSources({ payload }: { payload: SourcePayload }) {
  const hasAny = payload.google_results || payload.bing_results || payload.reddit_results
  if (!hasAny) return null

  return (
    <Accordion type="single" collapsible className="mt-3">
      <AccordionItem value="sources">
        <AccordionTrigger className="text-sm">View Raw Source Data</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 overflow-hidden max-w-full">
            {payload.google_results && (
              <div className="w-full overflow-hidden">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <GoogleIcon /> Google Results
                </h4>
                <div className="max-h-60 overflow-auto rounded-md bg-muted p-3 w-full">
                  <pre className="text-xs whitespace-pre-wrap break-all word-break-break-all overflow-wrap-anywhere min-w-0 max-w-full">
                    {JSON.stringify(payload.google_results, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            {payload.bing_results && (
              <div className="w-full overflow-hidden">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <BingIcon /> Bing Results
                </h4>
                <div className="max-h-60 overflow-auto rounded-md bg-muted p-3 w-full">
                  <pre className="text-xs whitespace-pre-wrap break-all word-break-break-all overflow-wrap-anywhere min-w-0 max-w-full">
                    {JSON.stringify(payload.bing_results, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            {payload.reddit_results && (
              <div className="w-full overflow-hidden">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <RedditIcon /> Reddit Results
                </h4>
                <div className="max-h-60 overflow-auto rounded-md bg-muted p-3 w-full">
                  <pre className="text-xs whitespace-pre-wrap break-all word-break-break-all overflow-wrap-anywhere min-w-0 max-w-full">
                    {JSON.stringify(payload.reddit_results, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
