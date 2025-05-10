import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from '@/core/auth/AuthProvider';
import PrivateRoute from '@/core/auth/PrivateRoute';
import * as authHelper from '@/core/auth/auth-helper';

jest.mock('@/core/auth/auth-helper');

describe('Auth flow integration', () => {
  const renderWithRouter = (initialPath: string) =>
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<div>SECURE PAGE</div>} />
            </Route>
            <Route path="/login" element={<div>LOGIN PAGE</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

  it('redirects to /login if not authenticated', () => {
    (authHelper.cookiesAuth as jest.Mock).mockReturnValue({});

    renderWithRouter('/dashboard');

    expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument();
  });

  it('renders protected page if authenticated', () => {
    (authHelper.cookiesAuth as jest.Mock).mockReturnValue({ accessToken: 'token123' });

    renderWithRouter('/dashboard');

    expect(screen.getByText('SECURE PAGE')).toBeInTheDocument();
  });
});
