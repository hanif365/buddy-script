"use client";

export default function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="fixed top-1/2 right-2 z-[1000] -translate-y-1/2"
    >
      <span className="relative flex h-[66px] w-[34px] items-center justify-center rounded-full bg-primary transition-colors duration-200 dark:bg-[#232e42]">
        <svg
          className="absolute top-[9px] opacity-0 transition-opacity duration-200 dark:opacity-100"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>

        <svg
          className="absolute bottom-[11px] opacity-100 transition-opacity duration-200 dark:opacity-0"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>

        <span className="absolute top-[6px] left-1/2 h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-white shadow transition-all duration-200 dark:top-[38px] dark:bg-primary" />
      </span>
    </button>
  );
}
