import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../mocks/server';
import { App } from './App';

const assertSmallTargetStatistic = ({ target, actual }: { target: number; actual: number }): void => {
  const targetElement = screen.getByText(new RegExp(`small target:.+${target}%`, 'i'));
  expect(targetElement).toBeInTheDocument();

  const actualElement = screen.getByText(new RegExp(`actual:.+${actual}%`, 'i'));
  expect(actualElement).toBeInTheDocument();

  const diffElement = screen.getByText(new RegExp(`difference:.+${Math.abs(target - actual)}%`, 'i'));
  expect(diffElement).toBeInTheDocument();
};

const queryErrorHandler = vi.fn();

const queryCache = new QueryCache({
  onError: queryErrorHandler,
});

const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: Infinity,
    },
  },
  logger: {
    // eslint-disable-next-line no-console
    log: console.log,
    // eslint-disable-next-line no-console
    warn: console.warn,
    error: () => {},
  },
});

const TestApp = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('visualization app', () => {
  afterEach(async () => {
    queryCache.clear();
  });

  test('app renders without crashing', async () => {
    render(<TestApp />);

    const boxListElement = await screen.findByRole('list');
    expect(boxListElement).toBeInTheDocument();

    const listScope = within(boxListElement);
    const itemElements = await listScope.findAllByRole('listitem');
    expect(itemElements).toHaveLength(21);

    assertSmallTargetStatistic({ target: 60, actual: 0 });
  });

  test('handles server error gracefully', async () => {
    server.use(
      rest.get('https://mdonev-mock.com/shapes', (_req, res, ctx) => {
        return res.once(ctx.status(500, 'Mocked server error'));
      }),
    );

    render(<TestApp />);

    await waitFor(() => expect(queryErrorHandler).toHaveBeenCalledTimes(1));

    const noDataElement = screen.getByText(/no data available/i);
    expect(noDataElement).toBeVisible();
  });

  describe('box list selection', () => {
    test('should select / unselect (no small box)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.click(svgElements[0]); // select
      await user.click(svgElements[1]); // select

      assertSmallTargetStatistic({ target: 60, actual: 0 });

      await user.click(svgElements[1]); // unselect
      await user.click(svgElements[0]); // unselect

      assertSmallTargetStatistic({ target: 60, actual: 0 });
    });

    test('should select / unselect (with small box)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.click(svgElements[0]); // select
      await user.click(svgElements[1]); // select
      await user.click(svgElements[2]); // select

      assertSmallTargetStatistic({ target: 60, actual: 33 });

      await user.click(svgElements[2]); // unselect
      await user.click(svgElements[1]); // unselect
      await user.click(svgElements[0]); // unselect

      assertSmallTargetStatistic({ target: 60, actual: 0 });
    });

    test('should select / unselect (only small boxes)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.click(svgElements[2]); // select
      await user.click(svgElements[3]); // select

      assertSmallTargetStatistic({ target: 60, actual: 100 });

      await user.click(svgElements[3]); // unselect
      await user.click(svgElements[2]); // unselect

      assertSmallTargetStatistic({ target: 60, actual: 0 });
    });
  });

  describe('box list selection with keyboard', () => {
    test('should select / unselect (no small box)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.tab();
      expect(svgElements[0]).toHaveFocus();
      await user.keyboard('{space}'); // select

      await user.tab();
      expect(svgElements[1]).toHaveFocus();
      await user.keyboard('{space}'); // select

      assertSmallTargetStatistic({ target: 60, actual: 0 });

      await user.keyboard('{space}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{space}'); // unselect

      assertSmallTargetStatistic({ target: 60, actual: 0 });
    });

    test('should select / unselect (with small box)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.tab();
      expect(svgElements[0]).toHaveFocus();
      await user.keyboard('{space}'); // select

      await user.tab();
      expect(svgElements[1]).toHaveFocus();
      await user.keyboard('{space}'); // select

      await user.tab();
      expect(svgElements[2]).toHaveFocus();
      await user.keyboard('{space}'); // select

      assertSmallTargetStatistic({ target: 60, actual: 33 });

      await user.keyboard('{space}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{space}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{space}'); // unselect

      assertSmallTargetStatistic({ target: 60, actual: 0 });
    });

    test('should select / unselect (only small boxes)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.tab();
      await user.tab();
      await user.tab();
      expect(svgElements[2]).toHaveFocus();
      await user.keyboard('{space}'); // select

      await user.tab();
      expect(svgElements[3]).toHaveFocus();
      await user.keyboard('{space}'); // select

      assertSmallTargetStatistic({ target: 60, actual: 100 });

      await user.keyboard('{space}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{space}'); // unselect

      assertSmallTargetStatistic({ target: 60, actual: 0 });
    });
  });
});
