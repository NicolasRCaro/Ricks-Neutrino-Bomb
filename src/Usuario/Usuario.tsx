import React, { useEffect, useState } from "react";
React
import "<div className="" />Usuario.css"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import {
  doc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../Firebase/firebaseConfig";

import "./Usuario.css";

function Usuario() {

  // =========================
  // Estados
  // =========================

  const [usuario, setUsuario] = useState<User | null>(null);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [fecha, setFecha] = useState("");
  const [telefono, setTelefono] = useState("");

  const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/11895/11895240.png";

  const [mostrarLogo, setMostrarLogo] = useState(false);

  const [cargando, setCargando] = useState(true);

  // =========================
  // Detectar sesión
  // =========================

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      setUsuario(user);
      setCargando(false);

    });

    return () => unsubscribe();

  }, []);

  // =========================
  // REGISTRO
  // =========================

  const handleRegistro = async () => {

    if (!nombre || !correo || !contrasena || !fecha || !telefono) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo,
        contrasena
      );

      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nombre,
        correo,
        fecha,
        telefono,
        ganados: 0,
        perdidos: 0,
      });

      alert("Usuario registrado correctamente");

      setMostrarLogo(true);

      setNombre("");
      setCorreo("");
      setContrasena("");
      setFecha("");
      setTelefono("");

    } catch (error: any) {

      alert(error.message);

    }
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {

    if (!correo || !contrasena) {
      alert("Por favor ingresa correo y contraseña.");
      return;
    }

    try {

      await signInWithEmailAndPassword(auth, correo, contrasena);

      alert("Inicio de sesión exitoso");

      setCorreo("");
      setContrasena("");

    } catch (error: any) {

      alert(error.message);

    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {

    try {

      await signOut(auth);

      alert("Sesión cerrada");

      setMostrarLogo(false);

    } catch (error: any) {

      alert(error.message);

    }
  };

  // =========================
  // Loading
  // =========================

  if (cargando) {

    return <h2>Cargando...</h2>;

  }

  // =========================
  // JSX
  // =========================

  return (

    <div className="usuario-container">

      <h1>Usuario</h1>

      {/* El logo aparece tras registrarse O cuando hay sesión activa */}
      {(mostrarLogo || usuario) && (
        <img
          src={LOGO_URL}
          alt="Logo"
          className="logo-usuario"
        />
      )}

      {!usuario ? (

        <>

          <h2>Registro</h2>

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <button onClick={handleRegistro}>
            Registrarse
          </button>

          <h2>Login</h2>

          <button onClick={handleLogin}>
            Iniciar Sesión
          </button>

        </>

      ) : (

        <>

          <h2>Bienvenido</h2>

          <p>{usuario.displayName ?? usuario.email}</p>

          <button onClick={handleLogout}>
            Cerrar Sesión
          </button>

        </>

      )}

    </div>

  );
}

export default Usuario;