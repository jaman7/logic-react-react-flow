import { render, screen } from '@testing-library/react';
import PrivateRoute from '../PrivateRoute';
import * as authHelper from '../auth-helper';

jest.mock('react-router-dom', () => ({
  Outlet: () => <div>PROTECTED CONTENT</div>,
  Navigate: ({ to }: { to: string }) => <div>REDIRECTED TO {to}</div>,
}));

describe('PrivateRoute.test', () => {
  it('renders outlet when accessToken exists', () => {
    jest.spyOn(authHelper, 'cookiesAuth').mockReturnValue({ accessToken: 'token' });

    render(<PrivateRoute />);

    expect(screen.getByText('PROTECTED CONTENT')).toBeInTheDocument();
  });

  it('redirects to login when no accessToken', () => {
    jest.spyOn(authHelper, 'cookiesAuth').mockReturnValue({});

    render(<PrivateRoute />);

    expect(screen.getByText('REDIRECTED TO /login')).toBeInTheDocument();
  });
});
