export function Card({ children, className = '' }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-xl ${className}`}>
      {children}
    </div>
  );
}
