import React from 'react';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import { renderApp, waitForElement, wait } from '../../test-utils';
import FetchAllMenuFeatureToggles from './fetch-all-menu-feature-toggles.proxy.graphql';
import useAllMenuFeatureToggles from './use-all-menu-feature-toggles';

jest.mock('@commercetools-frontend/sentry');

const TestComponent = () => {
  const { isLoading, allFeatureToggles } = useAllMenuFeatureToggles();

  if (!isLoading) {
    return (
      <>
        <h3>Number of toggles: {Object.keys(allFeatureToggles).length}</h3>
        <ul>
          {Object.entries(allFeatureToggles).map(
            ([featureToggleName, featureToggleValue]) => (
              <div key={featureToggleName}>{`Toggle: ${featureToggleName} is ${
                featureToggleValue ? 'enabled' : 'disabled'
              }`}</div>
            )
          )}
        </ul>
      </>
    );
  }

  return <div>{'Loading'}</div>;
};

const mockRequests = {
  withoutError: {
    request: {
      query: FetchAllMenuFeatureToggles,
    },
    result: {
      data: {
        allFeatureToggles: ['flagA', 'flagB'],
      },
    },
  },
  withError: {
    request: {
      query: FetchAllMenuFeatureToggles,
    },
    result: {
      errors: [
        {
          message: 'There has been an error.',
        },
      ],
    },
  },
};

const render = ({ mocks, environment } = { mocks: [] }) =>
  renderApp(<TestComponent />, {
    mocks,
    environment,
  });

describe('when served by proxy', () => {
  describe('without error', () => {
    it('should be loading and return any feature toggles', async () => {
      const rendered = render({
        environment: {
          servedByProxy: true,
        },
        mocks: [mockRequests.withoutError],
      });

      await waitForElement(() => rendered.getByText('Loading'));
      await waitForElement(() => [
        rendered.getByText(/Number of toggles: 2/i),
        rendered.getByText(/Toggle: flagA is disabled/i),
        rendered.getByText(/Toggle: flagB is disabled/i),
      ]);
    });
  });

  describe('with error', () => {
    it('should be loading and return no feature toggles and report to sentry', async () => {
      const rendered = render({
        environment: {
          servedByProxy: true,
        },
        mocks: [mockRequests.withError],
      });

      await waitForElement(() => rendered.getByText('Loading'));
      await waitForElement(() => rendered.getByText(/Number of toggles: 0/i));

      await wait(() => {
        expect(reportErrorToSentry).toHaveBeenCalled();
      });
    });
  });
});

describe('when not served proxy', () => {
  it('should not be loading and not return any feature toggles', async () => {
    const rendered = render();

    expect(rendered.queryByText('Loading')).not.toBeInTheDocument();

    await waitForElement(() => rendered.getByText(/Number of toggles: 0/i));
  });
});