import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { SearchContext } from '@edx/frontend-enterprise-catalog-search';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { BaseCatalogSearchResults, SKELETON_DATA_TESTID } from '../search/CatalogSearchResults';

import { renderWithRouter } from '../../test/testUtils';

import { CONTENT_TYPE_COURSE } from '../data/constants';

// Mocking this connected component so as not to have to mock the algolia Api
const PAGINATE_ME = 'PAGINATE ME :)';
const PaginationComponent = () => <div>{PAGINATE_ME}</div>;

// all we are testing is routes, we don't need InstantSearch to work here
jest.mock('react-instantsearch-dom', () => ({
  ...jest.requireActual('react-instantsearch-dom'),
  InstantSearch: () => <div>Popular Courses</div>,
  Index: () => <div>Popular Courses</div>,
}));

const DEFAULT_SEARCH_CONTEXT_VALUE = { refinements: {} };

const SearchDataWrapper = ({

  children,

  searchContextValue = DEFAULT_SEARCH_CONTEXT_VALUE,
}) => (
  <SearchContext.Provider value={searchContextValue}>
    {children}
  </SearchContext.Provider>
);

const mockConfig = () => ({
  EDX_FOR_BUSINESS_TITLE: 'ayylmao',
  EDX_ENTERPRISE_ALACARTE_TITLE: 'baz',
  FEATURE_CARD_VIEW_ENABLED: 'True',
});

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: () => mockConfig(),
}));

const TEST_COURSE_NAME = 'test course';
const TEST_PARTNER = 'edx';
const TEST_CATALOGS = ['baz'];

const TEST_COURSE_NAME_2 = 'test course 2';
const TEST_PARTNER_2 = 'edx 2';
const TEST_CATALOGS_2 = ['baz', 'ayylmao'];

const searchResults = {
  nbHits: 2,
  hitsPerPage: 10,
  pageIndex: 10,
  pageCount: 5,
  nbPages: 6,
  hits: [
    {
      title: TEST_COURSE_NAME,
      partners: [{ name: TEST_PARTNER, logo_image_url: '' }],
      enterprise_catalog_query_titles: TEST_CATALOGS,
      card_image_url: 'http://url.test.location',
      first_enrollable_paid_seat_price: 100,
      original_image_url: '',
      availability: ['Available Now'],
      content_type: CONTENT_TYPE_COURSE,
      advertised_course_run: {
        start: '2020-01-24T05:00:00Z',
        end: '2080-01-01T17:00:00Z',
        upgrade_deadline: 1892678399,
        pacing_type: 'self_paced',
      },
    },
    {
      title: TEST_COURSE_NAME_2,
      partners: [{ name: TEST_PARTNER_2, logo_image_url: '' }],
      enterprise_catalog_query_titles: TEST_CATALOGS_2,
      card_image_url: 'http://url.test2.location',
      first_enrollable_paid_seat_price: 99,
      original_image_url: '',
      availability: ['Available Now'],
      content_type: CONTENT_TYPE_COURSE,
      advertised_course_run: {
        start: '2020-01-24T05:00:00Z',
        end: '2080-01-01T17:00:00Z',
        upgrade_deadline: 1892678399,
        pacing_type: 'self_paced',
      },
    },
  ],
  page: 1,
  _state: { disjunctiveFacetsRefinements: { foo: 'bar' } },
};

const defaultProps = {
  paginationComponent: PaginationComponent,
  searchResults,
  isSearchStalled: false,
  searchState: { page: 1 },
  error: null,
  contentType: CONTENT_TYPE_COURSE,
  // mock i18n requirements
  intl: {
    formatMessage: (header) => header.defaultMessage,
    formatDate: () => {},
    formatTime: () => {},
    formatRelative: () => {},
    formatNumber: () => {},
    formatPlural: () => {},
    formatHTMLMessage: () => {},
    now: () => {},
  },
};

describe('Main Catalogs view works as expected', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  afterEach(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test('all courses rendered when search results available', async () => {
    render(
      <SearchDataWrapper>
        <IntlProvider locale="en">
          <BaseCatalogSearchResults {...defaultProps} />
        </IntlProvider>
        ,
      </SearchDataWrapper>,
    );
    expect(screen.queryByText(TEST_COURSE_NAME)).toBeInTheDocument();
    expect(screen.queryByText(TEST_COURSE_NAME_2)).toBeInTheDocument();
    expect(screen.getAllByText('Showing 2 of 2.')[0]).toBeInTheDocument();
  });
  test('isSearchStalled leads to rendering skeleton and not content', () => {
    renderWithRouter(
      <SearchDataWrapper>
        <BaseCatalogSearchResults {...defaultProps} isSearchStalled />
      </SearchDataWrapper>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(TEST_COURSE_NAME)).not.toBeInTheDocument();
    expect(screen.getByTestId(SKELETON_DATA_TESTID)).toBeInTheDocument();
  });
});
