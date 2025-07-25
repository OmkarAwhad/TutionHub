// AnimatedHamburger.jsx
export function AnimatedHamburger({ open, onClick }) {
  return (
    <button
      className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 p-2 bg-gray-900 bg-opacity-70 rounded shadow flex flex-col justify-center items-center group"
      onClick={onClick}
      aria-label={open ? "Close sidebar" : "Open sidebar"}
      type="button"
    >
      <span
        className={`
          block h-0.5 w-6 bg-white my-1 rounded transition-all duration-300
          ${open ? 'rotate-45 translate-y-2' : ''}
        `}
        style={{ backgroundColor: "#fff" }} // <-- force white color
      />
      <span
        className={`
          block h-0.5 w-6 bg-white my-1 rounded transition-all duration-300
          ${open ? 'opacity-0' : ''}
        `}
        style={{ backgroundColor: "#fff" }} // <-- force white color
      />
      <span
        className={`
          block h-0.5 w-6 bg-white my-1 rounded transition-all duration-300
          ${open ? '-rotate-45 -translate-y-2' : ''}
        `}
        style={{ backgroundColor: "#fff" }} // <-- force white color
      />
    </button>

  );
}
