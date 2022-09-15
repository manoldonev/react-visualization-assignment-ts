import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'jotai';
import { rest } from 'msw';
import { server } from '../mocks/server';
import { App } from './App';

const assertTargetStatistic = ({
  target,
  actual,
  testId,
}: {
  target: number;
  actual: number;
  testId: string;
}): void => {
  const targetElement = screen.getByTestId(testId);
  expect(targetElement).toBeInTheDocument();

  const targetScope = within(targetElement);
  const targetLabelElement = targetScope.getByText(new RegExp(`.+target:.+${target}%`, 'i'));
  expect(targetLabelElement).toBeInTheDocument();

  const actualLabelElement = targetScope.getByText(new RegExp(`actual:.+${actual}%`, 'i'));
  expect(actualLabelElement).toBeInTheDocument();

  const diffLabelElement = targetScope.getByText(new RegExp(`difference:.+${Math.abs(target - actual)}%`, 'i'));
  expect(diffLabelElement).toBeInTheDocument();
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
      <Provider>
        <App />
      </Provider>
    </QueryClientProvider>
  );
};

describe('visualization app', () => {
  afterEach(async () => {
    queryCache.clear();
  });

  test('renders without crashing', async () => {
    render(<TestApp />);

    const boxListElement = await screen.findByRole('list');
    expect(boxListElement).toBeInTheDocument();

    const listScope = within(boxListElement);
    const itemElements = await listScope.findAllByRole('listitem');
    expect(itemElements).toHaveLength(21);

    assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
    assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });

    const undoElement = screen.getByText(/undo/i);
    expect(undoElement).toBeInTheDocument();
    expect(undoElement).toBeDisabled();
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

    const undoElement = screen.queryByText(/undo/i);
    expect(undoElement).not.toBeInTheDocument();
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

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });

      await user.click(svgElements[1]); // unselect
      await user.click(svgElements[0]); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
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

      assertTargetStatistic({ target: 60, actual: 33, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 33, testId: 'orange-target' });

      await user.click(svgElements[2]); // unselect
      await user.click(svgElements[1]); // unselect
      await user.click(svgElements[0]); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should select / unselect (only small boxes)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.click(svgElements[2]); // select
      await user.click(svgElements[3]); // select

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.click(svgElements[3]); // unselect
      await user.click(svgElements[2]); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should select / unselect (no small box) with keyboard', async () => {
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

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
      await user.keyboard('{space}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{space}'); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should select / unselect (with small box) with keyboard', async () => {
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

      assertTargetStatistic({ target: 60, actual: 33, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 33, testId: 'orange-target' });

      await user.keyboard('{space}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{space}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{space}'); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should select / unselect (only small boxes) with keyboard', async () => {
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

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.keyboard('{space}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{space}'); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });
  });

  describe('box list undo support', () => {
    test('should undo if action log not empty', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgElements = await listScope.findAllByRole('button');

      const undoElement = screen.getByText(/undo/i);
      expect(undoElement).toBeInTheDocument();
      expect(undoElement).toBeDisabled();

      const user = userEvent.setup();
      await user.click(svgElements[3]); // select
      await user.click(svgElements[4]); // select

      expect(undoElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 50, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.click(undoElement); // undo (unselect)

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.click(undoElement); // undo (unselect)

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });

      expect(undoElement).toBeDisabled();
    });

    test('should undo if action log not empty with keyboard', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgElements = await listScope.findAllByRole('button');

      const undoElement = screen.getByText(/undo/i);
      expect(undoElement).toBeInTheDocument();
      expect(undoElement).toBeDisabled();

      const user = userEvent.setup();

      await user.tab();
      await user.tab();
      await user.tab();

      await user.tab();
      expect(svgElements[3]).toHaveFocus();
      await user.keyboard('{space}'); // select

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.tab();
      expect(svgElements[4]).toHaveFocus();
      await user.keyboard('{space}'); // select

      assertTargetStatistic({ target: 60, actual: 50, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.tab({ shift: true }); // tab back
      await user.tab({ shift: true }); // tab back
      await user.tab({ shift: true }); // tab back
      await user.tab({ shift: true }); // tab back
      await user.tab({ shift: true }); // tab back

      expect(undoElement).toHaveFocus();
      expect(undoElement).toBeEnabled();
      await user.keyboard('{enter}'); // undo (unselect)

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      expect(undoElement).toHaveFocus();
      expect(undoElement).toBeEnabled();
      await user.keyboard('{enter}'); // undo (unselect)

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });

      expect(undoElement).toBeDisabled();
    });
  });
});
