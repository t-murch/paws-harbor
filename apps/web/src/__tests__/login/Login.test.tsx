import LoginPage from "@/app/login/page";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

const mockLoginAction = vi.fn();
vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return {
    ...actual,
    __esModule: true,
    useFormState: vi.fn(() => [{}, mockLoginAction]),
  };
});

describe("Login Page", () => {
  test("renders login and signup tabs", async () => {
    render(await LoginPage());
    expect(screen.getByTestId("Login")).toBeDefined();
    expect(screen.getByText("Sign Up")).toBeDefined();
  });

  test("validates email format", async () => {
    setFormValues("test", "Pawsw0rdw00f");
    fireEvent.submit(screen.getByTestId("submitBtn"));

    expect(mockLoginAction).not.toHaveBeenCalled();
  });

  test("validates password length", async () => {
    setFormValues("myemail@mydomain.com", "short");

    fireEvent.submit(screen.getByTestId("submitBtn"));

    expect(mockLoginAction).not.toHaveBeenCalled();
  });

  test("submits form when validation succeeds", async () => {
    const testEmail = "someemail@address.com",
      testPassword = "Password123!";
    setFormValues(testEmail, testPassword);

    fireEvent.submit(screen.getByTestId("submitBtn"));

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalled();
    });
  });
});

function setFormValues(email: string, password: string) {
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
}
