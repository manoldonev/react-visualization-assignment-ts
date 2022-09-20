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
    expect(undoElement).toBeDisabled();

    const redoElement = screen.getByText(/redo/i);
    expect(redoElement).toBeDisabled();

    const resetElement = screen.getByText(/reset/i);
    expect(resetElement).toBeDisabled();
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

    const redoElement = screen.queryByText(/redo/i);
    expect(redoElement).not.toBeInTheDocument();

    const resetElement = screen.queryByText(/reset/i);
    expect(resetElement).not.toBeInTheDocument();
  });

  describe('selection', () => {
    test('should select / unselect (no small box)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgButtonElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.click(svgButtonElements[0]); // select
      await user.click(svgButtonElements[1]); // select

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });

      await user.click(svgButtonElements[1]); // unselect
      await user.click(svgButtonElements[0]); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should select / unselect (with small box)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgButtonElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.click(svgButtonElements[0]); // select
      await user.click(svgButtonElements[1]); // select
      await user.click(svgButtonElements[2]); // select

      assertTargetStatistic({ target: 60, actual: 33, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 33, testId: 'orange-target' });

      await user.click(svgButtonElements[2]); // unselect
      await user.click(svgButtonElements[1]); // unselect
      await user.click(svgButtonElements[0]); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should select / unselect (only small boxes)', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgButtonElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();
      await user.click(svgButtonElements[2]); // select
      await user.click(svgButtonElements[3]); // select

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.click(svgButtonElements[3]); // unselect
      await user.click(svgButtonElements[2]); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should select / unselect (no small box) with keyboard', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgButtonElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();

      await user.tab();
      expect(svgButtonElements[0]).toHaveFocus();
      await user.keyboard('{enter}'); // select

      await user.tab();
      expect(svgButtonElements[1]).toHaveFocus();
      await user.keyboard('{enter}'); // select

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
      await user.keyboard('{enter}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{enter}'); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should select / unselect (with small box) with keyboard', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgButtonElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();

      await user.tab();
      expect(svgButtonElements[0]).toHaveFocus();
      await user.keyboard('{enter}'); // select

      await user.tab();
      expect(svgButtonElements[1]).toHaveFocus();
      await user.keyboard('{enter}'); // select

      await user.tab();
      expect(svgButtonElements[2]).toHaveFocus();
      await user.keyboard('{enter}'); // select

      assertTargetStatistic({ target: 60, actual: 33, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 33, testId: 'orange-target' });

      await user.keyboard('{enter}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{enter}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{enter}'); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should select / unselect (only small boxes) with keyboard', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgButtonElements = await listScope.findAllByRole('button');

      const user = userEvent.setup();

      await user.tab();
      await user.tab();
      await user.tab();
      expect(svgButtonElements[2]).toHaveFocus();
      await user.keyboard('{enter}'); // select

      await user.tab();
      expect(svgButtonElements[3]).toHaveFocus();
      await user.keyboard('{enter}'); // select

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.keyboard('{enter}'); // unselect

      await user.tab({ shift: true }); // tab back
      await user.keyboard('{enter}'); // unselect

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });
  });

  describe('undo / redo', () => {
    test('should undo / redo selection', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgButtonElements = await listScope.findAllByRole('button');

      const undoElement = screen.getByText(/undo/i);
      const redoElement = screen.getByText(/redo/i);
      const resetElement = screen.getByText(/reset/i);

      expect(undoElement).toBeDisabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeDisabled();

      const user = userEvent.setup();
      await user.click(svgButtonElements[3]); // select
      await user.click(svgButtonElements[4]); // select

      expect(undoElement).toBeEnabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 50, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.click(undoElement); // undo (unselect)

      expect(undoElement).toBeEnabled();
      expect(redoElement).toBeEnabled();
      expect(resetElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.click(redoElement); // redo (select)

      expect(undoElement).toBeEnabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 50, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.click(undoElement); // undo (unselect)
      await user.click(undoElement); // undo (unselect)

      expect(undoElement).toBeDisabled();
      expect(redoElement).toBeEnabled();
      expect(resetElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });

      await user.click(redoElement); // redo (select)

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.click(resetElement); // reset to initial state

      expect(undoElement).toBeDisabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeDisabled();

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });

    test('should clear redo stack upon selection toggle', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgButtonElements = await listScope.findAllByRole('button');

      const undoElement = screen.getByText(/undo/i);
      const redoElement = screen.getByText(/redo/i);
      const resetElement = screen.getByText(/reset/i);

      expect(undoElement).toBeDisabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeDisabled();

      const user = userEvent.setup();
      await user.click(svgButtonElements[3]); // select

      expect(undoElement).toBeEnabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeEnabled();

      await user.click(undoElement);

      expect(undoElement).toBeDisabled();
      expect(redoElement).toBeEnabled();
      expect(resetElement).toBeEnabled();

      await user.click(svgButtonElements[4]); // select

      expect(undoElement).toBeEnabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeEnabled();

      await user.click(resetElement);

      expect(undoElement).toBeDisabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeDisabled();
    });

    test('should undo / redo selection with keyboard', async () => {
      render(<TestApp />);

      const boxListElement = await screen.findByRole('list');
      const listScope = within(boxListElement);
      const svgButtonElements = await listScope.findAllByRole('button');

      const undoElement = screen.getByText(/undo/i);
      const redoElement = screen.getByText(/redo/i);
      const resetElement = screen.getByText(/reset/i);

      expect(undoElement).toBeDisabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeDisabled();

      const user = userEvent.setup();

      await user.tab();
      await user.tab();
      await user.tab();

      await user.tab();
      expect(svgButtonElements[3]).toHaveFocus();
      await user.keyboard('{enter}'); // select

      expect(undoElement).toBeEnabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.tab();
      expect(svgButtonElements[4]).toHaveFocus();
      await user.keyboard('{enter}'); // select

      expect(undoElement).toBeEnabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 50, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.tab({ shift: true }); // tab back
      await user.tab({ shift: true }); // tab back
      await user.tab({ shift: true }); // tab back
      await user.tab({ shift: true }); // tab back

      await user.tab({ shift: true }); // tab back (reset focused)

      await user.tab({ shift: true }); // tab back
      expect(undoElement).toHaveFocus();
      await user.keyboard('{enter}'); // undo (unselect)

      expect(undoElement).toBeEnabled();
      expect(redoElement).toBeEnabled();
      expect(resetElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.tab();
      expect(redoElement).toHaveFocus();
      await user.keyboard('{enter}'); // redo (select)

      expect(undoElement).toBeEnabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 50, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      // HACK: works in real browser
      // await user.tab({ shift: true }); // tab back
      undoElement.focus();
      expect(undoElement).toHaveFocus();
      await user.keyboard('{enter}'); // undo (unselect)
      await user.keyboard('{enter}'); // undo (unselect)

      expect(undoElement).toBeDisabled();
      expect(redoElement).toBeEnabled();
      expect(resetElement).toBeEnabled();

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });

      await user.tab();
      expect(redoElement).toHaveFocus();
      await user.keyboard('{enter}'); // redo (select)

      assertTargetStatistic({ target: 60, actual: 100, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 100, testId: 'orange-target' });

      await user.tab();
      expect(resetElement).toHaveFocus();
      await user.keyboard('{enter}'); // reset to initial state

      expect(undoElement).toBeDisabled();
      expect(redoElement).toBeDisabled();
      expect(resetElement).toBeDisabled();

      assertTargetStatistic({ target: 60, actual: 0, testId: 'small-target' });
      assertTargetStatistic({ target: 60, actual: 0, testId: 'orange-target' });
    });
  });
});
