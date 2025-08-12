import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Person';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function TopNavigation() {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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
          boxShadow: 1
        }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<RestoreIcon />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
        />
        <BottomNavigationAction
          label="Nearby"
          value="nearby"
          icon={<LocationOnIcon />}
        />
        <BottomNavigationAction
          label="Person"
          value="Person"
          icon={<FolderIcon />}
        />
      </BottomNavigation>

      {/* Espacio para que el contenido no quede oculto */}
      <div style={{ paddingTop: '56px' }}></div>
    </>
  );
}
