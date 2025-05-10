import { Link } from 'react-router-dom';
import { IAuthPath } from './auth.enum';

const { PATH_LOGIN, PATH_SIGNUP } = IAuthPath;

const LoginFooter = ({ path, error, isUserCreated }: { path?: string; error?: string; isUserCreated?: boolean }) => {
  const footerTextClassName = 'mb-3';
  const renderFooter = () => {
    switch (path) {
      case PATH_LOGIN:
        return (
          <>
            {isUserCreated && <p className={footerTextClassName}>Account created, now logIn</p>}
            <p className={footerTextClassName}>
              Need an account? <Link to="/signup">Sign Up</Link>
            </p>
          </>
        );
      case PATH_SIGNUP:
        return (
          <p className={footerTextClassName}>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="d-block">
      {renderFooter()} {error && <p>{error}</p>}
    </div>
  );
};

export default LoginFooter;
