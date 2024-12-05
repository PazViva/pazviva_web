import { useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../firebase/messaging';
import { toast } from 'react-toastify';

export function useNotifications() {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          console.log('Notificações configuradas com sucesso');
          
          onMessageListener()
            .then((payload) => {
              toast.info(payload.notification.body, {
                icon: '🙏',
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            })
            .catch((err) => console.error('Erro ao receber mensagem:', err));
        }
      } catch (error) {
        console.error('Erro ao configurar notificações:', error);
      }
    };

    if ('Notification' in window) {
      setupNotifications();
    }
  }, []);
}