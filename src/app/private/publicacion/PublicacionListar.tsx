import { useEffect, useState } from "react";
import { URLS } from "../../../utilities/dominios/urls";
import { ServicioGet } from "../../../services/ServicioGet";
import { Link } from "react-router-dom";
import { Publicacion } from "../../../models/Publicacion";

export const PublicacionListar = () => {
    const [arrPubli, setArrRoles] = useState<Publicacion[]>([]);

    const consultar = async () => {
        const urlServicio = URLS.URL_BASE + URLS.LISTAR_PUBLICACION;
        const resultado = await ServicioGet.peticionGet(urlServicio);
        setArrRoles(Array.isArray(resultado) ? resultado : []); // Asegura que sea un arreglo
    };

    useEffect(() => {
        consultar();
    }, []);

    return (
        <div className="m-4">
            <div className="row">
                <div className="col-4">
                    <h4 className="fst-italic fw-bold display-4">TODAS LAS PUBLICACIONES</h4>
                </div>
                <div className="col-8">
                    <div className="d-flex">
                        <ol className="breadcrumb breadcrumb-dark breadcrumb-transparent">
                            <li className="breadcrumb-item">
                                <Link to="/dash" className="text-warning">
                                    <i className="fa fa-home"></i>
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="#">Role</a>
                            </li>
                            <li className="breadcrumb-item text-warning">Listar</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="col-md-10">
                    <table className="table table-sm table-striped table-hover">
                        <thead className="table-primary text-white fs-2">
                            <tr>
                                <th style={{ width: "5%" }} className="text-center">Id</th>
                                <th style={{ width: "20%" }} className="text-center">Titulo</th>
                                <th style={{ width: "20%" }} className="text-center">Sub Titulo</th>
                                <th style={{ width: "20%" }} className="text-center">Cuerpo</th>
                                <th style={{ width: "10%" }} className="text-center">Imagen</th>
                                <th style={{ width: "30%" }} className="text-center">Fecha Publicacion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arrPubli.map((objPubli, indice) => (
                                    <tr key={indice}>
                                        <td className="text-center">{objPubli.codPublicacion}</td>
                                        <td className="text-center">{objPubli.tituloPublicacion}</td>
                                        <td className="text-center">{objPubli.metros}</td>
                                        <td className="text-center">{objPubli.contenidoPublicacion}</td>

                                        {/* Mostrar la imagen en una celda <td> */}
                                        <td className="text-center">
                                            {objPubli.imagenUrl ? (
                                                <img
                                                    src={URLS.URL_BASE + objPubli.imagenUrl} // Asegúrate de que esta URL esté bien formada
                                                    alt="Imagen de la publicación"
                                                    style={{ width: "100px", height: "auto" }} // Establece el tamaño que desees
                                                />
                                            ) : (
                                                "No disponible"
                                            )}
                                        </td>

                                        <td className="text-center">
                                            {new Date(objPubli.fechaCreacionPublicacion).toLocaleString("es-ES", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
