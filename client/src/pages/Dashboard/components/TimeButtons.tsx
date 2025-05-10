import { useCallback } from 'react';
import Button, { ButtonVariant } from '@/shared/components/button/Button';

interface FiltersChartButtonsProps {
  selectedTimeframe?: number;
  onTimeframeChange?: (timeframe: number) => void;
  isTimeframe?: boolean;
}

const SPEED_OPTIONS = [10000, 5000, 2000, 1000, 500];

const TimeButtons: React.FC<FiltersChartButtonsProps> = ({ selectedTimeframe = 2000, onTimeframeChange }) => {
  const handleTimeframeClick = useCallback(
    (tf: number) => {
      onTimeframeChange?.(tf);
    },
    [onTimeframeChange]
  );

  return (
    <div className="d-flex gap-4 align-items-center">
      {SPEED_OPTIONS?.map((tf, i) => (
        <Button
          key={`timeframe-buttons-${i}`}
          variant={ButtonVariant.ROUND}
          size="xs"
          handleClick={() => handleTimeframeClick(tf)}
          active={selectedTimeframe === tf}
          className="text-[10px]"
        >
          {tf / 1000}s
        </Button>
      ))}
    </div>
  );
};

export default TimeButtons;
