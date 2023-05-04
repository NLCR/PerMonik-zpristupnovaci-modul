import { createStore } from 'store/src/store-engine'
import localStorage from 'store/storages/localStorage'
import eventsPlugin from 'store/plugins/events'

// This file is for managing localstorage
interface StoreWatchJsAPI extends StoreJsAPI {
  // eslint-disable-next-line no-unused-vars
  watch(key: string, callback: (value: never) => void): string
  // eslint-disable-next-line no-unused-vars
  unwatch(watchId: string): void
}

// Store with event plugin types
const store = createStore([localStorage], [eventsPlugin]) as StoreWatchJsAPI

// Methods
const get = <T>(key: string, defaultValue?: T) =>
  store.get(key, defaultValue) as typeof defaultValue

const set = <T>(key: string, value: T) => store.set(key, value) as T

const remove = (key: string) => store.remove(key)

const watch = <T>(key: string, callback: (value: T) => void) =>
  store.watch(key, callback)

const unwatch = (watchId: string) => store.unwatch(watchId)

const Store = {
  get,
  set,
  remove,
  watch,
  unwatch,
}
export default Store
