// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LoadingState } from "./loading-state";

describe("LoadingState", () => {
  afterEach(() => {
    cleanup();
  });

  it("exibe texto padrão", () => {
    render(<LoadingState />);

    expect(screen.getByText("Carregando...")).toBeTruthy();
  });

  it("aceita texto personalizado", () => {
    render(<LoadingState label="Carregando orçamentos..." />);

    expect(screen.getByText("Carregando orçamentos...")).toBeTruthy();
  });
});
