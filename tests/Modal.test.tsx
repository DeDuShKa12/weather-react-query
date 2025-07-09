import { render, screen, fireEvent } from "@testing-library/react";

import { Modal } from "../src/components/Modal";

describe("Modal", () => {
  it("renders children and calls onClose on backdrop click and close button", () => {
    const onClose = jest.fn();

    render(
      <Modal onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));

    expect(onClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByTestId("modal-backdrop");
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("does NOT call onClose when clicking inside modal content", () => {
    const onClose = jest.fn();

    render(
      <Modal onClose={onClose}>
        <div data-testid="content">Modal Content</div>
      </Modal>
    );

    const content = screen.getByTestId("content");
    fireEvent.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });
});
