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
          'TODO: Add description for fwhFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' }
        ],
        requiredDictionaries: [
          { name: 'constant/fwhDict', meaning: 'FWH sampling surface settings' }
        ],
        repo: 'https://github.com/...'
      },
      {
        id: 'fwhCompressibleFoam',
        fileName: 'fwhCompressibleFoam.C',
        application: 'fwhCompressibleFoam',
        group: 'grpAcousticsSolvers',
        description: [
          'TODO: Add description for fwhCompressibleFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' },
          { symbol: 'rho', meaning: 'Density', units: '[kg/m3]' }
        ],
        requiredDictionaries: [
          { name: 'constant/fwhDict', meaning: 'FWH sampling surface settings' }
        ],
        repo: 'https://github.com/...'
      },
      {
        id: 'pimpleFWHFoam',
        fileName: 'pimpleFWHFoam.C',
        application: 'pimpleFWHFoam',
        group: 'grpAcousticsSolvers',
        description: [
          'TODO: Add description for pimpleFWHFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' }
        ],
        requiredDictionaries: [
          { name: 'constant/fwhDict', meaning: 'FWH sampling surface settings' },
          { name: 'system/fvSolution', meaning: 'PIMPLE algorithm settings' }
        ],
        repo: 'https://github.com/...'
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
          'TODO: Add description for freeFallingPimpleFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Kinematic pressure', units: '[m2/s2]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' }
        ],
        repo: 'https://github.com/...'
      },
      {
        id: 'freeFalling6DoFPimpleFoam',
        fileName: 'freeFalling6DoFPimpleFoam.C',
        application: 'freeFalling6DoFPimpleFoam',
        group: 'grpIncompressibleSolvers',
        description: [
          'TODO: Add description for freeFalling6DoFPimpleFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Kinematic pressure', units: '[m2/s2]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' },
          { name: 'constant/6DoFRigidBodyMotion', meaning: '6-DOF motion settings' }
        ],
        repo: 'https://github.com/...'
      },
      {
        id: 'freeFallingRhoPimpleFoam',
        fileName: 'freeFallingRhoPimpleFoam.C',
        application: 'freeFallingRhoPimpleFoam',
        group: 'grpCompressibleSolvers',
        description: [
          'TODO: Add description for freeFallingRhoPimpleFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' },
          { symbol: 'rho', meaning: 'Density', units: '[kg/m3]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' }
        ],
        repo: 'https://github.com/...'
      },
      {
        id: 'overDyMFreeFallingPimpleFoam',
        fileName: 'overDyMFreeFallingPimpleFoam.C',
        application: 'overDyMFreeFallingPimpleFoam',
        group: 'grpIncompressibleSolvers',
        description: [
          'TODO: Add description for overDyMFreeFallingPimpleFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Kinematic pressure', units: '[m2/s2]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' },
          { name: 'constant/oversetMeshDict', meaning: 'Overset mesh settings' }
        ],
        repo: 'https://github.com/...'
      },
      {
        id: 'overDyMFreeFallingRhoPimpleFoam',
        fileName: 'overDyMFreeFallingRhoPimpleFoam.C',
        application: 'overDyMFreeFallingRhoPimpleFoam',
        group: 'grpCompressibleSolvers',
        description: [
          'TODO: Add description for overDyMFreeFallingRhoPimpleFoam.'
        ],
        requiredFields: [
          { symbol: 'U', meaning: 'Velocity', units: '[m/s]' },
          { symbol: 'p', meaning: 'Pressure', units: '[Pa]' },
          { symbol: 'rho', meaning: 'Density', units: '[kg/m3]' }
        ],
        requiredDictionaries: [
          { name: 'constant/dynamicMeshDict', meaning: 'Dynamic mesh settings' },
          { name: 'constant/oversetMeshDict', meaning: 'Overset mesh settings' }
        ],
        repo: 'https://github.com/...'
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