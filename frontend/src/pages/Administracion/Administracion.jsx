import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Administracion = () => {
  //Navigate permite navegar en las paginas en react
  const navigate = useNavigate();

  //Guardo los valores que me mandan y que pueden cambio de estado con el useState
  //Guardo los datos que me mandan
  //Arranca en 0, por eso ''
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    // Evita que el form recargue la página al enviarse
    e.preventDefault();

    try {
      //Hago la peticion al back
      const response = await fetch("http://localhost:5000/app/administracion", {
        method: "POST",
        // Le avisa al servidor que le estamos mandando datos en formato JSON.
        headers: { "Content-Type": "application/json" },
        //Convierte el objeto usuario, password en un string JSON
        body: JSON.stringify({ usuario, password }),
      });

      //Convierte la respuesta del servidor (que llega como JSON) en un objeto de JavaScript.
      const data = await response.json();

      //Si la respuesta que me mandan por POST es correcta, va a redigir a /Panel
      if (response.ok){
        navigate('/Panel')
      }else{
      // El back siempre manda "message" (tanto en éxito como en error),
      // así que directamente lo mostramos sin necesidad de un if/else
      setMensaje(data.message);
      }

    } catch (error) {
      // Se ejecuta si falla la conexión (server apagado, sin internet, etc.)
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 rounded-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center mb-3">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="text"
            placeholder="USUARIO"
            name="username"
            // value + onChange = "input controlado": React maneja el valor del input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="PASSWORD"
            name="password"
            // Antes le faltaba esto: sin value/onChange, password siempre quedaba en ""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary" type="submit">Ingresar</button>
          {/* Si mensaje tiene contenido, lo muestra. Si está vacío (""), no renderiza nada */}
          {mensaje && <p>{mensaje}</p>}
        </form>
      </div>
    </div>
  );
};

export default Administracion;