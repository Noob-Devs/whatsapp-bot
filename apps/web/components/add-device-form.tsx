"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@whatsapp-bot/ui/components/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@whatsapp-bot/ui/components/form"
import { Input } from "@whatsapp-bot/ui/components/input"
import { toast } from "sonner"
import axios from "axios"
import { useDevices } from "@/contexts/devices"

const formSchema = z.object({
  deviceName: z.string().min(2, {
    message: "Device name must be at least 2 characters.",
  }),
})

export default function AddDeviceForm() {
  const { addDevice } = useDevices()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceName: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data } = await axios.post("http://localhost:3333/v1/bot/init", { name: values.deviceName })
    addDevice(data.device)
    toast.success("Device added", {
      description: `New device "${values.deviceName}" has been added.`,
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="deviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apelido</FormLabel>
              <FormControl>
                <Input placeholder="Apelido do dispositivo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">+ Adicionar Dispositivo</Button>
      </form>
    </Form>
  )
}

