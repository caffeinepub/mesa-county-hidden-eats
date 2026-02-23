import { createRouter, RouterProvider, createRoute, createRootRoute } from '@tanstack/react-router';
import DirectoryPage from './pages/DirectoryPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import ProfilePage from './pages/ProfilePage';
import PassportPage from './pages/PassportPage';
import Layout from './components/Layout';

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

// Create restaurant detail route
const restaurantDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/restaurant/$name',
  component: RestaurantDetailPage,
});

// Create profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

// Create passport route
const passportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/passport',
  component: PassportPage,
});

// Create router
const routeTree = rootRoute.addChildren([indexRoute, restaurantDetailRoute, profileRoute, passportRoute]);
const router = createRouter({ routeTree });

function App() {
  return <RouterProvider router={router} />;
}

export default App;
