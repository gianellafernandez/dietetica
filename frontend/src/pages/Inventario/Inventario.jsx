import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventario.css";
import Tablas from "../../components/Tablas/Tablas";
import InfoProds from "../../components/InfoProds/InfoProds";
import { getProductos, getResumenInventario } from "../../api/productos";

const Inventario = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState("");

  const cargar = useCallback(async (q = busqueda, f = filtro) => {
    try {
      const [lista, totals] = await Promise.all([
        getProductos({ q, filtro: f }),
        getResumenInventario(),
      ]);
      setProductos(lista);
      setResumen(totals);
      setError("");
    } catch {
      setError("No se pudo conectar con el backend. ¿Está corriendo Flask en el puerto 5000?");
    }
  }, [busqueda, filtro]);

  useEffect(() => {
    let vigente = true;
    Promise.all([
      getProductos({ q: busqueda, filtro }),
      getResumenInventario(),
    ])
      .then(([lista, totals]) => {
        if (!vigente) return;
        setProductos(lista);
        setResumen(totals);
        setError("");
      })
      .catch(() => {
        if (vigente) {
          setError("No se pudo conectar con el backend. ¿Está corriendo Flask en el puerto 5000?");
        }
      });
    return () => { vigente = false; };
  }, [busqueda, filtro]);

  const buscar = (e) => {
    e.preventDefault();
    cargar(busqueda, filtro);
  };

  return (
    <div className="inventario-container">
      <div className="header-inventario">
        <h1 className="titulo-izq">Inventario</h1>
        <form className="search-box" onSubmit={buscar}>
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      <div className="table-content-wrapper">
        {error && <p className="text-danger mb-3">{error}</p>}

        <div className="filtros-inventario">
          <button className={`filtro-btn ${filtro === "" ? "activo" : ""}`} onClick={() => setFiltro("")}>Todos</button>
          <button className={`filtro-btn ${filtro === "sin_stock" ? "activo" : ""}`} onClick={() => setFiltro("sin_stock")}>Sin stock</button>
          <button className={`filtro-btn ${filtro === "bajo_minimo" ? "activo" : ""}`} onClick={() => setFiltro("bajo_minimo")}>Bajo mínimo</button>
          <button className={`filtro-btn ${filtro === "critico" ? "activo" : ""}`} onClick={() => setFiltro("critico")}>Crítico</button>
          <button className={`filtro-btn ${filtro === "proximo_vencer" ? "activo" : ""}`} onClick={() => setFiltro("proximo_vencer")}>Próximos a vencer</button>
        </div>

        <InfoProds resumen={resumen} />
        <Tablas
          productos={productos}
          onRefresh={() => cargar()}
          onAgregar={() => navigate("/nuevo-producto")}
        />
      </div>
    </div>
  );
};

export default Inventario;
