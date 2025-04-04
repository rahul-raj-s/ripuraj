const Button = ({ onClick, children, type = "button", className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full bg-[#E9B72E] hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded ${className}`}
  >
    {children}
  </button>
);

export default Button;
