import { FC, memo, useEffect, useState } from 'react';
import Button, { ButtonVariant } from '@/shared/components/button/Button';
import FileUploadForm from '@/shared/components/file-upload/FileUploadForm';
import FormElements from '@/shared/components/formElements/FormElements';
import { IFormElements } from '@/shared/components/formElements/FormElements.model';
import { IDictionary } from '@/shared/components/select/Select.model';
import { BinaryInputMode } from '@/shared/enums/binary-input-mode';
import { ParsedTruthTable, TruthTableRow } from '@/shared/types/truth-table';
import { convertBinaryToHex } from '@/shared/utils/convertBinaryToHex';
import { createConfigForm } from '@/shared/utils/form-config';
import { useGlobalStore } from '@/store/useGlobalStore';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { InputsSettingsFields } from './InputsSettings.enum';
import { formConfig } from './InputsSettings.config';
import { IFormPanelValues } from './InputsSettings.model';
import { useLogicMinimizerStore } from '../../store/useLogicMinimizerStore';

const { MANUAL, CSV, MODEL } = BinaryInputMode;
const { INPUTS, OUTPUTS, THRUH_TABLE } = InputsSettingsFields;

const InputsSettings: FC = () => {
  const [formConfig$, setFormConfig$] = useState<IFormElements[]>([]);
  const dictionary = useGlobalStore((state) => state.dictionary);
  const { updateFormValues, updateModeChange, updateTableData } = useLogicMinimizerStore();
  const formValues = useLogicMinimizerStore((state) => state.formValues ?? {});
  const currentMode = useLogicMinimizerStore((state) => state.currentMode ?? {});

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      inputs: formValues?.inputs ?? 3,
      outputs: formValues?.outputs ?? 3,
      thruhTable: null,
    } as IFormPanelValues,
  });

  const watchedThruehTable = useWatch({ control: formMethods.control, name: THRUH_TABLE });

  useEffect(() => {
    setFormConfig$(createConfigForm(formConfig, { prefix: 'form', dictionaries: dictionary as IDictionary }));
  }, [dictionary]);

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      updateFormValues(values);
    });
    return () => subscription.unsubscribe();
  }, [formMethods]);

  useEffect(() => {
    if (!watchedThruehTable) return;

    const data = (dictionary?.thruhTableDict?.find((el) => el.id === watchedThruehTable)?.entries ?? []) as TruthTableRow[];

    const inputLength = data[0]?.input?.length ?? 0;
    const outputLength = data[0]?.output?.length ?? 0;

    const currentInputs = formMethods.getValues(INPUTS);
    const currentOutputs = formMethods.getValues(OUTPUTS);

    if (inputLength !== currentInputs) {
      formMethods.setValue(INPUTS, inputLength);
      updateFormValues({ [INPUTS]: inputLength });
    }

    if (outputLength !== currentOutputs) {
      formMethods.setValue(OUTPUTS, outputLength);
      updateFormValues({ [OUTPUTS]: outputLength });
    }

    const updated: TruthTableRow[] = (data?.map((row) => ({
      ...row,
      inputHex: typeof row.input === 'string' ? convertBinaryToHex(row.input) : null,
      outputHex: typeof row.output === 'string' ? convertBinaryToHex(row.output) : null,
    })) ?? []) as TruthTableRow[];

    updateTableData?.(updated);
  }, [watchedThruehTable, dictionary]);

  const onCSVParsedHandler = (data: ParsedTruthTable) => {
    const inputsChange = data.meta.inputLength ?? 1;
    const outputsChange = data.meta.outputLength ?? 1;
    formMethods.setValue(INPUTS, inputsChange);
    formMethods.setValue(OUTPUTS, outputsChange);
    formMethods.setValue(THRUH_TABLE, null);
    updateFormValues({ [OUTPUTS]: outputsChange, [INPUTS]: inputsChange });
    updateTableData?.(data.rows);
  };

  const handleModelReset = () => {
    formMethods.setValue(THRUH_TABLE, null);
  };

  const itemsConfig = (data: IFormElements, formControlName: string): IFormElements => ({
    ...data,
    dictData: dictionary?.[data?.dictName as string] ?? [],
    disabled: currentMode === CSV || (watchedThruehTable !== null && formControlName !== THRUH_TABLE),
  });

  return (
    <div className="d-flex flex-column p-4 bg-white border rounded shadow">
      <h2 className="text-lg font-bold mb-3">Ustawienia Wejścia/Wyjścia</h2>
      <div className="d-flex gap-16 flex-wrap">
        <FormProvider {...formMethods}>
          <form className="d-flex gap-16 flex-wrap">
            {formConfig$?.map((item) => (
              <FormElements
                key={item.formControlName}
                formControlName={item.formControlName as string}
                config={itemsConfig(item.config as IFormElements, item.formControlName as string)}
              />
            ))}
          </form>
          <div className="d-flex align-items-center gap-16">
            <Button disabled={!watchedThruehTable} variant={ButtonVariant.SECONDARY} handleClick={handleModelReset}>
              Reset {MODEL}
            </Button>

            <Button variant={ButtonVariant.SECONDARY} handleClick={() => updateModeChange?.(currentMode === MANUAL ? CSV : MANUAL)}>
              {currentMode === MANUAL ? CSV : MANUAL}
            </Button>

            {currentMode === CSV && (
              <FileUploadForm mode="basic" maxFileSize={8000000} accept=".csv,text/csv" onFileParsed={onCSVParsedHandler} />
            )}
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default memo(InputsSettings);
