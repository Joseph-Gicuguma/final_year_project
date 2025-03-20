import React, { useState } from 'react';
import {
  useRecordContext,
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  useGetList,
  useDelete,
  useNotify,
  Button,
} from 'react-admin';
import {
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';

const EventsActions = () => {
  const record = useRecordContext();
  const [viewEventId, setViewEventId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleteOne, { isLoading: isDeleting }] = useDelete();
  const notify = useNotify();

  if (!record) return null;

  const handleDelete = async () => {
    if (confirmDeleteId !== null) {
      try {
        await deleteOne('alika-events', { id: confirmDeleteId });
        notify('Event deleted successfully', { type: 'success' });
      } catch (error) {
        notify('Error deleting event', { type: 'error' });
      }
      setConfirmDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'declined':
        return 'error';
      case 'maybe':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Only show view/delete buttons, the actual dialogs are in the main component
  return (
    <>
      <IconButton onClick={() => setViewEventId(record.id)}>
        <VisibilityIcon />
      </IconButton>
      <IconButton onClick={() => setConfirmDeleteId(record.id)}>
        <DeleteIcon color="error" />
      </IconButton>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button label="Cancel" onClick={() => setConfirmDeleteId(null)} />
          <Button label="Delete" onClick={handleDelete} color="error" disabled={isDeleting} />
        </DialogActions>
      </Dialog>

      {/* View Event Detail Dialog */}
      <Dialog open={viewEventId !== null} onClose={() => setViewEventId(null)} maxWidth="md" fullWidth>
        {record && (
          <>
            <DialogTitle>{record.title}</DialogTitle>
            <DialogContent>
              <Box mb={2}>
                <Typography variant="subtitle1">Host</Typography>
                <Typography>
                  {record.host.fullName} ({record.host.email})
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1">Details</Typography>
                <Typography>{record.description}</Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1">Date & Time</Typography>
                <Typography>
                  {format(new Date(record.date), 'MMM d, yyyy')} at {record.time}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1">Location</Typography>
                <Typography>{record.location}</Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1">Invitations</Typography>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Guest</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {record.invitations && record.invitations.map((invitation: any) => (
                        <TableRow key={invitation.id}>
                          <TableCell>{invitation.guestName}</TableCell>
                          <TableCell>{invitation.guestEmail}</TableCell>
                          <TableCell>
                            <Chip
                              label={invitation.status}
                              color={getStatusColor(invitation.status) as any}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button label="Close" onClick={() => setViewEventId(null)} />
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

// Create a custom data provider to handle the nested API response
const AlikaList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="host.fullName" label="Host" />
        <DateField source="date" />
        <TextField source="time" />
        <TextField source="location" />
        <BooleanField source="isActive" label="Status" />
        <EventsActions />
      </Datagrid>
    </List>
  );
};

export default AlikaList; 