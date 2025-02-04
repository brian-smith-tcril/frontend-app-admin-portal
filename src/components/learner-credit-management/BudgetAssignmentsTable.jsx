import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from '@edx/paragon';

import TableTextFilter from './TableTextFilter';
import CustomDataTableEmptyState from './CustomDataTableEmptyState';
import AssignmentDetailsTableCell from './AssignmentDetailsTableCell';
import { DEFAULT_PAGE, PAGE_SIZE, formatPrice } from './data';

const FilterStatus = (rest) => <DataTable.FilterStatus showFilteredFields={false} {...rest} />;

const BudgetAssignmentsTable = ({
  isLoading,
  tableData,
  fetchTableData,
}) => (
  <DataTable
    isSortable
    manualSortBy
    isPaginated
    manualPagination
    isFilterable
    manualFilters
    isLoading={isLoading}
    defaultColumnValues={{ Filter: TableTextFilter }}
    FilterStatusComponent={FilterStatus}
    columns={[
      {
        Header: 'Assignment details',
        accessor: 'assignmentDetails',
        Cell: AssignmentDetailsTableCell,
        disableSortBy: true,
      },
      {
        Header: 'Amount',
        Cell: ({ row }) => `-${formatPrice(row.original.contentQuantity / 100, { maximumFractionDigits: 0 })}`,
        disableFilters: true,
      },
    ]}
    initialTableOptions={{
      getRowId: row => row?.uuid?.toString(),
    }}
    initialState={{
      pageSize: PAGE_SIZE,
      pageIndex: DEFAULT_PAGE,
      sortBy: [],
      filters: [],
    }}
    fetchData={fetchTableData}
    data={tableData.results}
    itemCount={tableData.count}
    pageCount={tableData.numPages}
    EmptyTableComponent={CustomDataTableEmptyState}
  />
);

BudgetAssignmentsTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  tableData: PropTypes.shape().isRequired,
  fetchTableData: PropTypes.func.isRequired,
};

export default BudgetAssignmentsTable;
