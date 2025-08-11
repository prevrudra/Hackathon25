"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/analytics-utils"

interface ExportButtonProps {
  data: any[]
  filename: string
  label?: string
}

export function ExportButton({ data, filename, label = "Export Data" }: ExportButtonProps) {
  const handleExport = () => {
    exportToCSV(data, filename)
  }

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      {label}
    </Button>
  )
}
