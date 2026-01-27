// app/projects/projectsData.js
const projectsData = {
  drawers: [
    {
      id: 'cfd-simulation',
      label: 'CFD & Simulation',
      color: '#2a5d84',
      folders: [
        {
          id: 'pyrolysis',
          title: 'Optimization of Pyrolysis-Based Plastic Oil Yield',
          category: 'Experimentation',
          period: 'Jul 2024 — Jan 2025',
          description: 'Designed and executed Taguchi-based pyrolysis experiments on HDPE, PS, and blended feeds to maximize oil conversion. Characterized feedstocks via TGA, SEM-EDAX, and analyzed pyrolysis oils with GC-MS. Implemented and benchmarked five ML models, achieving up to 95.96% R² for yield prediction.',
          learnings: [
            'Designed DOE experiments using Taguchi methodology',
            'Built ML models with 95.96% R² accuracy',
            'Analyzed materials with TGA, SEM-EDAX, GC-MS'
          ],
          tags: ['Alternative Fuels', 'ML', 'Experimental Design'],
          media: [
            { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (1).jpg'},
            { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (2).jpg'},
            { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (3).jpg'},
            { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (4).jpg'},
            { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (5).jpg'},
            { type: 'image', src: '/Projects/Pyrolysis of Plastics/Pyrolysis of Plastics (6).jpg'},
          ]
        },
        {
          id: 'battery-cooling',
          title: 'Hybrid Battery Cooling Mechanism',
          category: 'Thermal',
          period: 'Jul 2024 — Jan 2025',
          description: 'Developed a thermal management system using TIM, PCM, and liquid coolant to enhance battery performance. Utilized SolidWorks for 3D design and Ansys for simulation, realizing a 67.31% improvement in cooling efficiency.',
          learnings: [
            'Achieved 67.31% cooling efficiency improvement',
            'Integrated TIM, PCM, and liquid coolant systems',
            'Performed transient thermal CFD analysis'
          ],
          tags: ['Thermal Management', 'CFD', 'Batteries', 'Ansys'],
          media: [
            { type: 'image', src: '/Projects/Battery Thermal Management System/Battery Thermal Management System (1).jpg' },
            { type: 'image', src: '/Projects/Battery Thermal Management System/Battery Thermal Management System (2).jpg' },
            { type: 'image', src: '/Projects/Battery Thermal Management System/Battery Thermal Management System (3).jpg' },
            { type: 'image', src: '/Projects/Battery Thermal Management System/Battery Thermal Management System (4).jpg' }
          ]
        },
        {
          id: 'wind-turbine',
          title: 'Wind Turbine Simulation in StarCCM+',
          category: 'CFD',
          period: 'Oct 2024',
          description: 'Performed a detailed CFD simulation of a wind turbine using StarCCM+. The simulation included mesh generation, setup of physics models, and boundary conditions to analyze aerodynamic performance.',
          learnings: [
            'Set up a high-quality CFD mesh in StarCCM+',
            'Configured fluid continuum and boundary conditions',
            'Analyzed aerodynamic performance characteristics'
          ],
          tags: ['CFD', 'Wind Energy', 'StarCCM+', 'Simulation'],
          media: [
            { type: 'link', src: 'https://youtu.be/zUCs9P6_Ok0' },
            { type: 'link', src: 'https://youtu.be/PDuDxi86K8k' },
          ]
        },
        {
          id: 'solar-aerodynamics',
          title: 'Solar Parapet Roof Panel Aerodynamics',
          category: 'CFD',
          period: 'Mar 2025',
          description: 'Simulated wind loads on parapet roof-mounted solar panels in OpenFOAM using custom atmospheric boundary layer conditions. Assessed parapet height effects for durable installations.',
          learnings: [
            'Developed custom ABL boundary conditions',
            'Analyzed wind load distribution on solar arrays',
            'Evaluated parapet height effects on sheltering'
          ],
          tags: ['CFD', 'Solar', 'Building', 'OpenFOAM'],
          media: [
            {type: 'image', src: 'Projects/Solar Parapet Roof Panel Aerodynamics/Solar Parapet Roof Panel Aerodynamics (1).jpeg'},
            {type: 'image', src: 'Projects/Solar Parapet Roof Panel Aerodynamics/Solar Parapet Roof Panel Aerodynamics (2).jpeg'},
            {type: 'image', src: 'Projects/Solar Parapet Roof Panel Aerodynamics/Solar Parapet Roof Panel Aerodynamics (3).jpeg'},
            {type: 'image', src: 'Projects/Solar Parapet Roof Panel Aerodynamics/Solar Parapet Roof Panel Aerodynamics (4).jpeg'},
          ]
        },
        {
          id: 'coffee-heater',
          title: 'Coffee Heater Multiphase Simulation',
          category: 'CFD',
          period: 'May 2025',
          description: 'Multiphase CFD simulation of a coffee heater immersed in a water cup using Ansys Fluent. Modeled three-phase flow system consisting of air, liquid water, and water vapor with phase change phenomena.',
          learnings: [
            'Simulated multiphase flow with phase change modeling',
            'Captured water-to-vapor phase transition dynamics',
            'Analyzed buoyancy-driven convection and heat transfer'
          ],
          tags: ['Multiphase', 'Phase Change', 'Heat Transfer', 'Ansys Fluent'],
          media: [
            { type: 'link', src: 'https://youtu.be/qS2XWqEUUwk' }
          ]
        },
        {
          id: 'propeller-aeroacoustics',
          title: 'Propeller Aeroacoustics Study',
          category: 'CFD',
          period: 'Apr 2025',
          description: 'LES-based aeroacoustic simulations of propellers in ANSYS Fluent using sliding mesh and FW-H analogy. Compared acoustic performance of standard, foldable, and toroidal geometries.',
          learnings: [
            'Performed LES with sliding mesh technique',
            'Applied FW-H analogy for noise prediction',
            'Compared acoustic performance of multiple designs'
          ],
          tags: ['Aeroacoustics', 'Noise', 'CFD', 'LES', 'Ansys']
        },
        {
          id: 'truck-platooning',
          title: 'Simulation of Truck Platooning',
          category: 'CFD',
          period: 'Nov 2024 — Feb 2025',
          description: 'CFD simulation in OpenFOAM studying aerodynamic interactions in truck platooning. Investigated drag reduction and fuel efficiency improvements with optimal vehicle spacing.',
          learnings: [
            'Quantified drag reduction in platooning',
            'Optimized vehicle spacing for efficiency',
            'Analyzed wake interactions between vehicles'
          ],
          tags: ['CFD', 'Transport', 'Optimization', 'OpenFOAM'],
          media: [
            { type: 'image', src: '/projects/truck-platoon.jpg' }
          ]
        },
        {
          id: 'immersion-cooling',
          title: 'Immersion Cooling in Battery Thermal Management',
          category: 'Thermal',
          period: 'Nov 2024 — Feb 2025',
          description: 'Parametric analysis of coolant type, C-rating, and inlet velocity for battery cooling in OpenFOAM. Achieved a 43.99% temperature reduction with optimal configuration.',
          learnings: [
            'Conducted parametric thermal analysis',
            'Achieved 43.99% temperature improvement',
            'Compared multiple coolant configurations'
          ],
          tags: ['Thermal', 'Batteries', 'CFD', 'OpenFOAM']
        },
        {
          id: 'solar-arrays',
          title: 'Aerodynamics of Ground-Mounted Solar Arrays',
          category: 'CFD',
          period: 'Dec 2024 — Feb 2025',
          description: 'Steady-state and transient CFD mapping of pressure and force on solar panel arrays. Assessment guided design for optimized structural durability and cost-efficiency.',
          learnings: [
            'Mapped pressure distributions on solar arrays',
            'Performed transient wind load analysis',
            'Optimized panel orientation for loading'
          ],
          tags: ['CFD', 'Solar', 'Optimization', 'Wind Loading'],
          media: [
            {type: 'link', src: 'https://youtu.be/4Jfo9_4OumM'},
            {type: 'link', src: 'https://youtu.be/vk0DZnuVfNo'},
          ]
        }
      ]
    },
    {
      id: 'cad-design',
      label: 'CAD & Design',
      color: '#5d4a2a',
      folders: [
        {
          id: 's500-drone',
          title: 'Reverse Engineering S500 Drone',
          category: 'CAD',
          period: 'Jan 2024 — Mar 2024',
          description: 'Captured detailed 3D scans and rebuilt a SolidWorks model with 0.01mm tolerance for the S500 drone, including full assembly validation against kit documentation.',
          learnings: [
            'Performed high-precision 3D scanning',
            'CAD reconstruction with 0.01mm tolerance',
            'Full assembly validation and documentation'
          ],
          tags: ['Reverse Engineering', 'CAD', 'SolidWorks', '3D Scanning'],
          media: [
            { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (1).jpg' },
            { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (1).mp4' },
            { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (2).jpg' },
            { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (2).mp4' },
            { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (3).jpg' },
            { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (3).mp4' },
            { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (4).jpg' },
            { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (4).mp4' },
            { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (5).jpg' },
            { type: 'video', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (5).mp4' },
            { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (6).jpg' },
            { type: 'image', src: '/Projects/Reverse Engineering of a S500 Drone/Reverse Engineering of a S500 Drone (7).jpg' },
          ]
        },
        {
          id: 'sve-cad',
          title: 'CAD Model of Solar Vortex Engine',
          category: 'CAD',
          period: 'Sept 2024',
          description: 'Designed research-grade CAD model of Solar Vortex Engine with 1mm tolerance for CFD baseline and future parametric optimization.',
          learnings: [
            'Developed detailed CAD model with 1mm tolerance',
            'Incorporated research-based design standards',
            'Created parametric model for optimization'
          ],
          tags: ['CAD', 'Design', 'Energy', 'SolidWorks'],
          media: [
            { type: 'image', src: 'Projects/SVE/SVE (1).png' },
            { type: 'image', src: 'Projects/SVE/SVE (2).png' }
          ]
        },
        {
          id: 'wind-tunnel',
          title: 'Wind Tunnel Test Section Modeling',
          category: 'CAD',
          period: 'Jan 2024',
          description: '3D modeled a wind tunnel test section in SolidWorks from field measurements, maintaining 0.01mm tolerance for experimental reliability.',
          learnings: [
            'Precision modeling with 0.01mm tolerance',
            'Field measurement to CAD workflow',
            'Design for instrumentation integration'
          ],
          tags: ['CAD', 'Experiment', 'Aerodynamics', 'SolidWorks'],
          media: [
            { type: 'image', src: 'Projects/CAD Modeling of Wind Tunnel Test Section/CAD Modeling of Wind Tunnel Test Section.jpg' },
            { type: 'image', src: 'Projects/CAD Modeling of Wind Tunnel Test Section/CAD Modeling of Wind Tunnel Test Section.png' }
          ]
        },
        {
          id: 'guitar-design',
          title: 'Guitar Design Project',
          category: 'CAD',
          period: 'Feb 2022',
          description: 'Created a detailed, visually optimized CAD guitar model for a showcase project. Demonstrated surface modeling, assembly design, and engineering graphics skills.',
          learnings: [
            'Detailed surface and solid modeling',
            'Assembly design and visualization',
            'Engineering graphics fundamentals'
          ],
          tags: ['Design', 'CAD', 'Showcase', 'Product Design'],
          media: [
            { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (1).jpg' },
            { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (2).jpg' },
            { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (3).jpg' },
            { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (4).jpg' },
            { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (5).jpg' },
            { type: 'image', src: '/Projects/Guitar Design Project/Guitar Design Project (6).jpg' }
          ]
        }
      ]
    },
    {
      id: 'fea-ml',
      label: 'FEA & Machine Learning',
      color: '#4a2a5d',
      folders: [
        {
          id: 'bullet-impact',
          title: 'Bullet Impact Simulations',
          category: 'Explicit Dynamics',
          period: 'Dec 2024 — Present',
          description: 'Explicit dynamics simulation of bullet impact on bolted plates using Abaqus. Evaluated stress distribution, deformation, and ballistic resistance to support protective structure design.',
          learnings: [
            'Performed explicit dynamics simulation in Abaqus',
            'Analyzed high-velocity impact mechanics',
            'Evaluated stress and deformation patterns'
          ],
          tags: ['Impact', 'FEA', 'Materials', 'Abaqus'],
          media: [
            { type: 'link', src: 'https://youtu.be/dGgJ6lmnyjk' },
            { type: 'link', src: 'https://youtu.be/BAfsRZVK2jI' }
          ]
        },
        {
          id: 'inclined-crack',
          title: 'Computational Correlation of J-Integral for Inclined Crack',
          category: 'FEA',
          period: 'Nov 2023 — Dec 2023',
          description: 'Simulated angled crack propagation in COMSOL with the J-integral method. Compiled data from 172,000+ fracture cases and built neural network models achieving 99.99% accuracy.',
          learnings: [
            'Simulated crack propagation with J-integral',
            'Generated comprehensive fracture dataset',
            'Built ML models with >99% accuracy'
          ],
          tags: ['Fracture', 'ML', 'FEA', 'COMSOL'],
          media: [
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (1).png' },
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (10).png' },
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (2).png' },
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (3).png' },
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (4).png' },
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (5).png' },
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (6).png' },
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (7).png' },
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (8).png' },
            { type: 'image', src: '/Projects/Inclined Crack/Inclined Crack (9).png' }
          ]
        },
        {
          id: 'graphite-rupture',
          title: 'Graphite Rupture Strength Prediction',
          category: 'ML',
          period: 'Aug 2024',
          description: 'Developed a deep learning model (98.1% accuracy) for predicting graphite rupture strength using historic nuclear graphite datasets. Model accelerates property screening for reactor-grade materials.',
          learnings: [
            'Achieved 98.1% prediction accuracy',
            'Processed nuclear-grade graphite datasets',
            'Developed property prediction framework'
          ],
          tags: ['Deep Learning', 'Materials', 'Prediction', 'Neural Networks'],
          media: [
            { type: 'image', src: '/Projects/Nuclear Graphite/Nuclear Graphite (1).png' },
            { type: 'image', src: '/Projects/Nuclear Graphite/Nuclear Graphite (2).png' }
          ]
        },
        {
          id: 'language-music',
          title: 'Language Identification in Music',
          category: 'ML',
          period: 'Aug 2024 — Nov 2024',
          description: 'Designed a deep learning model (97% accuracy) for identifying language in music using MFCC features. Built a robust preprocessing pipeline in PyTorch for noisy real-world inputs.',
          learnings: [
            'Achieved 97% language detection accuracy',
            'Implemented MFCC feature extraction',
            'Built end-to-end audio processing pipeline'
          ],
          tags: ['Deep Learning', 'Audio', 'PyTorch', 'Signal Processing']
        }
      ]
    },
    {
      id: 'experimental',
      label: 'Experimental Work',
      color: '#2a4a5d',
      folders: [
        {
          id: 'aero-lab',
          title: 'Aerodynamics Lab Experiments',
          category: 'Experimentation',
          period: 'Feb 2023 — Mar 2025',
          description: 'Hands-on experiments in the Aerodynamics Laboratory (wind turbine instrumentation, hot-wire anemometry, pitot tube analysis) under Dr. Vinayagamurthy. Gained practical expertise in wind measurement and analysis techniques.',
          learnings: [
            'Wind turbine instrumentation setup',
            'Hot-wire anemometry measurements',
            'Pitot tube calibration and analysis'
          ],
          tags: ['Experiment', 'Wind', 'Instrumentation', 'Measurement'],
          media: [
            { type: 'image', src: '/Projects/Aerodynamics Lab Experiments/Aerodynamics Lab Experiments (1).jpg' },
            { type: 'image', src: '/Projects/Aerodynamics Lab Experiments/Aerodynamics Lab Experiments (2).jpg' },
            { type: 'image', src: '/Projects/Aerodynamics Lab Experiments/Aerodynamics Lab Experiments (3).jpg' },
            { type: 'image', src: '/Projects/Aerodynamics Lab Experiments/Aerodynamics Lab Experiments (4).jpg' }
          ]
        }
      ]
    }
  ]
};

export default projectsData;