import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ISelect, selectConfigDefault } from './Select.model';
import Validator from '../validator/Validator';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

interface IProps {
  name?: string;
  config?: Partial<ISelect>;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string | null | undefined;
  touched?: boolean;
  className?: string;
  filter?: boolean;
}

const Select = forwardRef<HTMLDivElement, IProps>(({ name, value, onChange, error, config, className, filter = false }, ref) => {
  const location = useLocation();
  const currentPath = location.pathname === '/' ? 'dashboard' : location.pathname.replace(/^\//, '');
  const { t } = useTranslation(currentPath);

  const selectConfig = useMemo(() => ({ ...selectConfigDefault(), ...config }), [config]);

  const { dictData = [], placeholder, disabled, defaultValue, size } = selectConfig || {};

  const handleChange = (e: DropdownChangeEvent) => {
    onChange?.(e.value);
  };

  const sizeClasses = {
    xs: 'small',
    sm: 'medium',
    lg: 'large',
  };

  const selectClasses = classNames('select-component', className, sizeClasses[size || 'sm'], {
    invalid: error && !disabled,
    'cursor-not-allowed bg-disabled': disabled,
  });

  return (
    <div className="d-block">
      <div className="d-flex flex-column" ref={ref}>
        <Dropdown
          className={selectClasses}
          id={name ?? ''}
          name={name ?? ''}
          value={value ?? defaultValue}
          onChange={handleChange}
          options={dictData ?? []}
          optionLabel={'displayName'}
          optionValue="id"
          placeholder={placeholder ? t(placeholder as string) : ''}
          panelClassName={classNames('select-component-panel', sizeClasses[size || 'sm'])}
          disabled={disabled}
          filter={filter}
        />
      </div>

      {error && <Validator error={error} />}
    </div>
  );
});

export default Select;
