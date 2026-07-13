export default function Card({ children, className = '', hover = false, strong = false, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`${strong ? 'glass-strong' : 'glass'} rounded-2xl ${
        hover ? 'transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
