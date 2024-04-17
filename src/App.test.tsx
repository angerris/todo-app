/* eslint-disable testing-library/no-node-access */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import "./setupDomTests";

test("adding a new todo", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/don't be shy, add some tasks!/i);
  const addButton = screen.getByRole("button", { name: /add/i });
  fireEvent.change(input, { target: { value: "Test new todo" } });
  fireEvent.click(addButton);
  expect(screen.getByText("Test new todo")).toBeInTheDocument();
});

test("deleting a todo", () => {
  render(<App />);
  const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
  fireEvent.click(deleteButton);
  expect(screen.queryByText("Todo text to delete")).not.toBeInTheDocument();
});

test("todo can be marked as done", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/don't be shy, add some tasks!/i);
  const addButton = screen.getByRole("button", { name: /add/i });
  fireEvent.change(input, { target: { value: "Test new todo" } });
  fireEvent.click(addButton);
  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  fireEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});

test("editing a todo", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/don't be shy, add some tasks!/i);
  const addButton = screen.getByRole("button", { name: /add/i });
  fireEvent.change(input, { target: { value: "current" } });
  fireEvent.click(addButton);
  const editButton = screen.getAllByRole("button", { name: /edit/i })[0];
  fireEvent.click(editButton);
  const editInput: any = screen.getByDisplayValue("current");
  fireEvent.change(editInput, { target: { value: "updated" } });
  const ok = screen.getByRole("button", { name: /ok/i });
  fireEvent.click(ok);
  expect(screen.queryByText("current")).not.toBeInTheDocument();
});
