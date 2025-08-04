import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ContactModal } from './ContactModal'
import { useT } from '../contexts/TranslationContext'

interface FooterProps {
  onAdminAccess: () => void
  onLegalPageSelect?: (page: 'terms' | 'privacy' | 'cookies') => void
}

export function Footer({ onAdminAccess, onLegalPageSelect }: FooterProps) {
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const { t } = useT()

  const handleAdminLogin = () => {
    if (adminPassword === '1234') {
      setShowAdminDialog(false)
      setAdminPassword('')
      onAdminAccess()
      toast.success('Admin access granted')
    } else {
      toast.error('Invalid password')
    }
  }

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-muted-foreground">
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs text-muted-foreground"
              onClick={() => onLegalPageSelect?.('terms')}
            >
              {t('footer.terms')}
            </Button>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs text-muted-foreground"
              onClick={() => onLegalPageSelect?.('privacy')}
            >
              {t('footer.privacy')}
            </Button>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs text-muted-foreground"
              onClick={() => onLegalPageSelect?.('cookies')}
            >
              {t('footer.cookies')}
            </Button>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs text-muted-foreground"
              onClick={() => setShowContactModal(true)}
            >
              {t('footer.contact')}
            </Button>
            
            <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground">
                  {t('footer.admin')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Admin Login</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="mt-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAdminLogin()
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAdminDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAdminLogin}>
                      Login
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-xs text-muted-foreground">
            {t('footer.copyright')}
          </div>
        </div>
      </div>
      
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </footer>
  )
}