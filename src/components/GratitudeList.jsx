import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Box } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getAllGratitudes } from '../services/gratitudeService';

export default function GratitudeList() {
  const [gratitudes, setGratitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    const loadGratitudes = async () => {
      if (!user) return;
      
      try {
        const loadedGratitudes = await getAllGratitudes(user.uid);
        if (mounted) {
          setGratitudes(loadedGratitudes);
        }
      } catch (error) {
        console.error('Erro ao carregar lista de gratidões:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadGratitudes();

    return () => {
      mounted = false;
    };
  }, [user]);

  const formatDate = (date) => {
    if (!date) return '';
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 4, textAlign: 'center' }}>
        Seu Histórico de Gratidão
      </Typography>
      <Paper elevation={3} sx={{ bgcolor: '#FAEBD7', borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {gratitudes.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="Comece sua jornada de gratidão hoje!"
                  secondary="Registre sua primeira gratidão no Dashboard"
                  primaryTypographyProps={{ 
                    align: 'center',
                    color: 'primary',
                    sx: { fontWeight: 500 }
                  }}
                  secondaryTypographyProps={{ 
                    align: 'center',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
            ) : (
              gratitudes.map((item, index) => (
                <Box key={item.id}>
                  <ListItem 
                    sx={{ 
                      py: 3,
                      px: 4,
                      bgcolor: index % 2 === 0 ? '#F5F5DC' : '#FAEBD7'
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      secondary={formatDate(item.createdAt)}
                      primaryTypographyProps={{ 
                        color: 'text.primary',
                        sx: { 
                          mb: 1,
                          fontSize: '1.1rem',
                          fontWeight: 500
                        }
                      }}
                      secondaryTypographyProps={{ 
                        color: 'text.secondary',
                        sx: { 
                          fontStyle: 'italic',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                  {index < gratitudes.length - 1 && (
                    <Divider sx={{ opacity: 0.5 }} />
                  )}
                </Box>
              ))
            )}
          </List>
        )}
      </Paper>
    </Container>
  );
}