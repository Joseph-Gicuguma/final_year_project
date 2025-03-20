import React from 'react';
import { Box, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';

const Sidebar = () => {
  return (
    <Box>
      <ListItem component={Link} to="/alika">
        <ListItemButton>
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Alika Events" />
        </ListItemButton>
      </ListItem>
    </Box>
  );
};

export default Sidebar; 