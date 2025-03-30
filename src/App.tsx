// filename: src/App.tsx

import React from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { TablaInteractiva } from "./components/TablaInteractiva";

export const App: React.FC = () => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Header />

      <main id="main-content">
        <section className="container-basic">
          <h2>Probablemente sabes las Raices Perfectas, ¡Vamos a repasarlas!</h2>
          <p>
            Cuando aprendemos las tablas de multiplicar aprendemos que 7 x 7 = 49, pero si alguien nos pregunta cuál es la raíz cuadrada de 49, probablemente nos paralicemos y al final digamos "no recuerdo". 
          </p>
          <p>
            Pero si sabemos que 7 x 7 = 49, entonces sabemos que la raíz cuadrada de 49 es 7, solo tenemos que darnos cuenta.
          </p>
        </section>
        
        <section className="container-basic-border">
          <h3>¡Probá ahora!</h3>
          <TablaInteractiva />
        </section>
      </main>
      
      <Footer />
    </>
  );
};


