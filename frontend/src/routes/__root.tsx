import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { loggedUserStore, updateLoggedUser } from '../stores/loggedUser'

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <Outlet />
    </>
  ),
})
// <TanStackRouterDevtools />

const Navbar = () => {
  const loggedUser = useStore(loggedUserStore)
  return (
    <div className="h-[35px] p-3 flex bg-gray-900 text-white items-center justify-between font-bold text-lg">
      <div className="flex gap-4">
        <Link
          to="/"
          className="[&.active]:font-extrabold [&.active]:text-cyan-400"
        >
          Rain
        </Link>{' '}
        <Link
          to="/temperature"
          className="[&.active]:font-extrabold [&.active]:text-cyan-400"
        >
          Temperature
        </Link>{' '}
        <Link
          to="/links"
          className="[&.active]:font-extrabold [&.active]:text-cyan-400"
        >
          Links
        </Link>{' '}
      </div>
      {loggedUser.user ? (
        <div>
          <Link
            to="/login"
            onClick={() => updateLoggedUser(undefined, undefined)}
          >
            Logout
          </Link>
        </div>
      ) : (
        <div>
          <Link
            to="/login"
            className="[&.active]:font-extrabold [&.active]:text-cyan-400"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  )
}
