import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders login screen when not authenticated', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/Net ID/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});

test('signup then login flow stores user and shows welcome', async () => {
  render(<App />);
  const usernameInput = screen.getByPlaceholderText(/Net ID/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const signUpButton = screen.getByText(/Sign Up/i);
  const loginButton = screen.getByText(/Login/i);

  await userEvent.type(usernameInput, 'testuser');
  await userEvent.type(passwordInput, 'testpass');
  userEvent.click(signUpButton);

  // now login
  await userEvent.clear(usernameInput);
  await userEvent.clear(passwordInput);
  await userEvent.type(usernameInput, 'testuser');
  await userEvent.type(passwordInput, 'testpass');
  userEvent.click(loginButton);

  expect(await screen.findByText(/Welcome, testuser/i)).toBeInTheDocument();
});
