import { Store } from '@tanstack/react-store'

export const countStore = new Store({
  count: 0,
})

export const updateCount = () => {
  countStore.setState((state) => {
    return {
      count: state.count + 1,
    }
  })
}
