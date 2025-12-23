import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setDarkOnLogin: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "journal-theme";

const isBrowser = typeof document !== "undefined";

const applyThemeClass = (theme: Theme) => {
  if (!isBrowser) return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const readStoredTheme = (): Theme | null => {
  if (!isBrowser) return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "dark" || stored === "light" ? stored : null;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setThemeState] = useState<Theme>("light");

  useLayoutEffect(() => {
    const storedTheme = readStoredTheme();
    const initialTheme = storedTheme ?? "light";
    setThemeState(initialTheme);
    applyThemeClass(initialTheme);
  }, []);

  const persistTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    applyThemeClass(nextTheme);
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    persistTheme(theme === "light" ? "dark" : "light");
  }, [theme, persistTheme]);

  const setDarkOnLogin = useCallback(() => {
    persistTheme("dark");
  }, [persistTheme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme: persistTheme,
      toggleTheme,
      setDarkOnLogin,
    }),
    [persistTheme, theme, toggleTheme, setDarkOnLogin],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
