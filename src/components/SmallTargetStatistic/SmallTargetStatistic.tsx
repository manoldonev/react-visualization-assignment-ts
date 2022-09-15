import { useEffect, useRef } from 'react';
import { useInitialRender } from '../../hooks/useInitialRender';

const formatPercent = (value: number): string => {
  return `${value.toLocaleString(undefined, { style: 'percent' })}`;
};

const validateInput = (value: number, propName: string): void => {
  if (value < 0 || value > 1) {
    throw new Error(`${propName} value should be between 0 and 1`);
  }
};

const scaleWidth = 132;

const SmallTargetStatistic = ({
  target,
  actual = 0,
  className = '',
}: {
  target: number;
  actual?: number;
  className?: string;
}): JSX.Element => {
  validateInput(target, 'Target');
  validateInput(actual, 'Actual');

  const isInitialRender = useInitialRender();
  const targetTextElement = useRef<SVGTextElement | null>(null);
  const targetTickElement = useRef<SVGLineElement | null>(null);
  const actualGroupElement = useRef<SVGGElement | null>(null);
  const actualTickElement = useRef<SVGLineElement | null>(null);
  const diffGroupElement = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const targetTickX = target * scaleWidth;

    if (targetTickElement.current !== null) {
      targetTickElement.current.setAttribute('x1', targetTickX.toFixed(0));
      targetTickElement.current.setAttribute('x2', targetTickX.toFixed(0));
    }

    if (targetTextElement.current !== null) {
      targetTextElement.current.setAttribute(
        'x',
        (targetTickX - targetTextElement.current.getComputedTextLength() / 2).toFixed(0),
      );
    }
  }, [target]);

  useEffect(() => {
    const actualTickX = actual * scaleWidth;

    if (actualTickElement.current !== null) {
      const transformValue = actualTickX.toFixed(0);
      actualTickElement.current.style.transform = `translateX(${transformValue}px)`;
    }

    if (actualGroupElement.current !== null) {
      const textElement = actualGroupElement.current.firstElementChild as SVGTextElement | null;

      if (textElement !== null) {
        const transformValue = (actualTickX - textElement.getComputedTextLength() / 2).toFixed(0);
        actualGroupElement.current.style.transform = `translateX(${transformValue}px)`;
      }
    }

    if (diffGroupElement.current !== null) {
      const textElement = diffGroupElement.current.firstElementChild as SVGTextElement | null;

      if (textElement !== null) {
        const transformValue = (actualTickX - textElement.getComputedTextLength() / 2).toFixed(0);
        diffGroupElement.current.style.transform = `translateX(${transformValue}px)`;
      }
    }
  }, [actual]);

  return (
    <div className={className}>
      <svg className="h-24 w-72" viewBox="-72 0 288 96">
        <text ref={targetTextElement} y={12} className="fill-black">
          Small Target: {formatPercent(target)}
        </text>
        <line ref={targetTickElement} y1={16} y2={28} className="stroke-black stroke-[3]" shapeRendering="crispEdges" />
        <line x1={0} x2={scaleWidth} y1={28.5} y2={28.5} shapeRendering="crispEdges" strokeWidth={1} stroke="black" />
        <line
          ref={actualTickElement}
          y1={28}
          y2={40}
          className="stroke-fuchsia-400 stroke-[3] transition-transform duration-1000"
          shapeRendering="crispEdges"
        />

        {/* HACK: using SVG containers as css transform on SVG text elements does not work in Safari */}
        <g
          ref={actualGroupElement}
          className={`${isInitialRender ? 'transition-none' : 'transition-transform'} duration-1000`}
        >
          <text y={56} className="fill-fuchsia-400">
            Actual: {formatPercent(actual)}
          </text>
        </g>

        {/* HACK: using SVG containers as css transform on SVG text elements does not work in Safari */}
        <g
          ref={diffGroupElement}
          className={`${isInitialRender ? 'transition-none' : 'transition-transform'} duration-1000`}
        >
          <text y={74} className="fill-fuchsia-400">
            Difference: {formatPercent(Math.abs(target - actual))}
          </text>
        </g>
      </svg>
    </div>
  );
};

export { SmallTargetStatistic };
