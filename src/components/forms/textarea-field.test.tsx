// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { TextareaField } from "./textarea-field";

describe("TextareaField", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza campo acessível", () => {
    render(<TextareaField label="Observações" />);

    expect(
      screen.getByRole("textbox", {
        name: "Observações",
      }),
    ).toBeTruthy();
  });

  it("permite inserir conteúdo", async () => {
    const user = userEvent.setup();

    render(<TextareaField label="Observações" />);

    const textarea = screen.getByRole("textbox", {
      name: "Observações",
    }) as HTMLTextAreaElement;

    await user.type(textarea, "Pagamento mensal");

    expect(textarea.value).toBe("Pagamento mensal");
  });
});
