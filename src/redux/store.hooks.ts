import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { IStoreState } from './store.types'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// export const useAppSelector = useSelector.withTypes<RootState>()

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useReduxStore = <K extends keyof RootState>(key: K): RootState[K] => useAppSelector((state) => state[key]);
export const useRecordCountStore = () => useAppSelector((storeState: IStoreState) => storeState).general.record_count
