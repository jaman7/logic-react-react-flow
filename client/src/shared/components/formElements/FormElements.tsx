import { useMemo } from 'react';
import { IFormElements, IFormElementsEnum } from './FormElements.model';
import { Controller, useFormContext } from 'react-hook-form';
import Input from '../input/Input';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import Select from '../select/Select';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

interface IProps {
  formControlName: string;
  config?: IFormElements;
}

const { SELECT, TEXT, NUMBER, PASSWORD, SEARCH, RANGE, TEXT_VALUE } = IFormElementsEnum;

const FormElements = ({ formControlName, config }: IProps) => {
  const location = useLocation();
  const currentPath = location.pathname === '/' ? 'dashboard' : location.pathname.replace(/^\//, '');

  const { t } = useFallbackTranslation(currentPath);

  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { formCellType, styleClass, valueStyleClass, header, size, isNoHeader = false } = config || {};

  const elementMap = useMemo(
    () => ({
      [TEXT]: Input,
      [NUMBER]: Input,
      [PASSWORD]: Input,
      [SEARCH]: Input,
      [RANGE]: Input,
      [SELECT]: Select,
      [TEXT_VALUE]: ({ value }: { value?: string | number }) => <p className={classNames('form-value', valueStyleClass ?? '')}>{value}</p>,
    }),
    []
  );

  const Element = elementMap[formCellType as keyof typeof elementMap];

  const containerClass = classNames('d-block', styleClass);

  const headerClass = classNames('text-secondary', 'white-space-pre', {
    'text-xs': size === 'xs',
    'text-sm': size === 'sm',
    'text-base': size === 'lg',
  });

  return (
    <div className={containerClass}>
      {header && !isNoHeader && (
        <label className={headerClass} htmlFor={formControlName}>
          {t(header)}
        </label>
      )}
      {Element && (
        <Controller
          name={formControlName}
          control={control}
          render={({ field }) => {
            if (formCellType === TEXT_VALUE) {
              return <Element value={field.value} />;
            }

            return <Element {...field} config={config as Partial<IFormElements>} error={errors[formControlName]?.message as string} />;
          }}
        />
      )}
    </div>
  );
};

export default FormElements;
