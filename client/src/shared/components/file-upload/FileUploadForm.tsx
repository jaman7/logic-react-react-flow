import {
  FileUpload,
  FileUploadFile,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  FileUploadUploadEvent,
  ItemTemplateOptions,
} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import React, { ReactNode, useRef, useState } from 'react';
import Button, { ButtonVariant } from '../button/Button';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import classNames from 'classnames';
import { parseCsvToTruthTable } from '@/shared/utils/parseCsvToTruthTable';
import { ParsedTruthTable } from '@/shared/types/truth-table';
import { useTranslation } from 'react-i18next';
import { TranslatableError } from '@/shared/errors/TranslatableError';

interface FileUploadFormProps {
  maxFileSize?: number;
  accept?: string;
  multiple?: boolean;
  mode?: 'advanced' | 'basic';
  onFileParsed?: (data: ParsedTruthTable) => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  maxFileSize = 1000000,
  accept = 'image/*',
  multiple = false,
  mode,
  onFileParsed,
}) => {
  const [totalSize, setTotalSize] = useState(0);
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  const { t } = useTranslation();

  const onTemplateSelect = async (e: FileUploadSelectEvent): Promise<void> => {
    let _totalSize = totalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files?.[parseInt(key)]?.size || 0;
    });

    setTotalSize(_totalSize);

    if (e.files?.[0]?.objectURL) {
      const file = (e.originalEvent?.target as HTMLInputElement)?.files?.[0] || e.files?.[0];
      try {
        const result = await parseCsvToTruthTable(file);
        onFileParsed?.(result);
        toast.current?.show({ severity: 'success', summary: 'Wczytano CSV', detail: `Wczytano ${result.rows.length} wierszy` });
      } catch (err: any) {
        if (err instanceof TranslatableError) {
          toast.current?.show({
            severity: 'error',
            summary: t('common.error'),
            detail: t(err.key, { row: err.values?.row, input: err.values?.input, output: err.values?.output }),
          });
        } else {
          toast.current?.show({
            severity: 'error',
            summary: t('common.error'),
            detail: t(err.key, { error: err.values.error }),
          });
        }
      }
    }
  };

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    let _totalSize = 0;

    e.files.forEach((file: { size: number }) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    if (toast.current) {
      toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }
  };

  const onTemplateRemove = (file: FileUploadFile, callback: () => void) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="d-flex align-items-center gap-4 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (file: FileUploadFile | object, props: ItemTemplateOptions): ReactNode => {
    return (
      <div className="d-flex align-items-center flex-wrap">
        <div className="d-flex align-items-center">
          <img alt={(file as FileUploadFile)?.name} role="presentation" src={(file as FileUploadFile)?.objectURL} />
          <span className="d-flex flex-column text-left ml-3">
            {(file as FileUploadFile)?.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />

        <Button variant={ButtonVariant.ROUND} size="xs" handleClick={() => onTemplateRemove(file as FileUploadFile, () => props?.onRemove)}>
          x
        </Button>
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}
        ></i>
        <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-folder-open',
    iconOnly: true,
  };
  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined p-2 cursor-pointer',
  };
  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined p-2 cursor-pointer',
  };

  return (
    <>
      <Toast ref={toast}></Toast>

      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload
        ref={fileUploadRef}
        name="demo[]"
        url="/api/upload"
        multiple={multiple}
        accept={accept}
        mode={mode ?? 'advanced'}
        maxFileSize={maxFileSize}
        onUpload={onTemplateUpload}
        onSelect={(e: FileUploadSelectEvent) => onTemplateSelect(e)}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={(file: FileUploadFile | object, props: ItemTemplateOptions) => itemTemplate(file, props)}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        className={classNames('file-upload')}
      />
    </>
  );
};

export default FileUploadForm;
