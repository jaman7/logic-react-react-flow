import React, { memo, MouseEventHandler, useMemo } from 'react';
import classNames from 'classnames';
import { Tooltip } from 'primereact/tooltip';
import { useLocation } from 'react-router-dom';
import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';

export type TypeButton = 'button' | 'submit' | 'reset';
export type IButtonVariantTypes = 'primary' | 'secondary' | 'round';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  ROUND = 'round',
}

const { PRIMARY, SECONDARY, TERTIARY, ROUND } = ButtonVariant;

export interface IButtonComponent {
  id?: string;
  key?: string;
  name?: string;
  type?: TypeButton;
  children?: React.ReactNode;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  ariaLabel?: string;
  tooltip?: string;
  variant?: IButtonVariantTypes;
  buttonsConfig?: IButtonComponent[];
  configCustomClass?: string;
  size?: 'xs' | 'sm' | 'lg';
  selected?: boolean;
}

const Button: React.FC<IButtonComponent> = (props) => {
  const { buttonsConfig, configCustomClass, active } = props || {};
  const location = useLocation();
  const currentPath = location.pathname === '/' ? 'dashboard' : location.pathname.replace(/^\//, '');

  const { t } = useFallbackTranslation(currentPath);

  const baseClasses = 'button-component';

  const variantClasses = useMemo(
    () => ({
      primary: PRIMARY,
      secondary: SECONDARY,
      tertiary: TERTIARY,
      round: 'round rounded-full',
    }),
    []
  );

  const disabledClasses = 'bg-gray text-disabled cursor-not-allowed';

  const buttonRender = (btn: IButtonComponent, index = 0): React.JSX.Element => {
    const sizeClasses = {
      xs: btn.variant === ROUND ? 'text-sm h-6 w-6' : 'text-xs px-1 py-1 h-6',
      sm: btn.variant === ROUND ? 'text-base h-8 w-8' : 'text-sm px-3 py-2 h-8',
      lg: btn.variant === ROUND ? 'text-xl h-12 w-12' : 'text-base px-4 py-3 h-12',
    };

    const buttonVariantClass = classNames(
      baseClasses,
      variantClasses[btn?.variant || 'primary'],
      sizeClasses[btn?.size || 'sm'],
      btn.disabled ? disabledClasses : '',
      btn.className,
      {
        active: active,
      }
    );

    return (
      <>
        <button
          key={`btn-${index}`}
          id={btn.id}
          type={btn.type || 'button'}
          onClick={btn.handleClick}
          disabled={btn.disabled}
          aria-label={btn.ariaLabel ?? (btn.name ? t(btn.name) : '') ?? 'Unnamed Button'}
          className={`${buttonVariantClass} target-tooltip-btn-${index}`}
          data-pr-tooltip={t(btn.tooltip || '')}
          data-pr-classname={`shadow-none`}
          data-pr-position="top"
        >
          {btn.name ? t(btn.name) : btn.children}
        </button>
        <Tooltip target={`.target-tooltip-btn-${index}`} autoHide={false} />
      </>
    );
  };

  return (
    <>
      {!buttonsConfig?.length ? (
        buttonRender(props)
      ) : (
        <div className={configCustomClass ?? 'flex gap-x-2'}>{buttonsConfig?.map((btn, i) => buttonRender(btn, i))}</div>
      )}
    </>
  );
};

export default memo(Button);
