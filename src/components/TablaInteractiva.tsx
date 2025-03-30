// filename: src/components/TablaInteractiva.tsx

import React, { useState, useEffect, useRef } from "react";
import { elogios, erroresSuaves, metacognicion } from "../utils/feedbackMessages";

// Extendemos cada fila para saber si ya fue mostrada y si fue respondida correctamente
interface Opcion extends Fila {
  mostrada: boolean;            // Para no volver a mostrar una combinación ya usada
  respondidaBien: boolean;      // Para saber si podemos usarla como candidata en la etapa de raíz
}

// Cada grupo representa una fila visual, y el flag indica si ya se mostró completa
interface Grupo {
  opciones: Opcion[];
  mostradoGrupo: boolean;       // Evita mostrar un grupo completo una vez agotadas sus opciones
}

type Fila = {
  a: string;
  b: string;
  valor: number;
  base: number;
};

// Generamos la tabla con los datos base y agregamos las propiedades adicionales
const generarTabla = (): Grupo[] => [
  [
    { a: "1 × 1 = 1", b: "√1 = 1", valor: 1, base: 1 },
    { a: "2 × 2 = 4", b: "√4 = 2", valor: 4, base: 2 },
    { a: "3 × 3 = 9", b: "√9 = 3", valor: 9, base: 3 }
  ],
  [
    { a: "4 × 4 = 16", b: "√16 = 4", valor: 16, base: 4 },
    { a: "5 × 5 = 25", b: "√25 = 5", valor: 25, base: 5 },
    { a: "6 × 6 = 36", b: "√36 = 6", valor: 36, base: 6 }
  ],
  [
    { a: "7 × 7 = 49", b: "√49 = 7", valor: 49, base: 7 },
    { a: "8 × 8 = 64", b: "√64 = 8", valor: 64, base: 8 },
    { a: "9 × 9 = 81", b: "√81 = 9", valor: 81, base: 9 }
  ],
  [
    { a: "10 × 10 = 100", b: "√100 = 10", valor: 100, base: 10 },
    { a: "11 × 11 = 121", b: "√121 = 11", valor: 121, base: 11 },
    { a: "12 × 12 = 144", b: "√144 = 12", valor: 144, base: 12 }
  ]
].map(grupo => ({
  opciones: grupo.map(o => ({ ...o, mostrada: false, respondidaBien: false })),
  mostradoGrupo: false
}));

export const TablaInteractiva: React.FC = () => {
  // Inicializa la tabla desde localStorage o genera una nueva
  const inicializarTabla = (): Grupo[] => {
    const datosGuardados = localStorage.getItem('tablaInteractiva');
    if (datosGuardados) {
      try {
        return JSON.parse(datosGuardados);
      } catch (e) {
        return generarTabla();
      }
    }
    return generarTabla();
  };

  const [tabla, setTabla] = useState<Grupo[]>(inicializarTabla);
  const [fila, setFila] = useState(0);
  const [col, setCol] = useState(0);
  const [estado, setEstado] = useState<"multiplicacion" | "raiz" | "final" | "completado">("multiplicacion");
  const [respuesta, setRespuesta] = useState("");
  const [valorActual, setValorActual] = useState(0);
  const [baseRaiz, setBaseRaiz] = useState(0);
  const [feedback, setFeedback] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Al iniciar el componente, arrancamos con una combinación nueva
  useEffect(() => {
    reiniciar();
  }, []);

  // Guarda el estado en localStorage cuando cambia la tabla
  useEffect(() => {
    localStorage.setItem('tablaInteractiva', JSON.stringify(tabla));
  }, [tabla]);

  // Cada vez que cambia el estado, nos aseguramos de enfocar el input
  useEffect(() => {
    if (estado === "multiplicacion" || estado === "raiz") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [estado, fila, col]);

  const reiniciarProgreso = () => {
    localStorage.removeItem('tablaInteractiva');
    setTabla(generarTabla());
    setEstado("multiplicacion");
    reiniciar();
  };

  const reiniciar = () => {
    // Buscamos entre todas las combinaciones que todavía no hayan sido mostradas
    const candidatos = tabla.flatMap((grupo, i) =>
      grupo.opciones.map((op, j) => ({ i, j, op })).filter(({ op }) => !op.mostrada)
    );

    // Si ya no queda ninguna, pasamos a estado final de juego
    if (candidatos.length === 0) {
      setEstado("completado");
      return;
    }

    // Elegimos una combinación aleatoria no usada aún
    const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
    const nuevaTabla = [...tabla];
    nuevaTabla[elegido.i].opciones[elegido.j].mostrada = true;

    // Si ya se mostraron las 3 combinaciones de un grupo, marcamos ese grupo como completo
    if (nuevaTabla[elegido.i].opciones.every(o => o.mostrada)) {
      nuevaTabla[elegido.i].mostradoGrupo = true;
    }

    setTabla(nuevaTabla);
    setFila(elegido.i);
    setCol(elegido.j);
    setValorActual(elegido.op.valor);
    setBaseRaiz(elegido.op.base);
    setRespuesta("");
    setFeedback("");
    setEstado("multiplicacion");
  };

  const verificarMultiplicacion = () => {
    // Si acertó la multiplicación
    if (parseInt(respuesta) === valorActual) {
      const nuevaTabla = [...tabla];
      nuevaTabla[fila].opciones[col].respondidaBien = true;
      setTabla(nuevaTabla);

      setFeedback(`${elogios[Math.floor(Math.random() * elogios.length)]} ${tabla[fila].opciones[col].a}`);

      // Elegimos una raíz de alguna opción ya respondida bien, pero distinta a la actual
      const opcionesPrevias = tabla.flatMap(g => g.opciones.filter(o => o.respondidaBien && o.valor !== valorActual));
      if (opcionesPrevias.length > 0) {
        const seleccion = opcionesPrevias[Math.floor(Math.random() * opcionesPrevias.length)];
        setValorActual(seleccion.valor);
        setBaseRaiz(seleccion.base);
        setRespuesta("");
        setEstado("raiz");
      } else {
        // Si no hay otras previas, damos un mensaje informativo
        setFeedback(`${elogios[Math.floor(Math.random() * elogios.length)]} Continuando con la siguiente multiplicación.`);
        setEstado("final");
        setTimeout(reiniciar, 4000);
      }
    } else {
      // Error leve, no castigamos: sólo damos un mensaje amable
      setFeedback(erroresSuaves[Math.floor(Math.random() * erroresSuaves.length)]);
    }
  };

  const verificarRaiz = () => {
    if (parseInt(respuesta) === baseRaiz) {
      setFeedback(`¡Muy bien! √${valorActual} = ${baseRaiz}. ${metacognicion[Math.floor(Math.random() * metacognicion.length)]}`);
      setEstado("final");
      setTimeout(reiniciar, 4000);
    } else {
      setFeedback(erroresSuaves[Math.floor(Math.random() * erroresSuaves.length)]);
    }
  };

  // Si el usuario completó todas las combinaciones, mostramos una pantalla de felicitación
  if (estado === "completado") {
    return (
      <div className="container-basic-center">
        <h3>¡Felicitaciones!</h3>
        <p>Has completado todas las combinaciones posibles. Ya sabés todas las raíces cuadradas de los primeros 12 números. 🧠✨</p>
        <button onClick={reiniciarProgreso} className="reiniciar-btn">
          Reiniciar práctica <span className="trash-icon">🗑️</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="header-container">
        <h3>Tabla de raíces cuadradas</h3>
        <button 
          onClick={reiniciarProgreso} 
          className="reiniciar-btn" 
          title="Reiniciar progreso"
          aria-label="Reiniciar progreso"
        >
          <span className="trash-icon">🗑️</span>
        </button>
      </div>

      {/* Renderiza las tres opciones de la fila actual */}
      {tabla[fila].opciones.map((item, i) => (
        <div key={i} className="container-basic-left">
          {(estado === "multiplicacion" && i === col) ? (
            <form onSubmit={(e) => { e.preventDefault(); verificarMultiplicacion(); }}>
              <p>
                {item.base} × {item.base} ={" "}
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{1,3}"
                  maxLength={3}
                  className="input-sin-flechas"
                  value={respuesta}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,3}$/.test(val)) setRespuesta(val);
                  }}
                />{" "}
                <button type="submit">Responder</button>
              </p>
            </form>
          ) : (
            <p>{item.a} & {item.b}</p>
          )}
        </div>
      ))}

      {estado === "raiz" && (
        <div className="container-basic-left">
          <form onSubmit={(e) => { e.preventDefault(); verificarRaiz(); }}>
            <p>
              ¿Cuál es la raíz cuadrada de {valorActual}?{" "}
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="\d{1,3}"
                maxLength={3}
                className="input-sin-flechas"
                value={respuesta}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,3}$/.test(val)) setRespuesta(val);
                }}
              />{" "}
              <button type="submit">Responder</button>
            </p>
          </form>
        </div>
      )}

      {feedback && (
        <div className={`container-basic-left ${estado === "raiz" ? "meta" : (feedback.startsWith("¡") ? "correct" : "wrong")}`}>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}; 