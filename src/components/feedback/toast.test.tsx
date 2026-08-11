// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ToastProvider, useToast } from "./toast";

describe("Toast", () => {
  afterEach(() => {
    cleanup();
  });

  it("exibe notificação", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Mostrar sucesso",
      }),
    );

    expect(await screen.findByText("Orçamento criado")).toBeTruthy();

    expect(screen.getByText("Os dados foram salvos.")).toBeTruthy();
  });

  it("permite fechar notificação", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastTestComponent />
      </ToastProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Mostrar sucesso",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Fechar notificação",
      }),
    );

    expect(screen.queryByText("Orçamento criado")).toBeNull();
  });
});

function ToastTestComponent() {
  const { showToast } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        showToast({
          title: "Orçamento criado",
          description: "Os dados foram salvos.",
          variant: "success",
        })
      }
    >
      Mostrar sucesso
    </button>
  );
}
