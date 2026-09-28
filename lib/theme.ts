/**
 * Theme constants shared by the server layout and the client toggle.
 *
 * This lives outside the component files on purpose: a "use client" module's
 * exports become client references, so a plain string exported from one cannot
 * be read by a server component.
 */

export const THEME_KEY = "ninebark.theme";

/**
 * Runs before first paint to apply a saved theme choice.
 *
 * Without this, a visitor who picked dark gets a white flash on every page load.
 * The server has no way to know their choice, because the choice only exists in
 * their browser. Kept to one line and wrapped in try/catch because
 * localStorage throws in some privacy modes.
 */
export const THEME_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;
