// Props interface, extends React.HTMLAttributes<HTMLDivElement>
export default function ThreeDots(props: React.HTMLAttributes<HTMLDivElement>) {
  const dot = (
    <div className="w-2 h-2 transition-colors bg-white bg-opacity-50 group-hover:bg-opacity-100 rounded-full shadow-md"></div>
  );

  return (
    <div {...props} className={`flex group gap-1.5 ${props.className}`}>
      {dot}
      {dot}
      {dot}
    </div>
  );
}
