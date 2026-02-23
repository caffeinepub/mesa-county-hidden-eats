import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute } from '@tanstack/react-router';
import DirectoryPage from './pages/DirectoryPage';
import Layout from './components/Layout';

const queryClient = new QueryClient();

// Create root route with Layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Create directory route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DirectoryPage,
});

// Create router
const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });

function App() {
  return <RouterProvider router={router} />;
}

export default App;
