"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props<T extends Record<string, string | number>> {
  params: T;
  children: (props: T) => React.ReactNode;
}

export function ComponentParams<T extends Record<string, string | number>>(props: Props<T>) {
  const { params, children } = props;
  const [values, setValues] = useState<T>(params);

  return (
    <div className="flex flex-col gap-4 grow w-full">
      <div className="flex flex-col gap-2 border border-dashed border-border rounded-lg p-4">
        <h4 className="text-sm font-medium">Parameters</h4>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(params).map(([name]) => (
            <div key={name} className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{name}</Label>
              <Input
                type="text"
                value={values[name]}
                onChange={(e) => setValues({ ...values, [name]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="grow flex items-center justify-center">
        {Object.values(values).some((value) => !value || value.toString().trim() === "") ? (
          <div className="text-muted-foreground text-center py-8 text-sm">
            Please provide all parameters
          </div>
        ) : (
          children(values)
        )}
      </div>
    </div>
  );
}
