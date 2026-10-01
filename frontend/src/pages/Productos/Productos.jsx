import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Inventario/Inventario.css";
import Tablas from "../../components/Tablas/Tablas";
import {
  actualizarPrecios,
  getCategorias,
  getProductos,
  getProveedores,
} from "../../api/productos";

const Productos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [tipoAjuste, setTipoAjuste] = useState("porcentaje");
  const [valorAjuste, setValorAjuste] = useState("");
  const [mensajeAjuste, setMensajeAjuste] = useState("");
  const [guardandoAjuste, setGuardandoAjuste] = useState(false);
  const [error, setError] = useState("");

  const cargar = async (q = busqueda, cat = categoria, prov = proveedor) => {
    try {
      setProductos(await getProductos({ q, categoria: cat, proveedor: prov }));
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    let vigente = true;
    Promise.all([getProductos(), getCategorias(), getProveedores()])
      .then(([listaProductos, listaCategorias, listaProveedores]) => {
        if (!vigente) return;
        setProductos(listaProductos);
        setCategorias(listaCategorias);
        setProveedores(listaProveedores);
      })
      .catch((e) => { if (vigente) setError(e.message); });
    return () => { vigente = false; };
  }, []);

  const aplicarAjuste = async (e) => {
    e.preventDefault();
    setError("");
    setMensajeAjuste("");
    setGuardandoAjuste(true);
    try {
      const resultado = await actualizarPrecios({
        tipo: tipoAjuste,
        valor: Number(valorAjuste),
        categoria,
        proveedor,
      });
      setMensajeAjuste(`Se actualizaron ${resultado.actualizados} productos.`);
      setValorAjuste("");
      await cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardandoAjuste(false);
    }
  };

  return (
    <div className="inventario-container">
      <div className="header-inventario">
        <h1 className="titulo-izq">Todos los productos</h1>
        <form className="search-box" onSubmit={(e) => { e.preventDefault(); cargar(); }}>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>
      <div className="table-content-wrapper">
        {error && <p className="text-danger">{error}</p>}
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h4 className="fw-bold mb-3">Actualización masiva de precios</h4>
          <form onSubmit={aplicarAjuste} className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Tipo de ajuste</label>
              <select className="form-select" value={tipoAjuste} onChange={(e) => setTipoAjuste(e.target.value)}>
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto">Monto fijo ($)</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Aumento / descuento</label>
              <input
                className="form-control"
                type="number"
                step="0.01"
                value={valorAjuste}
                onChange={(e) => setValorAjuste(e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Categoría</label>
              <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas</option>
                {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Proveedor</label>
              <select className="form-select" value={proveedor} onChange={(e) => setProveedor(e.target.value)}>
                <option value="">Todos</option>
                {proveedores.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" type="submit" disabled={guardandoAjuste}>
                {guardandoAjuste ? "Aplicando..." : "Aplicar precios"}
              </button>
            </div>
          </form>
          <small className="text-secondary mt-2">
            Usá valores positivos para aumentar y negativos para descontar. La selección se aplica al inventario completo que coincida con ambos filtros.
          </small>
          {mensajeAjuste && <p className="text-success mb-0 mt-2">{mensajeAjuste}</p>}
          <button className="btn btn-link align-self-start px-0 mt-1" onClick={() => cargar()}>
            Actualizar listado según estos filtros
          </button>
        </div>
        <Tablas
          productos={productos}
          onRefresh={() => cargar()}
          onAgregar={() => navigate("/nuevo-producto")}
        />
      </div>
    </div>
  );
};

export default Productos;
