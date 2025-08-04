import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { PaperPlane } from '@phosphor-icons/react'
import { useT } from '../contexts/TranslationContext'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t } = useT()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t('contact.processing'))
      return
    }

    setIsSubmitting(true)

    // Simulate email sending (in real implementation, this would send to support@miky.ai)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      })
      
      onClose()
      
      // Show success message
      toast.success(t('contact.success'))
      
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{t('contact.title')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">{t('contact.name')} *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('contact.namePlaceholder')}
              className="md:placeholder:text-sm placeholder:text-xs"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-medium">{t('contact.email')} *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t('contact.emailPlaceholder')}
              className="md:placeholder:text-sm placeholder:text-xs"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-medium">{t('contact.message')} *</label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder={t('contact.messagePlaceholder')}
              className="md:placeholder:text-sm placeholder:text-xs"
              rows={4}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('modals.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  {t('contact.processing')}
                </>
              ) : (
                <>
                  <PaperPlane className="w-4 h-4 mr-2" />
                  {t('contact.send')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}