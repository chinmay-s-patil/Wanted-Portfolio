// 'use client';

// import { useState, useEffect } from 'react';

// // Sample diary entries - replace with your actual data
// const diaryEntries = [
//   {
//     id: 'raphe-2025',
//     organization: 'Raphe mPhibr',
//     role: 'Mechanical Research Engineer',
//     location: 'Bangalore, India',
//     type: 'Full-time',
//     dates: { start: '2025-06', end: '2025-09' },
//     summary: 'Led drone design and manufacturing with focus on DFAM principles.',
//     tools: ['DFAM', 'Python', 'Mechanical Design'],
//     notes: [
//       'Led end-to-end drone platform design and manufacturing',
//       'Implemented DFAM with self-supporting structures',
//       'Optimized data post-processing workflows using Python',
//       'Coordinated multidisciplinary teams on project milestones'
//     ],
//     insight: 'Automation in manufacturing matters as much as the design itself.'
//   },
//   {
//     id: 'iisc-2025',
//     organization: 'IISc Bangalore',
//     role: 'Research Intern',
//     location: 'Bangalore, India',
//     type: 'Internship',
//     dates: { start: '2025-04', end: '2025-06' },
//     summary: 'Advanced aeroacoustic simulations for rotor-wake interactions.',
//     tools: ['OpenFOAM', 'Ansys Fluent', 'LES', 'FW-H'],
//     notes: [
//       'Simulated high-fidelity rotor-wake interactions in OpenFOAM',
//       'Conducted LES-based aeroacoustic analysis in Ansys Fluent',
//       'Applied Ffowcs Williams–Hawkings analogy for noise prediction',
//       'Collaborated with faculty on aerospace research projects'
//     ],
//     insight: 'Hybrid CFD/CAA approaches reveal physics that pure simulations miss.'
//   },
//   {
//     id: 'csir-2024',
//     organization: 'CSIR SERC',
//     role: 'Research Intern',
//     location: 'Chennai, India',
//     type: 'Internship',
//     dates: { start: '2024-06', end: '2024-07' },
//     summary: 'Wind engineering CFD for drone propeller efficiency analysis.',
//     tools: ['OpenFOAM', 'Wind Engineering', 'Python'],
//     notes: [
//       'Independently learned and applied OpenFOAM for drone simulations',
//       'Ran propeller efficiency analysis in wind tunnel conditions',
//       'Validated CFD results against experimental measurements',
//       'Gained exposure to advanced materials characterization labs'
//     ],
//     insight: 'Self-learning OpenFOAM was steep, but opened countless doors.'
//   },
//   {
//     id: 'vitc-2023',
//     organization: 'VIT Chennai',
//     role: 'Project Intern',
//     location: 'Chennai, India',
//     type: 'Internship',
//     dates: { start: '2023-11', end: '2023-12' },
//     summary: 'Fracture mechanics simulation with ML prediction models.',
//     tools: ['COMSOL', 'Python', 'Machine Learning'],
//     notes: [
//       'Simulated angled crack propagation using J-integral method',
//       'Compiled 172k+ fracture simulation data points',
//       'Developed neural networks achieving 99.99% accuracy',
//       'Automated simulation data processing workflows'
//     ],
//     insight: 'Large datasets transform simulation from art to predictive science.'
//   },
//   {
//     id: 'appbell-2023',
//     organization: 'Appbell Technologies',
//     role: 'Full Stack Development Intern',
//     location: 'Remote',
//     type: 'Internship',
//     dates: { start: '2023-09', end: '2023-11' },
//     summary: 'Enhanced facial recognition systems and API development.',
//     tools: ['Python', 'API Development', 'Android', 'ML'],
//     notes: [
//       'Improved facial recognition accuracy for attendance systems',
//       'Developed robust API for facial recognition integration',
//       'Contributed to Android app frontend enhancements',
//       'Learned production deployment and real-world ML challenges'
//     ],
//     insight: 'Real-world ML is 90% data cleaning, 10% modeling.'
//   },
//   {
//     id: 'phd-future',
//     organization: 'TBD',
//     role: 'PhD Candidate',
//     location: '???',
//     type: 'Future',
//     dates: { start: 'TBD', end: 'TBD' },
//     summary: 'THIS CHAPTER IS YET TO BE WRITTEN.',
//     tools: [],
//     notes: ['PhD ideas brewing...'],
//     insight: null,
//     locked: true
//   }
// ];

// export default function ProfessionalDiary() {
//   const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);

//   const currentEntry = diaryEntries[currentEntryIndex];
//   const isLocked = currentEntry?.locked;

//   // Keyboard navigation
//   useEffect(() => {
//     if (!isOpen) return;

//     const handleKeyPress = (e) => {
//       if (e.key === 'ArrowLeft' && currentEntryIndex > 0) {
//         setCurrentEntryIndex(prev => prev - 1);
//       } else if (e.key === 'ArrowRight' && currentEntryIndex < diaryEntries.length - 1) {
//         setCurrentEntryIndex(prev => prev + 1);
//       } else if (e.key === 'Escape') {
//         setIsOpen(false);
//       }
//     };

//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, [isOpen, currentEntryIndex]);

//   const openDiary = () => setIsOpen(true);
//   const closeDiary = () => setIsOpen(false);

//   const goToNext = () => {
//     if (currentEntryIndex < diaryEntries.length - 1) {
//       setCurrentEntryIndex(prev => prev + 1);
//     }
//   };

//   const goToPrevious = () => {
//     if (currentEntryIndex > 0) {
//       setCurrentEntryIndex(prev => prev - 1);
//     }
//   };

//   if (!isOpen) {
//     return (
//       <div style={{
//         width: '100vw',
//         height: '100vh',
//         background: 'linear-gradient(135deg, #1a1410 0%, #0f0d0a 100%)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '2rem'
//       }}>
//         <button
//           onClick={openDiary}
//           style={{
//             background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
//             border: '8px solid #3d2817',
//             borderRadius: '12px',
//             padding: '3rem 4rem',
//             cursor: 'pointer',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
//             transition: 'all 0.3s ease',
//             fontFamily: "'Special Elite', monospace"
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.transform = 'translateY(-8px)';
//             e.currentTarget.style.boxShadow = '0 28px 80px rgba(0,0,0,0.7)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.transform = 'translateY(0)';
//             e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.6)';
//           }}
//         >
//           <div style={{
//             fontSize: '2.5rem',
//             fontWeight: '700',
//             color: '#3d2817',
//             marginBottom: '0.5rem',
//             fontFamily: "'Crimson Text', serif"
//           }}>
//             📔 PROFESSIONAL DIARY
//           </div>
//           <div style={{
//             fontSize: '1rem',
//             color: '#8b7355',
//             fontStyle: 'italic'
//           }}>
//             Click to open
//           </div>
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       width: '100vw',
//       height: '100vh',
//       background: 'linear-gradient(135deg, #1a1410 0%, #0f0d0a 100%)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '2rem',
//       position: 'relative'
//     }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap');
//       `}</style>

//       {/* Close Button */}
//       <button
//         onClick={closeDiary}
//         style={{
//           position: 'absolute',
//           top: '2rem',
//           right: '2rem',
//           background: 'rgba(196, 165, 116, 0.2)',
//           border: '2px solid #8b7355',
//           color: '#f6efe2',
//           padding: '0.75rem 1.5rem',
//           borderRadius: '8px',
//           cursor: 'pointer',
//           zIndex: 10,
//           fontFamily: "'Special Elite', monospace",
//           fontSize: '1rem',
//           transition: 'all 0.3s ease'
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.background = 'rgba(196, 165, 116, 0.3)';
//           e.currentTarget.style.borderColor = '#c4a574';
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.background = 'rgba(196, 165, 116, 0.2)';
//           e.currentTarget.style.borderColor = '#8b7355';
//         }}
//       >
//         ✕ CLOSE DIARY
//       </button>

//       {/* Diary Book */}
//       <div style={{
//         width: '90%',
//         maxWidth: '1200px',
//         height: '80vh',
//         maxHeight: '700px',
//         background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
//         borderRadius: '0 12px 12px 0',
//         border: '8px solid #3d2817',
//         boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
//         display: 'grid',
//         gridTemplateColumns: '1fr 1px 1fr',
//         position: 'relative',
//         overflow: 'hidden',
//         backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`
//       }}>
//         {/* Center Crease */}
//         <div style={{
//           position: 'absolute',
//           left: '50%',
//           top: 0,
//           bottom: 0,
//           width: '20px',
//           transform: 'translateX(-50%)',
//           background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 50%, transparent)',
//           pointerEvents: 'none',
//           zIndex: 1
//         }} />

//         {/* Left Page - Context */}
//         <div style={{
//           padding: '3rem',
//           overflowY: 'auto',
//           fontFamily: "'Special Elite', monospace"
//         }}>
//           {isLocked ? (
//             <div style={{
//               height: '100%',
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               textAlign: 'center'
//             }}>
//               <div style={{
//                 fontSize: '4rem',
//                 marginBottom: '2rem',
//                 opacity: 0.3
//               }}>
//                 🔒
//               </div>
//               <div style={{
//                 fontSize: '2rem',
//                 fontWeight: '700',
//                 color: '#3d2817',
//                 marginBottom: '1rem',
//                 fontFamily: "'Crimson Text', serif"
//               }}>
//                 THIS CHAPTER IS<br />YET TO BE WRITTEN.
//               </div>
//               <div style={{
//                 fontSize: '1.2rem',
//                 color: '#8b7355',
//                 fontStyle: 'italic'
//               }}>
//                 (PhD ideas brewing.)
//               </div>
//             </div>
//           ) : (
//             <>
//               <div style={{
//                 fontSize: '2rem',
//                 fontWeight: '700',
//                 color: '#3d2817',
//                 marginBottom: '1.5rem',
//                 fontFamily: "'Crimson Text', serif"
//               }}>
//                 {currentEntry.organization}
//               </div>

//               <div style={{
//                 fontSize: '1.5rem',
//                 color: '#5d4a2a',
//                 marginBottom: '1rem',
//                 fontWeight: '600'
//               }}>
//                 {currentEntry.role}
//               </div>

//               <div style={{
//                 fontSize: '1rem',
//                 color: '#8b7355',
//                 marginBottom: '0.5rem'
//               }}>
//                 📍 {currentEntry.location}
//               </div>

//               <div style={{
//                 fontSize: '1rem',
//                 color: '#8b7355',
//                 marginBottom: '1.5rem'
//               }}>
//                 📅 {currentEntry.dates.start} — {currentEntry.dates.end}
//               </div>

//               <div style={{
//                 padding: '1rem',
//                 background: 'rgba(61, 40, 23, 0.1)',
//                 borderRadius: '8px',
//                 marginBottom: '1.5rem',
//                 border: '2px solid #3d2817'
//               }}>
//                 <div style={{
//                   fontSize: '0.8rem',
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: '#8b7355',
//                   marginBottom: '0.5rem',
//                   fontWeight: '600'
//                 }}>
//                   TYPE
//                 </div>
//                 <div style={{
//                   fontSize: '1.1rem',
//                   color: '#3d2817',
//                   fontWeight: '700'
//                 }}>
//                   {currentEntry.type}
//                 </div>
//               </div>

//               <div style={{
//                 marginBottom: '1.5rem'
//               }}>
//                 <div style={{
//                   fontSize: '0.9rem',
//                   textTransform: 'uppercase',
//                   letterSpacing: '0.1em',
//                   color: '#8b7355',
//                   marginBottom: '0.75rem',
//                   fontWeight: '600'
//                 }}>
//                   FOCUS
//                 </div>
//                 <div style={{
//                   fontSize: '1rem',
//                   color: '#3d2817',
//                   lineHeight: '1.6'
//                 }}>
//                   {currentEntry.summary}
//                 </div>
//               </div>

//               {currentEntry.tools.length > 0 && (
//                 <div>
//                   <div style={{
//                     fontSize: '0.9rem',
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.1em',
//                     color: '#8b7355',
//                     marginBottom: '0.75rem',
//                     fontWeight: '600'
//                   }}>
//                     TOOLS USED
//                   </div>
//                   <div style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: '0.5rem'
//                   }}>
//                     {currentEntry.tools.map((tool, i) => (
//                       <span
//                         key={i}
//                         style={{
//                           padding: '0.4rem 0.8rem',
//                           background: '#3d2817',
//                           color: '#f6efe2',
//                           borderRadius: '4px',
//                           fontSize: '0.85rem',
//                           fontFamily: "'Crimson Text', serif"
//                         }}
//                       >
//                         {tool}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Center line */}
//         <div style={{ background: 'rgba(61, 40, 23, 0.2)' }} />

//         {/* Right Page - Notes */}
//         <div style={{
//           padding: '3rem',
//           overflowY: 'auto',
//           fontFamily: "'Crimson Text', serif"
//         }}>
//           {!isLocked && (
//             <>
//               <div style={{
//                 fontSize: '1.5rem',
//                 fontWeight: '700',
//                 color: '#3d2817',
//                 marginBottom: '2rem',
//                 textAlign: 'center'
//               }}>
//                 DIARY NOTES
//               </div>

//               <div style={{
//                 marginBottom: '2rem'
//               }}>
//                 {currentEntry.notes.map((note, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       marginBottom: '1.5rem',
//                       fontSize: '1.05rem',
//                       lineHeight: '1.7',
//                       color: '#2a2a2a',
//                       paddingLeft: '1.5rem',
//                       position: 'relative'
//                     }}
//                   >
//                     <span style={{
//                       position: 'absolute',
//                       left: 0,
//                       color: '#8b7355'
//                     }}>—</span>
//                     {note}
//                   </div>
//                 ))}
//               </div>

//               {currentEntry.insight && (
//                 <div style={{
//                   padding: '1.5rem',
//                   background: 'rgba(139, 115, 85, 0.1)',
//                   border: '2px solid #8b7355',
//                   borderRadius: '8px',
//                   marginTop: '2rem'
//                 }}>
//                   <div style={{
//                     fontSize: '0.9rem',
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.1em',
//                     color: '#8b7355',
//                     marginBottom: '0.75rem',
//                     fontWeight: '600',
//                     fontFamily: "'Special Elite', monospace"
//                   }}>
//                     KEY INSIGHT
//                   </div>
//                   <div style={{
//                     fontSize: '1.1rem',
//                     lineHeight: '1.6',
//                     color: '#3d2817',
//                     fontStyle: 'italic'
//                   }}>
//                     {currentEntry.insight}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Navigation Controls */}
//         <div style={{
//           position: 'absolute',
//           bottom: '2rem',
//           left: '0',
//           right: '0',
//           display: 'flex',
//           justifyContent: 'space-between',
//           padding: '0 3rem',
//           zIndex: 2
//         }}>
//           <button
//             onClick={goToPrevious}
//             disabled={currentEntryIndex === 0}
//             style={{
//               padding: '0.75rem 1.5rem',
//               background: currentEntryIndex === 0 ? 'rgba(61, 40, 23, 0.2)' : '#3d2817',
//               color: currentEntryIndex === 0 ? '#8b7355' : '#f6efe2',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: currentEntryIndex === 0 ? 'not-allowed' : 'pointer',
//               fontFamily: "'Special Elite', monospace",
//               fontSize: '0.9rem',
//               transition: 'all 0.3s ease',
//               opacity: currentEntryIndex === 0 ? 0.5 : 1
//             }}
//           >
//             ← PREVIOUS ENTRY
//           </button>

//           <div style={{
//             fontFamily: "'Special Elite', monospace",
//             color: '#8b7355',
//             fontSize: '0.9rem',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.5rem'
//           }}>
//             <span>{currentEntryIndex + 1}</span>
//             <span>/</span>
//             <span>{diaryEntries.length}</span>
//           </div>

//           <button
//             onClick={goToNext}
//             disabled={currentEntryIndex === diaryEntries.length - 1}
//             style={{
//               padding: '0.75rem 1.5rem',
//               background: currentEntryIndex === diaryEntries.length - 1 ? 'rgba(61, 40, 23, 0.2)' : '#3d2817',
//               color: currentEntryIndex === diaryEntries.length - 1 ? '#8b7355' : '#f6efe2',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: currentEntryIndex === diaryEntries.length - 1 ? 'not-allowed' : 'pointer',
//               fontFamily: "'Special Elite', monospace",
//               fontSize: '0.9rem',
//               transition: 'all 0.3s ease',
//               opacity: currentEntryIndex === diaryEntries.length - 1 ? 0.5 : 1
//             }}
//           >
//             NEXT ENTRY →
//           </button>
//         </div>

//         {/* Keyboard hints */}
//         <div style={{
//           position: 'absolute',
//           bottom: '0.75rem',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           fontSize: '0.75rem',
//           color: '#8b7355',
//           fontFamily: "'Special Elite', monospace",
//           opacity: 0.6
//         }}>
//           Use ← → to navigate | Esc to close
//         </div>
//       </div>
//     </div>
//   );
// }