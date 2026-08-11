import type { ReactNode } from "react";

import { SectionHeader } from "./section-header";

type ResourceSectionProps = {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function ResourceSection({
  title,
  description,
  meta,
  actions,
  children,
}: ResourceSectionProps) {
  return (
    <section className="space-y-4">
      <SectionHeader title={title} description={description} meta={meta} actions={actions} />

      {children}
    </section>
  );
}
