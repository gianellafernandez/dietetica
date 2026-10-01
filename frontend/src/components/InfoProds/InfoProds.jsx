import "./InfoProds.css";

const formatoMoneda = (valor) =>
  Number(valor || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

const InfoProds = ({ resumen }) => {
  const data = resumen || {
    total_productos: 0,
    stock_critico: 0,
    stock_minimo: 0,
    proximos_vencer: 0,
    valor_costo: 0,
    valor_venta: 0,
  };

  return (
    <div className="info-prods">
      <div className="info-card">
        <p className="titulo">TOTAL PRODUCTOS</p>
        <h2>{data.total_productos}</h2>
      </div>

      <div className="info-card">
        <p className="titulo">STOCK CRÍTICO</p>
        <h2>
          {data.stock_critico}
          <span className="rojo"> urgente</span>
        </h2>
      </div>

      <div className="info-card">
        <p className="titulo">BAJO MÍNIMO</p>
        <h2>{data.stock_minimo}</h2>
      </div>

      <div className="info-card">
        <p className="titulo">PRÓXIMOS A VENCER</p>
        <h2>{data.proximos_vencer}</h2>
      </div>

      <div className="info-card">
        <p className="titulo">VALOR A COSTO</p>
        <h2>{formatoMoneda(data.valor_costo)}</h2>
      </div>

      <div className="info-card">
        <p className="titulo">VALOR A VENTA</p>
        <h2>{formatoMoneda(data.valor_venta)}</h2>
      </div>
    </div>
  );
};

export default InfoProds;
