import { Outlet } from "react-router-dom";
import BasicTable from "../shared/components/nav/Nav";

export const TableroVistaPublica = () => {
  return (
    <div>
      <BasicTable />      
      {/* Aquí se inyectarán los hijos como Buscador */}
      <Outlet />
    </div>
  );
};
