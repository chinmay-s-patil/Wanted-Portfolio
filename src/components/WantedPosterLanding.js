'use client';

export default function WantedPosterLanding() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2 md:p-4">
      {/* Wanted Poster */}
      <section 
        aria-labelledby="wanted-title"
        className="relative w-full max-w-3xl bg-amber-50 shadow-2xl"
        style={{
          height: 'clamp(600px, 95vh, 900px)',
          transform: 'rotate(-1.5deg)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Push pin decoration */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-red-600 rounded-full shadow-lg border-2 border-red-800"></div>

        <div className="h-full flex flex-col border-4 border-stone-800" style={{ padding: 'clamp(1rem, 3vh, 2.5rem) clamp(1rem, 3vw, 2rem)' }}>
          {/* Header */}
          <h1 
            id="wanted-title"
            className="font-bold text-center mb-1 tracking-wider text-stone-900"
            style={{ 
              fontFamily: 'Georgia, serif',
              textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
              fontSize: 'clamp(2.5rem, 8vh, 5rem)',
              lineHeight: '1'
            }}
          >
            WANTED
          </h1>
          
          <p className="text-center tracking-widest font-semibold text-stone-700" style={{ fontSize: 'clamp(0.5rem, 1.5vh, 0.875rem)', marginBottom: 'clamp(0.5rem, 2vh, 1.5rem)' }}>
            FOR ENGINEERING CRIMES
          </p>

          {/* Portrait Section */}
          <div className="flex justify-center" style={{ marginBottom: 'clamp(0.5rem, 2vh, 1.5rem)' }}>
            <div className="relative border-4 border-stone-800 p-1 bg-stone-200">
              {/* Portrait placeholder - replace src with your image path */}
              <div className="bg-gradient-to-br from-stone-400 to-stone-600 flex items-center justify-center" style={{ width: 'clamp(120px, 15vw, 180px)', height: 'clamp(140px, 18vh, 220px)' }}>
                {/* Replace this div with: <img src="/portrait.jpg" alt="Chinmay S. Patil" className="w-full h-full object-cover" /> */}
                <img src="/portrait.jpg" alt="Chinmay S. Patil" className="w-full h-full object-cover" />
              </div>
              {/* Tape effect */}
              <div className="absolute -top-1 left-1/4 w-12 h-4 bg-amber-100 opacity-60 transform -rotate-12 border border-amber-200"></div>
              <div className="absolute -top-1 right-1/4 w-12 h-4 bg-amber-100 opacity-60 transform rotate-12 border border-amber-200"></div>
            </div>
          </div>

          {/* Identity Block */}
          <div className="font-mono text-stone-900" style={{ marginBottom: 'clamp(0.5rem, 2vh, 1.5rem)', fontSize: 'clamp(0.5rem, 1.5vh, 0.875rem)', gap: 'clamp(0.25rem, 0.5vh, 0.5rem)', display: 'flex', flexDirection: 'column' }}>
            <div className="flex border-b border-stone-300 pb-0.5">
              <span className="font-bold" style={{ minWidth: 'clamp(80px, 10vw, 120px)' }}>NAME:</span>
              <span>CHINMAY S. PATIL</span>
            </div>
            <div className="flex border-b border-stone-300 pb-0.5">
              <span className="font-bold" style={{ minWidth: 'clamp(80px, 10vw, 120px)' }}>ALIAS:</span>
              <span>"CHIN DOES SIMS"</span>
            </div>
            <div className="flex border-b border-stone-300 pb-0.5">
              <span className="font-bold" style={{ minWidth: 'clamp(80px, 10vw, 120px)' }}>LAST SEEN:</span>
              <span>CFD LAB / TERMINAL</span>
            </div>
            <div className="flex border-b border-stone-300 pb-0.5">
              <span className="font-bold" style={{ minWidth: 'clamp(80px, 10vw, 120px)' }}>SPECIALTY:</span>
              <span>SIMULATION</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-stone-900 leading-tight" style={{ marginBottom: 'clamp(0.5rem, 2vh, 1.5rem)', fontSize: 'clamp(0.5rem, 1.5vh, 0.875rem)' }}>
            <p>
              Known for building CFD pipelines, optimization workflows, and visualization tools. Frequently spotted working with OpenFOAM, Python, and large datasets.
            </p>
          </div>

          {/* Charges/Skills */}
          <div style={{ marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
            <h2 className="font-bold tracking-wide text-stone-900" style={{ marginBottom: 'clamp(0.25rem, 1vh, 0.75rem)', fontSize: 'clamp(0.65rem, 1.8vh, 1rem)' }}>KNOWN CAPABILITIES:</h2>
            <ul className="grid grid-cols-2 gap-1 text-stone-900" style={{ fontSize: 'clamp(0.5rem, 1.4vh, 0.75rem)' }}>
              <li className="flex items-center">
                <span className="mr-1">•</span>
                CFD & OpenFOAM
              </li>
              <li className="flex items-center">
                <span className="mr-1">•</span>
                Automation
              </li>
              <li className="flex items-center">
                <span className="mr-1">•</span>
                Visualization
              </li>
              <li className="flex items-center">
                <span className="mr-1">•</span>
                ML Optimization
              </li>
            </ul>
          </div>

          {/* Stamp */}
          <div className="flex justify-end" style={{ marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
            <div 
              className="border-4 border-red-600 text-red-600 font-bold transform rotate-12 tracking-widest"
              style={{ 
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(0.75rem, 2vh, 1.25rem)',
                padding: 'clamp(0.25rem, 0.5vh, 0.5rem) clamp(0.75rem, 2vw, 1.5rem)'
              }}
            >
              ACTIVE CASE
            </div>
          </div>

          {/* Reward Section */}
          <div className="border-t-2 border-stone-800 flex-1 flex flex-col justify-center" style={{ paddingTop: 'clamp(0.5rem, 1.5vh, 1rem)', marginBottom: 'clamp(0.5rem, 1vh, 1rem)' }}>
            <h2 className="font-bold text-center tracking-wide text-stone-900" style={{ 
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1rem, 3vh, 2rem)',
              marginBottom: 'clamp(0.25rem, 1vh, 0.75rem)'
            }}>
              REWARD
            </h2>
            <div className="text-center font-semibold text-stone-900" style={{ 
              fontSize: 'clamp(0.5rem, 1.4vh, 0.875rem)',
              marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)',
              lineHeight: '1.4'
            }}>
              <p>INSIGHTFUL CONVERSATIONS</p>
              <p>COLLABORATIONS</p>
              <p>ENGINEERING WORK</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              aria-label="Investigate Chinmay Patil's work"
              className="bg-stone-900 text-amber-50 font-bold tracking-wider border-4 border-amber-50 hover:bg-stone-800 hover:scale-105 transition-all duration-200 shadow-lg"
              style={{
                fontSize: 'clamp(0.75rem, 2vh, 1.25rem)',
                padding: 'clamp(0.5rem, 1.5vh, 1rem) clamp(1rem, 3vw, 2rem)'
              }}
              onClick={() => {
                // Replace with your navigation logic
                console.log('Navigate to hub/portfolio');
              }}
            >
              INVESTIGATE CASE →
            </button>
          </div>

          {/* Optional Case ID */}
          <p className="text-center text-stone-500 font-mono" style={{ 
            marginTop: 'clamp(0.25rem, 1vh, 0.75rem)',
            fontSize: 'clamp(0.45rem, 1.2vh, 0.625rem)'
          }}>
            Case File ID: CSP-2412
          </p>
        </div>
      </section>
    </div>
  );
}