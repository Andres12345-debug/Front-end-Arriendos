import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Person';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { NavItem } from 'react-bootstrap';

export default function TopNavigation() {
  
      const [show, setShow] = React.useState(false);
      const showClass = show ? "show" : "";
  
  

  return (
    <>
      <BottomNavigation
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          bgcolor: 'background.paper',
          zIndex: 1000,
          boxShadow: 2,
        }}
      >
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<RestoreIcon />}
          component={Link}
          to="/land"
        />
        <BottomNavigationAction
          label="Panel"
          value="panel"
          icon={<FolderIcon />}
          component={Link}
          to="/dash"
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
          component={Link}
          to="/favorites"
        />
      </BottomNavigation>

      {/* Espacio para que el contenido no quede oculto */}
      <div style={{ paddingTop: '56px' }}></div>
    </>
  );

}
