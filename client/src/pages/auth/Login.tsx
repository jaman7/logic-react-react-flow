import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAuthPath } from './auth.enum';
import { defaultConfig, defaultValues, loginConfig, loginValues } from './form.config';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import LoginFooter from './LoginFooter';
import { useTranslation } from 'react-i18next';
import { createConfigForm } from '@/shared/utils/form-config';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import { useAuth } from '@/core/auth/userAuth';
import { IFormElements, IFormElementsConfig } from '@/shared/components/formElements/FormElements.model';
import FormElements from '@/shared/components/formElements/FormElements';
import { useGlobalStore } from '@/store/useGlobalStore';

const { PATH_LOGIN, PATH_LOGOUT, PATH_SIGNUP } = IAuthPath;

export interface IFormPanelValues {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface IProps {
  path?: string;
}

const getSchema = (path?: string) => {
  const base = {
    email: yup.string().email().required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,99}$/,
        'Must contain at least 8 Characters, 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number'
      ),
  };

  if (path === PATH_SIGNUP) {
    return yup.object({
      ...base,
      name: yup.string().required('Name is required'),
      passwordConfirm: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    });
  }

  return yup.object(base);
};

const Login: React.FC<IProps> = ({ path }) => {
  const [formConfig, setFormConfig] = useState<IFormElements[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [butonNameSubmit, setButonNameSubmit] = useState('');
  const { t } = useTranslation();
  const { login, logout, signup } = useAuth() || {};
  const navigate = useNavigate();
  const { clearStore } = useGlobalStore();

  const methods = useForm({
    resolver: yupResolver(getSchema(path)),
    mode: 'onChange',
    defaultValues: path === PATH_SIGNUP ? defaultValues() : loginValues(),
  });

  const { getValues, formState } = methods;
  const { isValid } = formState;

  const setlogout = async () => {
    logout?.().then(() => {
      clearStore();
      navigate(PATH_LOGIN);
    });
  };

  useEffect(() => {
    let config: IFormElementsConfig = {};
    switch (path) {
      case PATH_LOGOUT:
        setlogout();
        break;
      case PATH_LOGIN:
        config = loginConfig();
        setButonNameSubmit(t('common.auth.buttons.logIn'));
        break;
      case PATH_SIGNUP:
        config = defaultConfig();
        setButonNameSubmit(t('common.auth.buttons.update'));
        break;
      default:
        break;
    }
    setFormConfig(createConfigForm(config, { prefix: 'common.auth' }));
  }, [path]);

  const handleSubmit = async () => {
    const { name, email, password, passwordConfirm } = getValues() ?? {};
    setMessage('');
    setLoading(true);
    try {
      switch (path) {
        case PATH_LOGIN:
          methods.reset(loginValues());
          login?.(email as string, password as string).then(() => navigate('/'));
          setIsUserCreated(false);
          break;
        case PATH_SIGNUP:
          methods.reset(defaultValues());
          signup?.(name as string, email as string, password as string, passwordConfirm as string).then((res) => {
            setIsUserCreated(!!res?.verificationCode);
            navigate(PATH_LOGIN);
          });
          break;
      }
    } catch {
      onError();
    }
    setLoading(false);
  };

  const onError = (): void => {
    switch (path) {
      case PATH_LOGIN:
        setMessage(t('common.auth.errors.failLogon'));
        break;
      case PATH_SIGNUP:
        setMessage(t('common.auth.errors.failCreate'));
        break;
      default:
        break;
    }
  };

  return (
    <FormProvider {...methods}>
      {path !== PATH_LOGOUT ? (
        <div className="d-flex flex-column gap-16 transition">
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="d-flex flex-column gap-16">
            {formConfig?.map((item) => (
              <FormElements key={item.formControlName} formControlName={item?.formControlName as string} config={item.config} />
            ))}

            <div className="d-block">
              <Button disabled={loading || !isValid} type="submit" variant={ButtonVariant.PRIMARY} size="sm">
                {butonNameSubmit}
              </Button>
            </div>
          </form>
          <LoginFooter path={path} error={message} isUserCreated={isUserCreated} />
        </div>
      ) : (
        <></>
      )}
    </FormProvider>
  );
};

export default Login;
