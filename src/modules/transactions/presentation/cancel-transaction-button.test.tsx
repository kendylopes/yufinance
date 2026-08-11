// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { cancelTransactionActionMock } = vi.hoisted(() => ({
  cancelTransactionActionMock: vi.fn(),
}));

vi.mock("./cancel-transaction.actions", () => ({
  cancelTransactionAction: cancelTransactionActionMock,
}));

import { CancelTransactionButton } from "./cancel-transaction-button";

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const transactionId = "660e8400-e29b-41d4-a716-446655440000";

describe("CancelTransactionButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("não cancela quando a confirmação é recusada", async () => {
    const user = userEvent.setup();

    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<CancelTransactionButton workspaceId={workspaceId} transactionId={transactionId} />);

    await user.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(window.confirm).toHaveBeenCalledWith("Deseja realmente cancelar esta transação?");

    expect(cancelTransactionActionMock).not.toHaveBeenCalled();
  });

  it("envia workspace e transação para cancelamento", async () => {
    const user = userEvent.setup();

    cancelTransactionActionMock.mockResolvedValue({
      success: true,
    });

    render(<CancelTransactionButton workspaceId={workspaceId} transactionId={transactionId} />);

    await user.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(cancelTransactionActionMock).toHaveBeenCalledTimes(1);

    expect(cancelTransactionActionMock).toHaveBeenCalledWith({
      workspaceId,
      transactionId,
    });
  });

  it("exibe mensagem quando o cancelamento falha", async () => {
    const user = userEvent.setup();

    cancelTransactionActionMock.mockResolvedValue({
      success: false,
      message: "Não foi possível cancelar a transação.",
    });

    render(<CancelTransactionButton workspaceId={workspaceId} transactionId={transactionId} />);

    await user.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toBe("Não foi possível cancelar a transação.");
  });

  it("exibe estado de carregamento durante o cancelamento", async () => {
    const user = userEvent.setup();

    let resolveAction: ((value: { success: true }) => void) | undefined;

    cancelTransactionActionMock.mockImplementation(
      () =>
        new Promise<{ success: true }>((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(<CancelTransactionButton workspaceId={workspaceId} transactionId={transactionId} />);

    await user.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    const pendingButton = screen.getByRole("button", {
      name: "Cancelando...",
    });

    expect((pendingButton as HTMLButtonElement).disabled).toBe(true);

    resolveAction?.({
      success: true,
    });

    expect(
      await screen.findByRole("button", {
        name: "Cancelar",
      }),
    ).toBeTruthy();
  });
});
