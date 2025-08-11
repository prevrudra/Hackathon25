/**
 * Utility functions for image processing and validation
 */

export interface ImageResizeOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

/**
 * Resize and compress an image file
 */
export function resizeImage(
  file: File, 
  options: ImageResizeOptions = {}
): Promise<Blob> {
  const { maxWidth = 400, maxHeight = 400, quality = 0.8 } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Canvas to blob conversion failed'))
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => reject(new Error('Image load failed'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
    }
  }

  // Check file size (1MB limit)
  const maxSize = 1 * 1024 * 1024 // 1MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 1MB.'
    }
  }

  return { valid: true }
}

/**
 * Generate a preview URL for a file
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
