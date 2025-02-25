import { createContext, useContext, useReducer } from "react";


export interface Device {
  id: string
  name: string
  status: any
}

interface DeviceContextData {
  devices: Array<Device>
  setDevices: (devices: Array<Device>) => void
  addDevice: (device: Device) => void
  removeDevice: (id: string) => void
  updateDevice: (device: Partial<Device>) => void
}

export const DevicesContext = createContext({} as DeviceContextData);

interface ReducerState {
  devices: Array<Device>
}

const reducer = (state: ReducerState, action: any): ReducerState => {
  switch (action.type) {
    case "SET_DEVICES":
      return {
        ...state,
        devices: action.payload
      }
    case "ADD_DEVICE":
      return {
        ...state,
        devices: [...state.devices, action.payload]
      }
    case "REMOVE_DEVICE":
      return {
        ...state,
        devices: state.devices.filter(device => device.name !== action.payload.name)
      }
    case "UPDATE_DEVICE":
      return {
        ...state,
        devices: state.devices.map(device => device.id === action.payload.id ? { ...device, ...action.payload } : device)
      }
  }
  return state
}


export function DevicesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { devices: [] });
  
  const setDevices = (devices: Array<Device>) => {
    dispatch({
      type: "SET_DEVICES",
      payload: devices
    })
  }
  const addDevice = (device: Device) => {
    dispatch({
      type: "ADD_DEVICE",
      payload: device
    })
  }

  const removeDevice = (name: string) => {
    dispatch({
      type: "REMOVE_DEVICE",
      payload: { name }
    })
  }

  const updateDevice = (device: Partial<Device>) => {
    dispatch({
      type: "UPDATE_DEVICE",
      payload: device
    })
  }

  return <DevicesContext.Provider value={{
    devices: state.devices,
    setDevices,
    addDevice,
    removeDevice,
    updateDevice
  }}>
    {children}
  </DevicesContext.Provider>;
}

export const useDevices = () => {
  const context = useContext(DevicesContext);
  if (context === undefined) {
    throw new Error("useDevices must be used within a DevicesProvider");
  }
  return context;
};