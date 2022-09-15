
![license](https://img.shields.io/github/license/manoldonev/visualization-assignment?style=plastic) ![ci workflow](https://github.com/manoldonev/visualization-assignment/actions/workflows/main.yml/badge.svg) ![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-f69203.svg?logo=pnpm)

Latest deployment available at https://manoldonev.github.io/visualization-assignment/

# Visualization Assignment SPA

Based on my own [React TypeScript App](https://github.com/manoldonev/react-app-template-ts) GitHub template repo:
- Vite
- React 18
- TypeScript
- ESLint
- Prettier
- pre-commit hooks
- CI / deployment GitHub workflows
- Dependency management via [Renovate](https://www.whitesourcesoftware.com/free-developer-tools/renovate/)
- Package management via [pnpm](https://pnpm.io/)


## Technical considerations:
Considered three general approaches for the shape visualization:

 - Using generic html elements (render colored divs as rectangles, use css rounded corners for the circle drawing, borders for ticks, etc) -- would work but it is not a semantic solution
 - Using SVG (SVG elements coexist in the DOM alongside the generic HTML markup, and can be manipulated in standard ways e.g. interactivity, accessibility, css transforms for animation, etc.; would be inappropriate if we had to visualize tens of thousands of data items as each element would allocate memory)
 - Using Canvas API (lower level API than SVG, would be the most appropriate choice if we had to visualize enormous amount of data as canvas operations are committed directly to the screen and do not allocate memory for nodes/elements; however, additional features on top of this solution would require more work -- e.g. for interactivity we would need to calculate the bounding boxes for all items, overlay the scene with a hit-testing layer and calculate which item intersects the current pointer position in order to determine which item to select).

Chosen approach for this particular assignment was to use SVG. 

## UX & Theming

- Mobile-first design (with flexbox wrapping)
- Keyboard support for accessibility (`tab` to navigate, `space` to select/unselect)
- Tailwind (utility-first CSS framework)

## State Management

- Jotai (primitive and flexible state management for React)

## Data (Async State Management)

- REST API (currently using seed data but requests are mocked on the network level via `msw`)
- `@tanstack/react-query`

## Testing

- Unit & Integration testing: Vitest with React Testing Library setup
- Static Analysis: TypeScript & ESLint
- [MSW](https://mswjs.io/) (Mock Service Worker) API mocking (intercepting requests on the network level)
