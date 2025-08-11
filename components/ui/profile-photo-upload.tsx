"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Upload, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { validateImageFile, createImagePreview, resizeImage } from '@/lib/image-utils'

interface ProfilePhotoUploadProps {
  currentPhoto?: string
  userId: string
  onPhotoChange?: (photoUrl: string) => void
  className?: string
  disabled?: boolean
}

export function ProfilePhotoUpload({ 
  currentPhoto, 
  userId, 
  onPhotoChange, 
  className,
  disabled = false 
}: ProfilePhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset error
    setError("")

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    try {
      // Show preview
      const previewUrl = await createImagePreview(file)
      setPreviewUrl(previewUrl)

      // Resize and compress image
      const resizedBlob = await resizeImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.8
      })

      // Convert blob to file
      const resizedFile = new File([resizedBlob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      })

      // Upload resized file
      await uploadFile(resizedFile)
    } catch (error) {
      console.error('Error processing image:', error)
      setError('Failed to process image. Please try again.')
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)

      const response = await fetch('/api/upload/profile-photo', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      // Call callback with new photo URL
      if (onPhotoChange) {
        onPhotoChange(result.url)
      }

    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload photo')
      // Reset preview on error
      setPreviewUrl(currentPhoto || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemovePhoto = () => {
    setPreviewUrl(null)
    if (onPhotoChange) {
      onPhotoChange('')
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar Preview */}
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-gray-200">
            <AvatarImage src={previewUrl || undefined} alt="Profile photo" />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(userId)}
            </AvatarFallback>
          </Avatar>
          
          {/* Upload overlay button */}
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={disabled || isUploading}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            disabled={disabled || isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
          
          {previewUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemovePhoto}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Supported formats: JPEG, PNG, WebP (max 1MB)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Images will be automatically resized and optimized
        </p>
      </div>
    </div>
  )
}
