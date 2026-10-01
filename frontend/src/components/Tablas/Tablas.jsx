import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { actualizarStock, eliminarProducto } from "../../api/productos";

const formatoMoneda = (valor) =>
  Number(valor || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

const etiquetaStock = (producto) => {
  const unidad = producto.tipo_venta === "peso" ? "kg" : "u";
  if (producto.estado_stock === "sin_stock") return { clase: "text-danger", texto: `0 ${unidad}` };
  if (producto.estado_stock === "critico") return { clase: "text-danger", texto: `${producto.stock} ${unidad} · crítico` };
  if (producto.estado_stock === "minimo") return { clase: "text-warning", texto: `${producto.stock} ${unidad} · mínimo` };
  return { clase: "text-success", texto: `${producto.stock} ${unidad}` };
};

const Tablas = ({ productos = [], onRefresh, onAgregar }) => {
  const navigate = useNavigate();
  const [editandoStock, setEditandoStock] = useState(null);
  const [stockValor, setStockValor] = useState("");
  const [error, setError] = useState("");

  const comenzarStock = (producto) => {
    setEditandoStock(producto.id);
    setStockValor(String(producto.stock));
    setError("");
  };

  const guardarStock = async (id) => {
    try {
      await actualizarStock(id, Number(stockValor));
      setEditandoStock(null);
      onRefresh?.();
    } catch (e) {
      setError(e.message);
    }
  };

  const borrar = async (producto) => {
    const ok = window.confirm(`¿Eliminar "${producto.nombre}"?`);
    if (!ok) return;
    try {
      await eliminarProducto(producto.id);
      onRefresh?.();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark m-0">Inventario general</h4>
        <button className="btn btn-primary fw-semibold px-3 py-2" onClick={onAgregar}>
          <i className="bi bi-plus-lg me-1"></i> Agregar producto
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="py-3 text-secondary text-uppercase fs-7 fw-semibold">Código</th>
              <th className="py-3 text-secondary text-uppercase fs-7 fw-semibold">Producto</th>
              <th className="py-3 text-secondary text-uppercase fs-7 fw-semibold">Categoría</th>
              <th className="py-3 text-secondary text-uppercase fs-7 fw-semibold">Stock</th>
              <th className="py-3 text-secondary text-uppercase fs-7 fw-semibold">Costo</th>
              <th className="py-3 text-secondary text-uppercase fs-7 fw-semibold">Precio</th>
              <th className="py-3 text-secondary text-uppercase fs-7 fw-semibold text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-secondary">
                  No hay productos para mostrar. Cargá el primero con “Agregar producto”.
                </td>
              </tr>
            )}
            {productos.map((producto) => {
              const stock = etiquetaStock(producto);
              return (
                <tr key={producto.id}>
                  <td className="fw-semibold text-secondary">{producto.codigo_barras}</td>
                  <td>
                    <div className="fw-bold text-dark">{producto.nombre}</div>
                    <small className="text-secondary">{producto.marca || "Sin marca"} · {producto.tipo_venta}</small>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border px-2 py-1">{producto.categoria}</span>
                  </td>
                  <td>
                    {editandoStock === producto.id ? (
                      <div className="d-flex gap-2 align-items-center">
                        <input
                          className="form-control form-control-sm"
                          style={{ width: 90 }}
                          type="number"
                          min="0"
                          step={producto.tipo_venta === "peso" ? "0.01" : "1"}
                          value={stockValor}
                          onChange={(e) => setStockValor(e.target.value)}
                        />
                        <button className="btn btn-sm btn-success" onClick={() => guardarStock(producto.id)}>OK</button>
                        <button className="btn btn-sm btn-light" onClick={() => setEditandoStock(null)}>x</button>
                      </div>
                    ) : (
                      <button className={`btn btn-link p-0 fw-semibold ${stock.clase}`} onClick={() => comenzarStock(producto)}>
                        {stock.texto}
                      </button>
                    )}
                  </td>
                  <td className="fw-semibold">{formatoMoneda(producto.costo)}</td>
                  <td className="fw-semibold">{formatoMoneda(producto.precio_venta)}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-link text-primary p-1 me-1"
                      onClick={() => navigate(`/nuevo-producto/${producto.id}`)}
                      title="Editar producto"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-link text-danger p-1"
                      onClick={() => borrar(producto)}
                      title="Eliminar producto"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tablas;
