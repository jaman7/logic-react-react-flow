import { Column, ColumnBodyOptions, ColumnEditorOptions, ColumnEvent, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import {
  DataTable,
  DataTableFilterMetaData,
  DataTableHeaderTemplateOptions,
  DataTableSelectEvent,
  DataTableStateEvent,
  DataTableValue,
  DataTableValueArray,
} from 'primereact/datatable';
import { icons } from './table.icons';
import { ITableColumns, ITableIconsType, ITableButtonAction, ILazyState } from './table.model';
import { startTransition, useCallback, Suspense, ReactNode, useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Button, { ButtonVariant } from '../button/Button';
import { ButtonsTranslate } from '@/shared/enums';
import React from 'react';
import { FaPlus, FaRegClone, FaRegTrashAlt } from 'react-icons/fa';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FilterMatchMode } from 'primereact/api';
import classNames from 'classnames';
import Loader from '../Loader/Loader';
import { removeRowById } from '@/shared/utils/array-uttils';

interface TableProps {
  buttonsIcons?: ITableIconsType[];
  columns?: ITableColumns[];
  value?: DataTableValue[];
  paginator?: boolean;
  lazy?: boolean;
  totalRecords?: number;
  isColumnAction?: boolean;
  isColumnLp?: boolean;
  allowFilters?: boolean;
  quantity?: number;
  range?: number[];
  isSizeXs?: boolean;
  isTransparency?: boolean;
  isEdit?: boolean;
  action?: (e?: ITableButtonAction) => void;
  onLazyLoad?: (event: ILazyState) => void;
  setTableData?: (data: DataTableValue[]) => void;
  onAddNewRow?: (id: number) => void;
}

const Table: React.FC<TableProps> = React.memo(
  ({
    columns = [],
    value = [],
    buttonsIcons = [],
    paginator = true,
    totalRecords = 0,
    isColumnAction = false,
    isColumnLp = false,
    allowFilters = false,
    quantity = 10,
    range = [10, 50, 10],
    lazy = false,
    isSizeXs = false,
    isTransparency = false,
    isEdit = false,
    action,
    onLazyLoad,
    setTableData,
    onAddNewRow,
  }) => {
    const [lazyState, setlazyState] = useState<ILazyState>({
      filters: {},
      sort: { field: '', order: null },
      page: 0,
      pageSize: quantity,
    });
    const [selected, setSelected] = useState<DataTableValue | null>(null);
    const [cellValidationErrors, setCellValidationErrors] = useState<Map<string, string>>(new Map());

    const globalFilterFields = useMemo(() => columns?.map((column) => column?.field || '')?.filter(Boolean), [columns]);

    const lazyLoadSubject = useRef(new Subject<ILazyState>()).current;

    const location = useLocation();
    const currentPath = location.pathname === '/' ? 'dashboard' : location.pathname.replace(/^\//, '');
    const { t } = useTranslation();
    let locationT = (key: string) => key;

    startTransition(() => {
      locationT = useTranslation?.(currentPath)?.t;
    });

    const rowPerPageOptions = Array.from({ length: (range[1] - range[0]) / range[2] + 1 }, (_, index) => range[0] + index * range[2]);

    const onFilter = (event: any) => {
      setlazyState((prev) => ({
        ...prev,
        filters: event.filters,
      }));
    };

    const handlePageChange = (event: DataTableStateEvent) => {
      setlazyState((prev) => ({
        ...prev,
        page: event.page || 0,
        pageSize: event.rows || quantity,
      }));
    };

    const handleSortChange = (field: string, order: 1 | -1 | null) => {
      setlazyState((prev) => ({
        ...prev,
        sort: { field, order },
      }));
    };

    const handleAddRow = () => {
      const maxId = value?.reduce((max, item) => Math.max(max, item.id), 0);
      onAddNewRow?.(maxId + 1);
    };

    const handleDeleteRow = (selection: DataTableValue) => {
      setTableData?.(removeRowById(value as { id: number }[], selection?.id));
    };

    const handleDuplicateRow = (selection: DataTableValue) => {
      const maxId = value?.reduce((max, row) => Math.max(max, row.id), 0);
      setTableData?.([...value, { ...selection, id: maxId + 1 }]);
    };

    useEffect(() => {
      const initialFilters: { [name: string]: DataTableFilterMetaData } = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };

      columns?.forEach((col) => {
        if (col?.field && col?.filter) {
          initialFilters[col.field] = { value: null, matchMode: FilterMatchMode.CONTAINS };
        }
      });

      setlazyState((prev) => ({ ...prev, filters: initialFilters }));
    }, [columns]);

    useEffect(() => {
      if (!lazy || !onLazyLoad) return;

      const subscription = lazyLoadSubject
        .pipe(
          debounceTime(500),
          distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        )
        .subscribe(onLazyLoad);

      return () => subscription.unsubscribe();
    }, [lazy, onLazyLoad]);

    useEffect(() => {
      if (lazy && onLazyLoad) {
        lazyLoadSubject.next({
          sortBy: lazyState?.sort?.field ?? '',
          sortOrder: lazyState?.sort?.order === 1 ? 'asc' : 'desc',
          filters: lazyState?.filters ?? {},
          page: lazyState.page,
          pageSize: lazyState.pageSize,
        });
      }
    }, [lazyState, lazy, onLazyLoad]);

    const onCellEditComplete = (e: ColumnEvent) => {
      let { rowData, newValue, field } = e;

      setTableData?.(
        value?.map((item: DataTableValue) =>
          item.id === (rowData as DataTableValue).id ? { ...item, [field as keyof DataTableValue]: newValue } : item
        ) ?? []
      );
    };

    const onRowSelect = (e: DataTableSelectEvent) => {
      setSelected(e?.data);
    };

    const renderCellEditor = (options: ColumnEditorOptions) => {
      const column = columns.find((col) => col.field === options?.column?.props?.field);
      const rowData = options?.rowData;
      const field = options?.field;
      const key = `${rowData?.id}_${field}`;
      const index = options.rowIndex + 1;
      return (
        <InputText
          type="text"
          className="input-cell"
          value={options.value}
          onChange={(e) => {
            const newValue = e.target.value;
            options.editorCallback?.(newValue);
            if (column?.editorValidator) {
              const result = column.editorValidator(newValue, rowData, column, index);
              setCellValidationErrors((prev) => {
                const updated = new Map(prev);
                if (result !== true) {
                  updated.set(key, typeof result === 'string' ? result : 'Błąd walidacji');
                } else {
                  updated.delete(key);
                }
                return updated;
              });
            }
          }}
        />
      );
    };

    const renderFilter = useCallback(
      (options: ColumnFilterElementTemplateOptions, column: ITableColumns): ReactNode => {
        if (column?.filter) {
          switch (column?.filter?.type) {
            default:
              return (
                <InputText
                  type="text"
                  className="p-inputtext-sm p-1"
                  placeholder={t('common.table.filterInputPlaceholder')}
                  value={options?.value ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.filterApplyCallback(e?.target?.value ?? '')}
                  size="small"
                />
              );
          }
        }
        return null;
      },
      [locationT]
    );

    const actionBodyTemplate = useCallback(
      <T,>(rowData: T) => (
        <div className="d-flex gap-2">
          {buttonsIcons?.map((key) => (
            <Button
              key={key}
              tooltip={ButtonsTranslate[key]}
              variant={ButtonVariant.ROUND}
              size="xs"
              handleClick={() => {
                startTransition(() => {
                  action?.({ rowData, type: key });
                });
              }}
              aria-label={ButtonsTranslate[key]}
            >
              {icons?.[key?.toLowerCase() as keyof typeof icons]}
            </Button>
          ))}
        </div>
      ),
      [action, buttonsIcons]
    );

    const renderEditRowActions = useCallback(
      (e: DataTableHeaderTemplateOptions<DataTableValueArray>) => {
        const { selection } = e?.props || {};

        return (
          <>
            {isEdit && (
              <div className="editable-buttons">
                {isEdit && (
                  <Button variant={ButtonVariant.ROUND} size="xs" handleClick={() => handleAddRow()} tooltip="common.buttons.add">
                    <FaPlus />
                  </Button>
                )}

                {isEdit && value.length > 0 && selected?.id && (
                  <>
                    <Button
                      variant={ButtonVariant.ROUND}
                      size="xs"
                      handleClick={() => handleDeleteRow(selection as DataTableValue)}
                      tooltip="common.buttons.delete"
                    >
                      <FaRegTrashAlt />
                    </Button>
                    <Button
                      variant={ButtonVariant.ROUND}
                      size="xs"
                      handleClick={() => handleDuplicateRow(selection as DataTableValue)}
                      tooltip="common.buttons.clone"
                    >
                      <FaRegClone />
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        );
      },
      [locationT, handleAddRow, handleDeleteRow, handleDuplicateRow]
    );

    const renderFooter = useCallback(() => {
      if (!cellValidationErrors.size) return null;

      const uniqueMessages = [...new Set(cellValidationErrors.values())];

      return (
        <div className="table-validation-footer">
          <ul>
            {uniqueMessages.map((msg, i) => (
              <li key={`error_${i}`}>{msg}</li>
            ))}
          </ul>
        </div>
      );
    }, [cellValidationErrors]);

    const customValue = useCallback(<T extends Record<string, T>>(value: T, column: ITableColumns): T | string | null => {
      return column?.customizeValue ? column?.customizeValue?.(value) : (value ?? '');
    }, []);

    const bodyTemplate = useCallback(
      <T extends Record<string, T>>(rowData: DataTableValue, column: ITableColumns, index: number) => {
        const { field, type } = column || {};
        if (type === 'Boolean') {
          return (
            <div key={`body_boolean_${rowData?.id}_${index}`} className="d-flex justify-content-center">
              <i className={`pi ${rowData?.[field as string] ? 'pi-check-circle' : 'pi-times'}`}></i>
            </div>
          );
        }

        if (field && rowData) {
          return <span key={`body_value_${rowData?.id}_${index}`}>{customValue(rowData?.[field] ?? '', column)}</span>;
        }
        return null;
      },
      [customValue]
    );

    const lpBodyTemplate = useCallback((options: ColumnBodyOptions) => {
      return <span>{options?.rowIndex + 1}</span>;
    }, []);

    return (
      <Suspense fallback={<Loader />}>
        <DataTable
          dataKey="id"
          paginator={paginator}
          className={classNames('table-component', { xs: isSizeXs ?? '', transparency: isTransparency ?? '' })}
          value={columns?.length ? (value ?? []) : []}
          rows={lazyState?.pageSize ?? 5}
          totalRecords={totalRecords ?? 0}
          rowsPerPageOptions={rowPerPageOptions}
          removableSort
          lazy={lazy}
          filterDisplay="row"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate={t('common.table.currentPageReport', {
            first: '{first}',
            last: '{last}',
            totalRecords: '{totalRecords}',
          })}
          emptyMessage={t('common.table.emptyMessage')}
          onPage={handlePageChange}
          onSort={(e) => handleSortChange(e.sortField, e.sortOrder as 1 | -1)}
          onFilter={onFilter}
          size="small"
          first={(lazyState?.page ?? 0) * (lazyState?.pageSize ?? 5)}
          globalFilterFields={globalFilterFields}
          filters={lazyState?.filters}
          sortField={lazyState?.sort?.field ?? ''}
          sortOrder={lazyState?.sort?.order ?? null}
          filterDelay={0}
          paginatorDropdownAppendTo="self"
          editMode={isEdit ? 'cell' : undefined}
          selectionMode="single"
          metaKeySelection={true}
          selection={selected}
          onSelectionChange={(e) => setSelected(e.value)}
          header={(e: DataTableHeaderTemplateOptions<DataTableValueArray>) => renderEditRowActions(e)}
          footer={renderFooter}
          onRowSelect={(e: DataTableSelectEvent) => onRowSelect(e)}
        >
          {isColumnLp && (
            <Column
              key={'colLP'}
              header={locationT('LP')}
              body={(_, options: ColumnBodyOptions) => lpBodyTemplate(options)}
              exportable={false}
            />
          )}

          {columns?.map((col, index) => (
            <Column
              key={col?.field ? `col_${col?.field}` : `table_col_${index}`}
              sortable={col?.sortable && !col?.disableFilterSort}
              field={col?.field}
              header={() => locationT(col?.header || '')}
              filter={allowFilters && !col?.disableFilterSort}
              filterElement={(options) => renderFilter(options, col)}
              showFilterMenu={false}
              showClearButton={false}
              body={(rowData: DataTableValue) => bodyTemplate(rowData, col, index)}
              editor={isEdit && col.editable ? (options) => renderCellEditor(options) : undefined}
              onCellEditComplete={onCellEditComplete}
              showAddButton={true}
              bodyClassName={(rowData: DataTableValue) => {
                const key = `${rowData?.id}_${col.field}`;
                return cellValidationErrors.has(key) ? 'cell-error' : '';
              }}
            />
          ))}

          {isColumnAction && (
            <Column
              key={'colAction'}
              header={locationT('Actions')}
              body={(rowData: DataTableValue) => actionBodyTemplate(rowData)}
              exportable={false}
            />
          )}
        </DataTable>
      </Suspense>
    );
  }
);

export default Table;
