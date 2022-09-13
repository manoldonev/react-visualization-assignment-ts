import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useInitialRender } from '../hooks/useInitialRender';
import { selectionAtom } from '../atoms/selectionAtom';
import { getShapes } from '../models/shape';

const formatPercent = (value: number): string => {
  return `${value.toLocaleString(undefined, { style: 'percent' })}`;
};

const validateInput = (value: number): void => {
  if (value < 0 || value > 1) {
    throw new Error('Target value should be between 0 and 1');
  }
};

const scaleWidth = 132;

const SmallTargetStatistic = ({ target, className = '' }: { target: number; className?: string }): JSX.Element => {
  validateInput(target);

  const [selection] = useAtom(selectionAtom);
  const totalCount = selection.size;
  let smallCount = 0;
  let actual = 0;
  if (totalCount > 0) {
    const shapes = getShapes();
    smallCount = shapes.filter((shape) => selection.has(shape.id) && shape.size === 'small').length;

    actual = smallCount / totalCount;
  }

  const isInitialRender = useInitialRender();
  const targetTextElement = useRef<SVGTextElement | null>(null);
  const targetTickElement = useRef<SVGLineElement | null>(null);
  const actualTextElement = useRef<SVGTextElement | null>(null);
  const actualTickElement = useRef<SVGLineElement | null>(null);
  const diffTextElement = useRef<SVGTextElement | null>(null);

  useEffect(() => {
    const targetTickX = target * scaleWidth;

    if (targetTickElement.current != null) {
      targetTickElement.current.setAttribute('x1', targetTickX.toFixed(0));
      targetTickElement.current.setAttribute('x2', targetTickX.toFixed(0));
    }

    if (targetTextElement.current != null) {
      targetTextElement.current.setAttribute(
        'x',
        (targetTickX - targetTextElement.current.getComputedTextLength() / 2).toFixed(0),
      );
    }
  }, [target]);

  useEffect(() => {
    const actualTickX = actual * scaleWidth;

    if (actualTickElement.current != null) {
      const transformValue = actualTickX.toFixed(0);
      actualTickElement.current.style.transform = `translateX(${transformValue}px)`;
    }

    if (actualTextElement.current != null) {
      const transformValue = (actualTickX - actualTextElement.current.getComputedTextLength() / 2).toFixed(0);
      actualTextElement.current.style.transform = `translateX(${transformValue}px)`;
    }

    if (diffTextElement.current != null) {
      const transformValue = (actualTickX - diffTextElement.current.getComputedTextLength() / 2).toFixed(0);
      diffTextElement.current.style.transform = `translateX(${transformValue}px)`;
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

        <text
          ref={actualTextElement}
          y={56}
          className={`fill-fuchsia-400 ${isInitialRender ? 'transition-none' : 'transition-transform'} duration-1000`}
        >
          Actual: {formatPercent(actual)}
        </text>
        <text
          ref={diffTextElement}
          y={74}
          className={`fill-fuchsia-400 ${isInitialRender ? 'transition-none' : 'transition-transform'} duration-1000`}
        >
          Difference: {formatPercent(Math.abs(target - actual))}
        </text>
      </svg>
    </div>
  );
};

export { SmallTargetStatistic };
