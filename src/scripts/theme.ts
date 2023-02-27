export const getCurrentTheme = (): "light" | "night" => {
  if (localStorage.getItem("theme"))
    return localStorage.getItem("theme") as "light" | "night";

  if (window.matchMedia("(prefers-color-scheme: light)").matches)
    return "light";

  return "night";
};

export const toggleTheme = (): "light" | "night" => {
  const theme = getCurrentTheme();
  return theme === "night" ? "light" : "night";
};

export const applyTheme = (theme: "light" | "night") => {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
  window.dispatchEvent(new Event("theme-change"));
};
