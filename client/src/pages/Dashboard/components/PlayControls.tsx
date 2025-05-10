import { FC } from 'react';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import TimeButtons from './TimeButtons';
import { FaPlay, FaStop } from 'react-icons/fa';
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from 'react-icons/tb';
import { BiReset } from 'react-icons/bi';

interface PlayControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const PlayControls: FC<PlayControlsProps> = ({ isPlaying, onPlayToggle, onNext, onPrev, speed, onSpeedChange, onReset }) => {
  return (
    <div className="d-flex gap-4 align-items-center justify-content-center">
      <Button
        variant={ButtonVariant.ROUND}
        size="xs"
        handleClick={onPlayToggle}
        tooltip={isPlaying ? 'common.logicControls.stop' : 'common.logicControls.play'}
      >
        {isPlaying ? <FaStop /> : <FaPlay />}
      </Button>

      <Button variant={ButtonVariant.ROUND} size="xs" handleClick={onPrev} tooltip="common.logicControls.prev">
        <TbPlayerTrackPrevFilled />
      </Button>

      <Button variant={ButtonVariant.ROUND} size="xs" handleClick={onNext} tooltip="common.logicControls.next">
        <TbPlayerTrackNextFilled />
      </Button>

      <Button variant={ButtonVariant.ROUND} size="xs" handleClick={onReset} tooltip="common.logicControls.chartReset">
        <BiReset />
      </Button>

      <TimeButtons onTimeframeChange={onSpeedChange} selectedTimeframe={speed} />
    </div>
  );
};

export default PlayControls;
