"use client"

import { Device, useDevices } from "@/contexts/devices"
import { api } from "@/lib/axios"
import { Badge } from "@whatsapp-bot/ui/components/badge"
import { Button } from "@whatsapp-bot/ui/components/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@whatsapp-bot/ui/components/table"
import { QrCode, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { QRCodeModal } from "./qrcode-modal"

interface DeviceListProps {
  devices: Device[]
}

export default function DeviceList(props: DeviceListProps) {
  const { devices, removeDevice, setDevices, updateDevice } = useDevices()
  const [qrCode, setQrCode] = useState<string | null>(null)

  const handleRemoveDevice = async (name: string) => {
    const device = devices.find(device => device.name === name)
    await api.delete(`/bot/remove/${name}`)
    removeDevice(name)
    toast.success(`Device "${device?.name}" has been removed.`)
  }

  const handleQRCodeModal = async ({ name }: { name: Device['name'] }) => {
    const qrcodeEventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/bot/qrcode/${name}`)
    qrcodeEventSource.onmessage = (event) => {
      const dataParsed = JSON.parse(event.data)
      if (dataParsed.qr) {
        setQrCode(dataParsed.qr)
      }
      console.log(dataParsed)
      if (dataParsed.status) {
        switch (dataParsed.status) {
          case 'offline':
            updateDevice({
              name: dataParsed.name,
              status: 'close'
            })
            break;
          case 'open':
            updateDevice({
              name: dataParsed.name,
              status: 'open'
            })
            break;
          case 'connecting':
            updateDevice({
              name: dataParsed.name,
              status: 'connecting'
            })
            break;
          default:
            break;
        }
      }
    }
  }

  useEffect(() => {
    setDevices(props.devices)
  }, [])

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Apelido</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => {
            let statusLabel = ''

            switch (device.status) {
              case 'open':
                statusLabel = 'Online'
                break;
              case 'close':
                statusLabel = 'Offline'
                break;
              case 'connecting':
                statusLabel = 'Conectando'
                break;
              default:
                break;
            }

            return (
              <TableRow key={device.id}>
                <TableCell>{device.name}</TableCell>
                <TableCell>
                  <Badge variant={device.status as any}>{statusLabel}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveDevice(device.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {device.status !== 'open' && (
                      <Button variant="outline" size="sm" onClick={() => handleQRCodeModal({ name: device.name })}>
                        <QrCode className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <QRCodeModal isOpen={Boolean(qrCode)} onClose={() => setQrCode(null)} qrCode={qrCode || ""} />
    </>
  )
}

