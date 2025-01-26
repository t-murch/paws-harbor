import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Signup } from "../../components/ux/Signup";

const mockSignupAction = vi.fn();

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return {
    ...actual,
    __esModule: true,
    useFormState: vi.fn(() => [{}, mockSignupAction]),
  };
});

describe("Signup Page", () => {
  render(<Signup signupAction={mockSignupAction} />);

  test("renders signup form", () => {
    expect(screen.getByTestId("Email")).toBeDefined();
    expect(screen.getByTestId("Password")).toBeDefined();
    expect(screen.getByTestId("Confirm")).toBeDefined();
  });

  test("validates email format", async () => {
    setFormValues("test", "Pawsw0rdw00f", "Pawsw0rdw00f");
    fireEvent.submit(screen.getByTestId("submitBtn"));

    expect(mockSignupAction).not.toHaveBeenCalled();
  });

  test("validates password length", async () => {
    setFormValues("myemail@mydomain.com", "short", "short");

    fireEvent.submit(screen.getByTestId("submitBtn"));

    expect(mockSignupAction).not.toHaveBeenCalled();
  });

  test("validates passwords match", async () => {
    setFormValues("someemail@address.com", "Password123!", "differentSh0rt");

    fireEvent.submit(screen.getByTestId("submitBtn"));

    expect(mockSignupAction).not.toHaveBeenCalled();
  });

  test("submits form when validation succeeds", async () => {
    const testEmail = "someemail@address.com",
      testPassword = "Password123!";
    setFormValues(testEmail, testPassword, testPassword);

    fireEvent.submit(screen.getByTestId("submitBtn"));

    await waitFor(() => {
      expect(mockSignupAction).toHaveBeenCalled();
    });
  });
});

function setFormValues(email: string, password: string, confirm: string) {
  const emailInput = screen.getByTestId("Email");
  fireEvent.input(emailInput, {
    target: {
      value: email,
    },
  });

  const passwordInput = screen.getByTestId("Password");
  fireEvent.input(passwordInput, {
    target: {
      value: password,
    },
  });

  const confirmInput = screen.getByTestId("Confirm");
  fireEvent.input(confirmInput, {
    target: {
      value: confirm,
    },
  });
}
