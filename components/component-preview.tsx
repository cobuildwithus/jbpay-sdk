"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props<T extends Record<string, string | number> = Record<string, never>> {
  name: string;
  usage: string;
  params?: T;
  children: T extends Record<string, never> ? React.ReactNode : (props: T) => React.ReactNode;
  registryUrl: string;
}

export function ComponentPreview<T extends Record<string, string | number> = Record<string, never>>(
  props: Props<T>
) {
  const { name, usage, params, children, registryUrl } = props;
  const [values, setValues] = useState<T | undefined>(params);

  const renderContent = () => {
    if (params && values) {
      const allValuesProvided = Object.values(values).every(
        (value) => value !== undefined && value !== null && value.toString().trim() !== ""
      );

      if (!allValuesProvided) {
        return (
          <div className="text-muted-foreground text-center py-8 text-sm">
            Please provide all parameters
          </div>
        );
      }

      return (children as (props: T) => React.ReactNode)(values);
    }

    return children as React.ReactNode;
  };

  return (
    <div className="flex flex-col gap-4 border-2 border-dashed border-border rounded-lg p-4 relative">
      <div className="flex items-center justify-between sm:p-3">
        <h2 className="text-sm text-muted-foreground">&lt;{usage} /&gt;</h2>
        <CopyButton content={`pnpm dlx shadcn@latest add ${registryUrl}/${name}.json`} />
      </div>

      {params && values && (
        <div className="flex flex-col gap-2 border border-dashed border-border rounded-lg p-4">
          <h4 className="text-sm font-medium">Parameters</h4>
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(params).map(([paramName]) => (
              <div key={paramName} className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">{paramName}</Label>
                <Input
                  type="text"
                  value={values[paramName as keyof T]}
                  onChange={(e) => setValues({ ...values, [paramName]: e.target.value } as T)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col w-full grow items-center justify-center min-h-[360px] relative sm:p-3">
        {renderContent()}
      </div>
    </div>
  );
}
