import { JSX, memo } from 'react';
import './MinimizeReport.scss';

interface MinimizeReportProps {
  report: JSX.Element[];
}

const MinimizeReport: React.FC<MinimizeReportProps> = ({ report }) => {
  if (!report?.length) return null;

  return (
    <div className="minimize-button">
      <div className="bg-page p-3 border rounded text-sm">
        <h3 className="font-bold mb-2">Validation Report</h3>
        <pre className="minimize-button__pre">
          {report.map((line, idx) => (
            <div className="d-flex align-items-center" key={`code-${idx}`}>
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default memo(MinimizeReport);
