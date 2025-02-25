import AddDeviceForm from "@/components/add-device-form"
import DeviceList from "@/components/device-list"
import { api } from "@/lib/axios"
import type { Metadata } from "next"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Automações para WhatsApp",
  description: "Automatize seus WhatsApps",
}

export default async function Home() {
  const { data: { bots } } = await api.get('/bot/list')
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Automações WhatsApp</h1>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Adicione um dispositivo</h2>
            <AddDeviceForm />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Dispositivos</h2>
            <DeviceList devices={bots} />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

