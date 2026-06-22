export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black z-[9997] flex items-end justify-start px-(--grid-margin) pb-8">
      <div className="flex flex-col gap-2">
        <div className="w-48 h-[2px] bg-white/20 overflow-hidden">
          <div className="h-full bg-white/60 animate-[loading_1.8s_ease-in-out_infinite]" />
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          51% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  )
}
