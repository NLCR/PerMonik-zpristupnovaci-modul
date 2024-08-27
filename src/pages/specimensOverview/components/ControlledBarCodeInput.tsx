import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSpecimensOverviewStore } from '../../../slices/useSpecimensOverviewStore'

const ControlledBarCodeInput = () => {
  const barCodeInput = useSpecimensOverviewStore((state) => state.barCodeInput)
  const setBarCodeInput = useSpecimensOverviewStore(
    (state) => state.setBarCodeInput
  )

  const [localInputState, setLocalInputState] = useState(barCodeInput)

  // used on filters reset
  useSpecimensOverviewStore.subscribe((state) => {
    if (state.barCodeInput === '') {
      setLocalInputState(state.barCodeInput)
    }
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBarCodeInput(localInputState.trim().replaceAll(' ', ''))
    }, 750)

    return () => clearTimeout(timeout)
  }, [localInputState, setBarCodeInput])

  return (
    <TextField
      size="small"
      value={localInputState}
      onChange={(event) => setLocalInputState(event.target.value)}
    />
  )
}

export default ControlledBarCodeInput
