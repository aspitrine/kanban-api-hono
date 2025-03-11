type Variant =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'danger'
  | 'success'
  | 'info'
  | 'light';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}
function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-gray-800 hover:bg-gray-900 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-700 text-white',
    danger: 'bg-red-500 hover:bg-red-700 text-white',
    success: 'bg-green-500 hover:bg-green-700 text-white',
    info: 'bg-blue-500 hover:bg-blue-700 text-white',
    light: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  } as const;

  return (
    <button
      {...props}
      className={`${className} ${styles[variant]} cursor-pointer font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
    />
  );
}

export default Button;
