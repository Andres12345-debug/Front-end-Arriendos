import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Vigilante } from "../app/seguridad/Vigilante";

// Lazy imports (páginas públicas)
const LazySesion = lazy(() =>
  import("../app/public/Sesion").then(() => ({
    default: require("../app/public/Sesion").Sesion
  }))
);
const LazyRegistro = lazy(() =>
  import("../app/public/Registro").then(() => ({
    default: require("../app/public/Registro").Registro
  }))
);
const LazyError = lazy(() =>
  import("../app/shared/Error").then(() => ({
    default: require("../app/shared/Error").Error
  }))
);

// Lazy imports (área pública y privada)
const LazyTableroVistaPublica = lazy(() =>
  import("../app/pages/TableroVistaPublica").then(() => ({
    default: require("../app/pages/TableroVistaPublica").TableroVistaPublica
  }))
);
const LazyViviendas = lazy(() =>
  import("../app/private/contenedor/widgets/CarrucelCasas")
);

const LazyTablero = lazy(() =>
  import("../app/pages/TableroPrincipal").then(() => ({
    default: require("../app/pages/TableroPrincipal").TableroPrincipal
  }))
);

export const RuteoPrincipal = () => {
  return (
    <Routes>
      {/* Área pública */}
      <Route path="/land" element={<LazyTableroVistaPublica />}>
        {/* Ruta index: /land */}
        <Route index element={<LazyViviendas />} />
        {/* Ruta hija: /land/welcome */}
        <Route path="welcome" element={<LazyViviendas />} />
      </Route>

      <Route path="/login" element={<LazySesion />} />
      <Route path="/register" element={<LazyRegistro />} />

      {/* Área privada (protegida por Vigilante) */}
      <Route element={<Vigilante />}>
        <Route path="/dash/*" element={<LazyTablero />} />
      </Route>

      {/* Obligatorias */}
      <Route path="/" element={<LazyTableroVistaPublica />} />
      <Route path="*" element={<LazyError />} />
    </Routes>
  );
};
