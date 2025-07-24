"use client";

import { ComponentPreview } from "@/components/component-preview";
import { ActivityLog } from "@/registry/juicebox/activity-log/activity-log";
import { PayProjectForm } from "@/registry/juicebox/pay-project-form/pay-project-form";

interface Props {
  registryUrl: string;
}

export function ComponentPreviews(props: Props) {
  const { registryUrl } = props;

  return (
    <>
      <ComponentPreview name="pay-project-form" usage="PayProjectForm" registryUrl={registryUrl}>
        <PayProjectForm />
      </ComponentPreview>
      <ComponentPreview
        name="activity-log"
        usage="ActivityLog"
        params={{ chainId: 8453, projectId: 3, perPage: 10 }}
        registryUrl={registryUrl}
      >
        {(props) => <ActivityLog {...props} />}
      </ComponentPreview>
    </>
  );
}
