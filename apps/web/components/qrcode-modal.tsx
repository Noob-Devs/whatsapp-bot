"use client"

import { Button } from "@whatsapp-bot/ui/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@whatsapp-bot/ui/components/dialog"
import { QRCodeSVG } from "qrcode.react"

interface QRCodeModalProps {
  isOpen: boolean
  qrCode: string
  onClose: () => void
}

export function QRCodeModal({ isOpen, onClose, qrCode }: QRCodeModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {qrCode ? (
            <QRCodeSVG value={qrCode} size={256} className="w-48 h-48" />
          ) : (
            <div className="w-48 h-48 bg-gray-200 animate-pulse flex items-center justify-center">
              Loading QR Code...
            </div>
          )}
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

