import { Store } from '@tanstack/react-store'

export const loggedUserStore = new Store<{
  user: string | null | undefined
  jwt: string | null | undefined
}>({
  user: localStorage.getItem('user'),
  jwt: localStorage.getItem('jwt'),
})

export const updateLoggedUser = (
  user: string | undefined,
  jwt: string | undefined,
) => {
  loggedUserStore.setState((state) => {
    return {
      user,
      jwt,
    }
  })
}
