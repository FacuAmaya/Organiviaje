/**
 * Tema claro / oscuro / del sistema.
 *
 * La preferencia se guarda en localStorage. Para que no haya "parpadeo" (la página se pinta
 * clara y después cambia a oscura), un script chico corre en el <head> ANTES del primer
 * pintado y pone la clase `dark` en <html>. Es la técnica que recomienda la guía de Next.js
 * "Preventing flash before hydration".
 */
export const TEMAS = ["claro", "oscuro", "sistema"] as const;
export type Tema = (typeof TEMAS)[number];

export const CLAVE_TEMA = "organiviaje-tema";
export const EVENTO_TEMA = "organiviaje:tema";

export function esTema(valor: unknown): valor is Tema {
  return typeof valor === "string" && (TEMAS as readonly string[]).includes(valor);
}

export function leerTema(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    return esTema(guardado) ? guardado : "sistema";
  } catch {
    return "sistema";
  }
}

export function sistemaPrefiereOscuro(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function aplicarTema(tema: Tema): void {
  const oscuro = tema === "oscuro" || (tema === "sistema" && sistemaPrefiereOscuro());
  document.documentElement.classList.toggle("dark", oscuro);
  document.documentElement.style.colorScheme = oscuro ? "dark" : "light";
}

export function guardarTema(tema: Tema): void {
  try {
    localStorage.setItem(CLAVE_TEMA, tema);
  } catch {
    // Navegación privada sin storage: el tema igual se aplica en esta sesión.
  }
  aplicarTema(tema);
  window.dispatchEvent(new Event(EVENTO_TEMA));
}

export function siguienteTema(tema: Tema): Tema {
  return TEMAS[(TEMAS.indexOf(tema) + 1) % TEMAS.length];
}

/** Versión mínima de leerTema + aplicarTema para el <head> (no puede importar módulos). */
export const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem("${CLAVE_TEMA}");var o=t==="oscuro"||(t!=="claro"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var d=document.documentElement;d.classList.toggle("dark",o);d.style.colorScheme=o?"dark":"light"}catch(e){}})()`;
