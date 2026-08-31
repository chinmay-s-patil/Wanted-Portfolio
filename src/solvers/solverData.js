export const solverData = [
  {
    id: 'fwh-family',
    folderName: 'fwh',
    displayLabel: 'FWH System',
    shortLabel: 'FWH',
    accentColor: '#378ADD',
    variants: [
      {
        id: 'fwhFoam',
        fileName: 'fwhFoam.C',
        application: 'fwhFoam',
        group: 'grpAcousticsSolvers',
        description: [
          'Standalone post-processing solver that reconstructs far-field acoustic pressure from a completed incompressible CFD run, using the Farassat 1A form of the Ffowcs Williams-Hawkings (FW-H) equation.',
          'Reads the p and U history sampled on a surface during the flow solve and evaluates the retarded-time thickness (monopole) and loading (dipole) terms with a constant reference density; the quadrupole (volume) term is neglected, which is valid below M ~ 0.3.',
          'Runs independently of the flow solver, so acoustic post-processing can be re-run with different observer positions or reference values without repeating the CFD.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' }
        ],
        requiredDictionaries: [
          { name: 'system/fwhDict', meaning: 'FWH sampling surface settings' }
        ],
        repo: 'https://github.com/chinmay-s-patil/CFD_CAA_Solvers/blob/main/solvers/fwhFoam/fwhFoam.C'
      },
      {
        id: 'fwhCompressibleFoam',
        fileName: 'fwhCompressibleFoam.C',
        application: 'fwhCompressibleFoam',
        group: 'grpAcousticsSolvers',
        description: [
          'Compressible counterpart to fwhFoam: the same standalone FW-H post-processor, but density is no longer assumed constant.',
          'Additionally samples rho from the CFD time directories onto the FW-H surface and differentiates rho*Un (rather than a constant-density Un) for the thickness term, which is the correct form when density fluctuations are non-negligible - e.g. output from rhoPimpleFoam or rhoSimpleFoam.',
          'Configuration is otherwise identical to fwhFoam, aside from fwhDict taking rhoRef in place of rho. (In the repo, this solver\'s source is built from a copy of fwhFoam.C living in its own solvers/fwhCompressibleFoam/ folder, and wmake renames the binary at build time.)'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' },
          { symbol: 'rho', meaning: 'Density', units: '[kg/m3]' }
        ],
        requiredDictionaries: [
          { name: 'system/fwhDict', meaning: 'FWH sampling surface settings (rhoRef instead of rho)' }
        ],
        repo: 'https://github.com/chinmay-s-patil/CFD_CAA_Solvers/blob/main/solvers/fwhCompressibleFoam/fwhFoam.C'
      },
      {
        id: 'pimpleFWHFoam',
        fileName: 'pimpleFWHFoam.C',
        application: 'pimpleFWHFoam',
        group: 'grpAcousticsSolvers',
        description: [
          'Coupled flow + acoustics solver: pimpleFoam (incompressible, turbulent, moving-mesh PIMPLE) with the FW-H machinery wired directly into the time loop, rather than run as a separate post-processing step.',
          'The FW-H surface is sampled inline after every PIMPLE correction (fwhSample.H), and the full retarded-time acoustic integration runs automatically once the simulation ends (fwhPostProcess.H) - avoiding the need to write large volumes of surface field data to disk while still capturing the complete time history.',
          'Because pimpleFWHFoam typically runs with adaptive time-stepping, fwhDict should use the NUDFT (non-uniform DFT) transform rather than FFT for correct spectra.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' }
        ],
        requiredDictionaries: [
          { name: 'system/fwhDict', meaning: 'FWH sampling surface settings' },
          { name: 'system/fvSolution', meaning: 'PIMPLE algorithm settings' }
        ],
        repo: 'https://github.com/chinmay-s-patil/CFD_CAA_Solvers/blob/main/solvers/pimpleFWHFoam/pimpleFWHFoam.C'
      }
    ]
  },
  {
    id: 'freefall-family',
    folderName: 'freefall',
    displayLabel: 'Free Falling',
    shortLabel: 'FreeFall',
    accentColor: '#D4652A',
    variants: [
      {
        id: 'freeFallingPimpleFoam',
        fileName: 'freeFallingPimpleFoam.C',
        application: 'freeFallingPimpleFoam',
        group: 'grpIncompressibleSolvers',
        description: [
          'pimpleFoam extended with a non-inertial (accelerating) reference frame, so a body falling under constant acceleration can be simulated without moving the mesh.',
          'The falling-frame kinematics (initial velocity and constant acceleration) enter the momentum equation as an inertial pseudo-force, and a matching fallingInletVelocity boundary condition keeps the far-field inlet consistent with the frame velocity at each time step.',
          'Currently the working, actively-tested solver in the family; the others below extend or adapt this approach.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Kinematic pressure', units: '[m2/s2]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' },
          { name: 'constant/fallingFrameDict', meaning: 'Falling-frame kinematics: initial velocity, acceleration, terminal velocity' }
        ],
        repo: 'https://github.com/chinmay-s-patil/freeFallingFoam/blob/main/solvers/freeFallingPimpleFoam/freeFallingPimpleFoam.C'
      },
      {
        id: 'freeFalling6DoFPimpleFoam',
        fileName: 'freeFalling6DoFPimpleFoam.C',
        application: 'freeFalling6DoFPimpleFoam',
        group: 'grpIncompressibleSolvers',
        description: [
          'Couples the falling-frame formulation to OpenFOAM\'s sixDoFRigidBodyMotion solver, so a tumbling body can free-fall with coupled translation and rotation rather than a prescribed trajectory.',
          'Solves for p_rgh (hydrostatic-reduced pressure) rather than total pressure, so the 6-DoF force computation only sees aerodynamic loads and not the hydrostatic component of the frame\'s own acceleration.',
          'Written specifically to fix an angular-velocity blow-up that showed up when driving 6-DoF motion off the total-pressure field in freeFallingPimpleFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Kinematic pressure', units: '[m2/s2]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Mesh motion + sixDoFRigidBodyMotionCoeffs (mass, inertia, patches)' },
          { name: 'constant/fallingFrameDict', meaning: 'Falling-frame kinematics: initial velocity, acceleration, terminal velocity' }
        ],
        repo: 'https://github.com/chinmay-s-patil/freeFallingFoam/blob/main/solvers/freeFalling6DoFPimpleFoam/freeFalling6DoFPimpleFoam.C'
      },
      {
        id: 'freeFallingRhoPimpleFoam',
        fileName: 'freeFallingRhoPimpleFoam.C',
        application: 'freeFallingRhoPimpleFoam',
        group: 'grpCompressibleSolvers',
        description: [
          'Compressible counterpart to freeFallingPimpleFoam, built on rhoPimpleFoam so density is solved for rather than assumed constant.',
          'Wires the same falling-frame pseudo-force and fallingFrameDict into the compressible momentum and energy equations.',
          'Functionally complete but not yet validated - treat results as provisional until checked against a reference case.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' },
          { symbol: 'rho', meaning: 'Density', units: '[kg/m3]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' },
          { name: 'constant/fallingFrameDict', meaning: 'Falling-frame kinematics: initial velocity, acceleration, terminal velocity' }
        ],
        repo: 'https://github.com/chinmay-s-patil/freeFallingFoam/blob/main/solvers/freeFallingRhoPimpleFoam/freeFallingRhoPimpleFoam.C'
      },
      {
        id: 'freeFallingSonicFoam',
        fileName: 'freeFallingSonicFoam.C',
        application: 'freeFallingSonicFoam',
        group: 'grpCompressibleSolvers',
        description: [
          'Trans-sonic/supersonic extension of the falling-frame family, built on sonicFoam for compressible gas flow with optional mesh motion.',
          'Adds the same falling-frame inertial pseudo-force as the incompressible variants, reading initial velocity and acceleration from fallingFrameDict, so it can model a body free-falling through the transonic regime rather than just low-speed drops.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' },
          { symbol: 'rho', meaning: 'Density', units: '[kg/m3]' }
        ],
        requiredDictionaries: [
          { name: 'constant/thermophysicalProperties', meaning: 'Gas thermophysical model' },
          { name: 'constant/fallingFrameDict', meaning: 'Falling-frame kinematics: initial velocity, acceleration, terminal velocity' }
        ],
        repo: 'https://github.com/chinmay-s-patil/freeFallingFoam/blob/main/solvers/freeFallingSonicFoam/freeFallingSonicFoam.C'
      },
      {
        id: 'freeFallingSonicDyMFoam',
        fileName: 'sonicDyMFoam.C',
        application: 'sonicDyMFoam',
        group: 'grpCompressibleSolvers',
        description: [
          'Placeholder: currently an unmodified copy of stock sonicDyMFoam, staged in the freeFallingFoam repo as scaffolding for a future moving-mesh falling-frame extension.',
          'It does not yet read fallingFrameDict or apply the falling-frame pseudo-force - functionally identical to base OpenFOAM sonicDyMFoam until that work lands.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' },
          { symbol: 'rho', meaning: 'Density', units: '[kg/m3]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' },
          { name: 'constant/thermophysicalProperties', meaning: 'Gas thermophysical model' }
        ],
        repo: 'https://github.com/chinmay-s-patil/freeFallingFoam/blob/main/solvers/freeFallingSonicDyMFoam/sonicDyMFoam.C'
      },
      {
        id: 'freeFallingSonicLiquidFoam',
        fileName: 'sonicLiquidFoam.C',
        application: 'sonicLiquidFoam',
        group: 'grpCompressibleSolvers',
        description: [
          'Placeholder: currently an unmodified copy of stock sonicLiquidFoam (trans-sonic/supersonic compressible liquid flow), staged as scaffolding for a future falling-frame liquid variant.',
          'No falling-frame kinematics are wired in yet - it behaves exactly like base OpenFOAM sonicLiquidFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' }
        ],
        requiredDictionaries: [
          { name: 'constant/thermodynamicProperties', meaning: 'Liquid thermodynamic properties' },
          { name: 'constant/transportProperties', meaning: 'Transport properties' }
        ],
        repo: 'https://github.com/chinmay-s-patil/freeFallingFoam/blob/main/solvers/freeFallingSonicLiquidFoam/sonicLiquidFoam.C'
      },
      {
        id: 'overDyMFreeFallingPimpleFoam',
        fileName: 'overDyMFreeFallingPimpleFoam.C',
        application: 'overDyMFreeFallingPimpleFoam',
        group: 'grpIncompressibleSolvers',
        description: [
          'Adds overset (Chimera) mesh capability to the falling-frame formulation, so a body can fall through a background mesh via a separately-meshed overset region instead of deforming or re-meshing the domain.',
          'Combines the same non-inertial reference-frame pseudo-force as freeFallingPimpleFoam with OpenFOAM\'s overset PIMPLE machinery, useful when large relative displacement between the falling body and the domain makes single-mesh motion impractical.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Kinematic pressure', units: '[m2/s2]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' },
          { name: 'constant/oversetMeshDict', meaning: 'Overset mesh settings' },
          { name: 'constant/fallingFrameDict', meaning: 'Falling-frame kinematics: initial velocity, acceleration, terminal velocity' }
        ],
        repo: 'https://github.com/chinmay-s-patil/freeFallingFoam/blob/main/solvers/overDyMFreeFallingPimpleFoam/overDyMFreeFallingPimpleFoam.C'
      },
      {
        id: 'overDyMFreeFallingRhoPimpleFoam',
        fileName: 'overDyMFreeFallingRhoPimpleFoam.C',
        application: 'overDyMFreeFallingRhoPimpleFoam',
        group: 'grpCompressibleSolvers',
        description: [
          'Compressible, overset-mesh member of the falling-frame family: combines the rhoPimpleFoam-based compressible falling-frame formulation with overset mesh motion.',
          'Intended for compressible free-fall cases where the body\'s displacement relative to the background mesh is too large for single-mesh deformation - the same use case as overDyMFreeFallingPimpleFoam, extended to compressible flow.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' },
          { symbol: 'rho', meaning: 'Density', units: '[kg/m3]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' },
          { name: 'constant/oversetMeshDict', meaning: 'Overset mesh settings' },
          { name: 'constant/fallingFrameDict', meaning: 'Falling-frame kinematics: initial velocity, acceleration, terminal velocity' }
        ],
        repo: 'https://github.com/chinmay-s-patil/freeFallingFoam/blob/main/solvers/overDyMFreeFallingRhoPimpleFoam/overDyMFreeFallingRhoPimpleFoam.C'
      }
    ]
  },
  {
    id: 'ehc-family',
    folderName: 'ehc',
    displayLabel: 'EHC Phase Change',
    shortLabel: 'EHC',
    accentColor: '#2AA876',
    variants: [
      {
        id: 'ehcFoam',
        fileName: 'ehcFoam.C',
        application: 'ehcFoam',
        group: 'grpHeatTransferSolvers',
        description: [
          'TODO: Add description for ehcFoam.'
        ],
        requiredFields: [
          { symbol: 'T', meaning: 'Temperature', units: '[K]' },
          { symbol: 'Cp', meaning: 'Specific heat capacity', units: '[J/kg/K]' }
        ],
        requiredDictionaries: [
          { name: 'constant/thermophysicalProperties', meaning: 'Phase change material properties' }
        ],
        repo: 'https://github.com/...'
      }
    ]
  }
];