# JB Pay SDK

UI components registry for Juicebox projects. It distributes custom components, hooks, pages, and other files to any React project.

Built using the [shadcn Registry](https://ui.shadcn.com/docs/registry) architecture.

## Using components

You can use JB Pay SDK components in any React project.

### Requirements

- Tailwind CSS installed & configured
- Using components within properly configured `<WagmiProvider />`.

> **Note:** You can learn how to install & configure `wagmi` from the [documentation](https://wagmi.sh/react/getting-started)

### Available components

All components are placed in `registry/juicebox` directory.

You can locally run `pnpm dev` and then visit `http://localhost:3000` to see their preview.

### Installing component in your project

Run command:
`pnpm dlx shadcn@latest add http://<REGISTRY_URL>/r/<COMPONENT_NAME>.json`

Where:

- `REGISTRY_URL` is publicly available URL of the registry
- `COMPONENT_NAME` is a valid name of the component

Components support both light and dark themes using Tailwind CSS's dark mode feature. Make sure to add the `dark` class to your HTML head element for dark mode support.

## Development

- Follow all recomenndation from the official shadcn Registry documentation.
- Uses `registry.json` file to define components, their files and dependencies.
- All components are placed in `registry/juicebox` directory.
- Run `pnpm registry:build` to build the registry.
- The registry items are served as static files under `public/r/[name].json`.

## Building & Hosting

To build and host the registry:

1. Build the registry:

   ```bash
   pnpm registry:build
   ```

2. Deploy the `public` directory to any static hosting service (e.g., Vercel, Netlify, GitHub Pages).

3. Update your project's registry URL to point to your deployed registry.

## Documentation

Visit the [shadcn documentation](https://ui.shadcn.com/docs/registry) to view the full documentation.
