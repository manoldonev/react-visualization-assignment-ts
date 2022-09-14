import { render, screen } from '@testing-library/react';
import { SmallTargetStatistic } from './SmallTargetStatistic';

const assertSmallTargetStatistic = ({ target, actual }: { target: number; actual: number }): void => {
  const targetElement = screen.getByText(new RegExp(`small target:.+${target}%`, 'i'));
  expect(targetElement).toBeInTheDocument();

  const actualElement = screen.getByText(new RegExp(`actual:.+${actual}%`, 'i'));
  expect(actualElement).toBeInTheDocument();

  const diffElement = screen.getByText(new RegExp(`difference:.+${Math.abs(target - actual)}%`, 'i'));
  expect(diffElement).toBeInTheDocument();
};

describe('SmallTargetStatistic component', () => {
  test('renders without crashing', async () => {
    const targetValue = 0.2;
    render(<SmallTargetStatistic target={targetValue} />);

    assertSmallTargetStatistic({ target: targetValue * 100, actual: 0 });
  });

  test('throws error with invalid input', async () => {
    const targetValue = 10;
    expect(() => render(<SmallTargetStatistic target={targetValue} />)).toThrow(
      /target value should be between 0 and 1/i,
    );
  });
});
