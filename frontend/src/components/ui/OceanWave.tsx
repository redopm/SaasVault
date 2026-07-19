export default function OceanWave() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0 pointer-events-none">
      <svg
        className="relative block w-full h-[15vh] min-h-[100px] max-h-[150px]"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="animate-wave-slow">
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(0, 198, 255, 0.4)" />
        </g>
        <g className="animate-wave-medium">
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(0, 114, 255, 0.3)" />
        </g>
        <g className="animate-wave-fast">
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(16, 185, 129, 0.2)" />
        </g>
        <g className="animate-wave-slowest">
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(255, 255, 255, 0.8)" />
        </g>
      </svg>
    </div>
  );
}
