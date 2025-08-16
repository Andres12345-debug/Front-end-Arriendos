import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RestoreIcon from '@mui/icons-material/Restore';
import FolderIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useThemeContext } from '../../components/Theme/ThemeContext';
import { Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

export default function TopNavigation() {
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  // 🔎 Estado del buscador
  const [busqueda, setBusqueda] = React.useState("");

  // ⏳ Debounce para evitar navegar en cada tecla
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (busqueda.trim() !== "") {
        navigate(`/land/buscar/${busqueda}`);
      }
    }, 600); // espera 600ms después de escribir

    return () => {
      clearTimeout(handler);
    };
  }, [busqueda, navigate]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Botones izquierda */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '& .MuiSvgIcon-root': {
                color: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.text.secondary
                    : theme.palette.common.white,
              },
            }}
          >
            <IconButton component={Link} to="/land" color="inherit">
              <RestoreIcon />
            </IconButton>
            <IconButton component={Link} to="/land" color="inherit">
              <FolderIcon />
            </IconButton>
            <IconButton component={Link} to="/land" color="inherit">
              <FavoriteIcon />
            </IconButton>
            <IconButton component={Link} to="/land" color="inherit">
              <HomeIcon />
            </IconButton>
          </Box>

          {/* 🔎 Buscador con búsqueda automática */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar…"
              inputProps={{ 'aria-label': 'buscar' }}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Search>

          {/* 🌙 Modo claro/oscuro */}
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Espaciador para que el contenido no quede debajo */}
      <Toolbar />
    </>
  );
}
