// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TextField } from "./text-field";

describe("TextField", () => {
  afterEach(() => {
    cleanup();
  });

  it("associa o label ao campo", () => {
    render(<TextField label="Nome" />);

    expect(
      screen.getByRole("textbox", {
        name: "Nome",
      }),
    ).toBeTruthy();
  });

  it("exibe erro", () => {
    render(<TextField label="Nome" error="Nome obrigatório." />);

    expect(screen.getByRole("alert")).toBeTruthy();

    expect(screen.getByText("Nome obrigatório.")).toBeTruthy();
  });

  it("encaminha eventos do input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TextField label="Nome" onChange={onChange} />);

    await user.type(
      screen.getByRole("textbox", {
        name: "Nome",
      }),
      "Mercado",
    );

    expect(onChange).toHaveBeenCalled();
  });
});
