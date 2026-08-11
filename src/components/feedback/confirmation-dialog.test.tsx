// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ConfirmationDialog } from "./confirmation-dialog";

describe("ConfirmationDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("abre o diálogo pelo gatilho", async () => {
    const user = userEvent.setup();

    renderDialog();

    await user.click(
      screen.getByRole("button", {
        name: "Arquivar",
      }),
    );

    expect(screen.getByRole("dialog")).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        name: "Arquivar orçamento",
      }),
    ).toBeTruthy();
  });

  it("fecha o diálogo ao cancelar", async () => {
    const user = userEvent.setup();

    renderDialog();

    await user.click(
      screen.getByRole("button", {
        name: "Arquivar",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("executa confirmação e fecha o diálogo", async () => {
    const user = userEvent.setup();

    const onConfirm = vi.fn().mockResolvedValue(undefined);

    renderDialog(onConfirm);

    await user.click(
      screen.getByRole("button", {
        name: "Arquivar",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirmar",
      }),
    );

    expect(onConfirm).toHaveBeenCalledOnce();

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

function renderDialog(onConfirm = vi.fn().mockResolvedValue(undefined)) {
  render(
    <ConfirmationDialog
      trigger={<button type="button">Arquivar</button>}
      title="Arquivar orçamento"
      description="Essa ação poderá ser revertida."
      onConfirm={onConfirm}
    />,
  );
}
