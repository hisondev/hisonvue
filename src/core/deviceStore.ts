// deviceStore.ts
import { ref, readonly } from 'vue'
import type { DeviceType } from '../types'
import { getDeviceType } from '../utils'

const currentDevice = ref<DeviceType>('pc')

export const useDevice = () => readonly(currentDevice)

export const initializeDeviceListener = () => {
  if (typeof window === 'undefined') return

  const updateDevice = () => {
    const newDevice = getDeviceType(window.innerWidth)
    if (currentDevice.value !== newDevice) {
      currentDevice.value = newDevice
    }
  }

  updateDevice()
  window.addEventListener('resize', () => {
    requestAnimationFrame(updateDevice)
  })
}
