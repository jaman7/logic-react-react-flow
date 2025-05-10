import { FC, useEffect, useMemo, useState } from 'react';
import { generateTruthTable } from '@/shared/utils/truthTableUtils';
import LogicGateIcon from '@/shared/components/LogicGateNode/LogicGateIcon';
import PlayControls from './PlayControls';
import TruthTable from './TruthTable';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import GateChart from './GateChart';
import './GateSimulator.scss';
import { LogicGateType } from '@/shared/types/logic-gate';

interface GateSimulatorProps {
  type: LogicGateType;
}

const GateSimulator: FC<GateSimulatorProps> = ({ type }) => {
  const [inputs, setInputs] = useState<boolean[]>(type === 'NOT' ? [false] : [false, false]);
  const [playing, setPlaying] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
  const [intervalSpeed, setIntervalSpeed] = useState(2000);
  const [timeSeries, setTimeSeries] = useState<{ time: number; inputs: boolean[]; output: boolean }[]>([]);
  const [timeCounter, setTimeCounter] = useState(0);

  const truthTableArray = useMemo(() => generateTruthTable(type), [type]);
  const output = truthTableArray.find((row) => row.inputs.every((v, i) => v === inputs[i]))?.output ?? false;

  useEffect(() => {
    if (playing) {
      const timer = setInterval(() => {
        setActiveRow((prev) => (prev + 1) % truthTableArray.length);
      }, intervalSpeed);

      return () => clearInterval(timer);
    }
  }, [playing, intervalSpeed, truthTableArray.length]);

  useEffect(() => {
    if (!playing) return;
    const newInputs = truthTableArray[activeRow]?.inputs ?? [];
    setInputs(newInputs);
  }, [activeRow, playing, truthTableArray]);

  useEffect(() => {
    setTimeCounter((prev) => prev + intervalSpeed / 1000);
    setTimeSeries((prev) => [...prev, { time: timeCounter, inputs, output }]);
  }, [activeRow, playing ? null : inputs]);

  const handleInputToggle = (index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = !newInputs[index];
    setInputs(newInputs);
    setPlaying(false); // manual stop
  };

  const handleSelectRow = (index: number) => {
    setActiveRow(index);
    setInputs(truthTableArray[index]?.inputs ?? []);
    setPlaying(false);
  };

  const handleResetHistory = () => {
    setTimeCounter(0);
    setTimeSeries([]);
  };

  return (
    <div className="gate-simulator bg-white p-3">
      <h2 className="text-lg font-bold mb-3">{type} Gate Simulator</h2>

      <div className="d-flex gap-4 flex-wrap w-100">
        <div className="d-flex align-items-center justify-content-center gap-2 flex1 w-100">
          <div className="d-flex flex-column gap-16 p-2">
            {inputs?.map((v, i) => (
              <Button
                key={`logic-input-btn-${i}`}
                active={v}
                size="xs"
                variant={ButtonVariant.ROUND}
                handleClick={() => handleInputToggle(i)}
              >
                {v ? '1' : '0'}
              </Button>
            ))}
          </div>

          <LogicGateIcon
            type={type}
            inputs={inputs?.map((v) => (v ? `1` : `0`))}
            outputs={['Y']}
            activePorts={{
              inputs: inputs.map(() => true),
              outputs: [output],
            }}
          />

          <div className="d-flex align-items-center gap-8">
            <div className={`led ${output ? 'bg-green' : 'bg-gray'}`} />
            <span className="font-bold">{output ? '1' : '0'}</span>
          </div>
        </div>

        <div className="d-flex flex-column gap-16">
          <PlayControls
            isPlaying={playing}
            onPlayToggle={() => setPlaying(!playing)}
            onNext={() => setActiveRow((prev) => (prev + 1) % truthTableArray.length)}
            onPrev={() => setActiveRow((prev) => (prev - 1 + truthTableArray.length) % truthTableArray.length)}
            speed={intervalSpeed}
            onSpeedChange={(newSpeed: number) => setIntervalSpeed(newSpeed)}
            onReset={handleResetHistory}
          />

          <TruthTable truthTable={truthTableArray} activeRow={activeRow} onSelectRow={handleSelectRow} />
        </div>

        <div className="d-flex align-items-center flex1 w-100">
          <GateChart inputs={inputs} timeSeries={timeSeries} />
        </div>
      </div>
    </div>
  );
};

export default GateSimulator;
