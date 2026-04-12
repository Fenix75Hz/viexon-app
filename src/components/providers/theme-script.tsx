const themeScript = `
(() => {
  try {
    const storageKey = "viexon-theme";
    const root = document.documentElement;
    const storedTheme = localStorage.getItem(storageKey);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : systemTheme;

    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
  } catch (error) {
    console.warn("Theme bootstrap failed", error);
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
