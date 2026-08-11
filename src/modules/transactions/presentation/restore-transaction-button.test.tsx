// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { restoreTransactionActionMock } = vi.hoisted(() => ({
  restoreTransactionActionMock: vi.fn(),
}));

vi.mock("./restore-transaction.actions", () => ({
  restoreTransactionAction: restoreTransactionActionMock,
}));

import { RestoreTransactionButton } from "./restore-transaction-button";

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const transactionId = "660e8400-e29b-41d4-a716-446655440000";

describe("RestoreTransactionButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("não restaura quando a confirmação é recusada", async () => {
    const user = userEvent.setup();

    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<RestoreTransactionButton workspaceId={workspaceId} transactionId={transactionId} />);

    await user.click(
      screen.getByRole("button", {
        name: "Restaurar",
      }),
    );

    expect(window.confirm).toHaveBeenCalledWith("Deseja realmente restaurar esta transação?");

    expect(restoreTransactionActionMock).not.toHaveBeenCalled();
  });

  it("envia workspace e transação para restauração", async () => {
    const user = userEvent.setup();

    restoreTransactionActionMock.mockResolvedValue({
      success: true,
    });

    render(<RestoreTransactionButton workspaceId={workspaceId} transactionId={transactionId} />);

    await user.click(
      screen.getByRole("button", {
        name: "Restaurar",
      }),
    );

    expect(restoreTransactionActionMock).toHaveBeenCalledTimes(1);

    expect(restoreTransactionActionMock).toHaveBeenCalledWith({
      workspaceId,
      transactionId,
    });
  });

  it("exibe mensagem quando a restauração falha", async () => {
    const user = userEvent.setup();

    restoreTransactionActionMock.mockResolvedValue({
      success: false,
      message: "Não foi possível restaurar a transação.",
    });

    render(<RestoreTransactionButton workspaceId={workspaceId} transactionId={transactionId} />);

    await user.click(
      screen.getByRole("button", {
        name: "Restaurar",
      }),
    );

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toBe("Não foi possível restaurar a transação.");
  });

  it("exibe estado de carregamento durante a restauração", async () => {
    const user = userEvent.setup();

    let resolveAction: ((value: { success: true }) => void) | undefined;

    restoreTransactionActionMock.mockImplementation(
      () =>
        new Promise<{ success: true }>((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(<RestoreTransactionButton workspaceId={workspaceId} transactionId={transactionId} />);

    await user.click(
      screen.getByRole("button", {
        name: "Restaurar",
      }),
    );

    const pendingButton = screen.getByRole("button", {
      name: "Restaurando...",
    });

    expect((pendingButton as HTMLButtonElement).disabled).toBe(true);

    resolveAction?.({
      success: true,
    });

    expect(
      await screen.findByRole("button", {
        name: "Restaurar",
      }),
    ).toBeTruthy();
  });
});
