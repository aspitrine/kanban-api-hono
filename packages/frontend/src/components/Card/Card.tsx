interface CardProps {
  children: React.ReactNode;
}
function Card({ children }: CardProps) {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      {children}
    </div>
  );
}

export default Card;
