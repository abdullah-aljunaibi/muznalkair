export default function IslamicPattern({ className = "" }: { className?: string }) {
  const svgPattern = `
    <svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'>
      <polygon points='30,2 35,12 46,12 37,19 40,30 30,24 20,30 23,19 14,12 25,12' fill='%231B6B7A' opacity='0.12'/>
      <polygon points='30,8 33,15 41,15 35,20 37,28 30,23 23,28 25,20 19,15 27,15' fill='none' stroke='%231B6B7A' stroke-width='0.5' opacity='0.15'/>
      <circle cx='30' cy='30' r='2' fill='%231B6B7A' opacity='0.1'/>
      <line x1='0' y1='30' x2='60' y2='30' stroke='%231B6B7A' stroke-width='0.3' opacity='0.08'/>
      <line x1='30' y1='0' x2='30' y2='60' stroke='%231B6B7A' stroke-width='0.3' opacity='0.08'/>
    </svg>
  `.trim().replace(/\n\s*/g, ' ');

  const encoded = encodeURIComponent(svgPattern);

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encoded}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '60px 60px',
        opacity: 0.6,
      }}
    />
  );
}
