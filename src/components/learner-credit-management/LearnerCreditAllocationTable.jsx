import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { DataTable } from '@edx/paragon';

import TableTextFilter from './TableTextFilter';
import CustomDataTableEmptyState from './CustomDataTableEmptyState';
import SpendTableEnrollmentDetails from './SpendTableEnrollmentDetails';
import { getCourseProductLineText } from '../../utils';
import { PAGE_SIZE, DEFAULT_PAGE } from './data';

const FilterStatus = (rest) => <DataTable.FilterStatus showFilteredFields={false} {...rest} />;

const LearnerCreditAllocationTable = ({
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
        Header: 'Date',
        accessor: 'enrollmentDate',
        Cell: ({ row }) => dayjs(row.values.enrollmentDate).format('MMM D, YYYY'),
        disableFilters: true,
      },
      {
        Header: 'Enrollment details',
        accessor: 'enrollmentDetails',
        Cell: SpendTableEnrollmentDetails,
        disableSortBy: true,
      },
      {
        Header: 'Amount',
        accessor: 'courseListPrice',
        Cell: ({ row }) => `$${row.values.courseListPrice}`,
        disableFilters: true,
      },
      {
        Header: 'Product',
        accessor: 'courseProductLine',
        Cell: ({ row }) => getCourseProductLineText(row.values.courseProductLine),
        disableFilters: true,
      },
    ]}
    initialTableOptions={{
      getRowId: row => row?.uuid?.toString(),
    }}
    initialState={{
      pageSize: PAGE_SIZE,
      pageIndex: DEFAULT_PAGE,
      sortBy: [
        { id: 'enrollmentDate', desc: true },
      ],
      filters: [],
    }}
    fetchData={fetchTableData}
    data={tableData.results}
    itemCount={tableData.itemCount}
    pageCount={tableData.pageCount}
    EmptyTableComponent={CustomDataTableEmptyState}
  />
);

LearnerCreditAllocationTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  tableData: PropTypes.shape({
    results: PropTypes.arrayOf(PropTypes.shape({
      userEmail: PropTypes.string,
      courseTitle: PropTypes.string.isRequired,
      courseListPrice: PropTypes.number.isRequired,
      enrollmentDate: PropTypes.string.isRequired,
      courseProductLine: PropTypes.string.isRequired,
    })),
    itemCount: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
  }).isRequired,
  fetchTableData: PropTypes.func.isRequired,
};

export default LearnerCreditAllocationTable;
