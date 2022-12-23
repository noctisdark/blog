export const getCurrentTheme = (): "light" | "dark" => {
  if (
    localStorage.getItem("theme")
  )
    return localStorage.getItem("theme") as "light" | "dark";

  if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    return "dark";

  return "light";
};

export const toggleTheme = (): "light" | "dark" => {
  const theme = getCurrentTheme();
  return theme === "dark" ? "light" : "dark";
};

export const applyTheme = (theme: "light" | "dark") => {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
  window.dispatchEvent(new Event("theme-change"));
};