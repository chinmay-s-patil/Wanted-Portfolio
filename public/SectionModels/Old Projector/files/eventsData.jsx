// src/events/eventsData.jsx
const eventsData = [
  {
    id: 'aiaa-2024',
    title: 'AIAA Student Conference 2024',
    year: '2024',
    location: 'Munich, Germany',
    dates: { start: 'Jun 12, 2024', end: 'Jun 15, 2024' },
    summary: 'Presented drone aeroacoustics research and networked with leading researchers in the field.',
    color: '#2a5d84',
    highlights: [
      'Poster finalist',
      'Presented hybrid LES-RANS results',
      'Connected with industry professionals'
    ],
    frames: [
      {
        type: 'title',
        text: 'AIAA Student Conference 2024'
      },
      {
        type: 'image',
        src: '/events/aiaa2024/poster-session.jpg',
        caption: 'Poster session — evening reception (June 13, 2024)'
      },
      {
        type: 'image',
        src: '/events/aiaa2024/presentation.jpg',
        caption: 'Presenting research findings'
      },
      {
        type: 'image',
        src: '/events/aiaa2024/group.jpg',
        caption: 'With fellow researchers'
      },
      {
        type: 'summary',
        text: 'An enriching experience presenting cutting-edge aeroacoustics research and engaging with the aerospace engineering community.'
      }
    ]
  },
  {
    id: 'workshop-cfd-2024',
    title: 'OpenFOAM Workshop 2024',
    year: '2024',
    location: 'Online',
    dates: { start: 'Mar 10, 2024', end: 'Mar 12, 2024' },
    summary: 'Three-day intensive workshop on advanced OpenFOAM techniques and best practices.',
    color: '#48cae4',
    highlights: [
      'Completed advanced meshing module',
      'Learned about new solver developments',
      'Contributed to community discussions'
    ],
    frames: [
      {
        type: 'title',
        text: 'OpenFOAM Workshop 2024'
      },
      {
        type: 'image',
        src: '/events/of-workshop/certificate.jpg',
        caption: 'Workshop completion certificate'
      },
      {
        type: 'image',
        src: '/events/of-workshop/screenshot.jpg',
        caption: 'Advanced mesh generation techniques'
      },
      {
        type: 'summary',
        text: 'Expanded technical knowledge in CFD preprocessing and solver optimization, with hands-on exercises in parallel computing and turbulence modeling.'
      }
    ]
  },
  {
    id: 'research-symposium-2023',
    title: 'University Research Symposium',
    year: '2023',
    location: 'Chennai, India',
    dates: { start: 'Nov 5, 2023', end: 'Nov 5, 2023' },
    summary: 'Presented undergraduate thesis work on pyrolysis-based fuel optimization.',
    color: '#5d4a2a',
    highlights: [
      'Best presentation award',
      'Published in proceedings',
      'Featured in university newsletter'
    ],
    frames: [
      {
        type: 'title',
        text: 'University Research Symposium 2023'
      },
      {
        type: 'image',
        src: '/events/symposium/presentation.jpg',
        caption: 'Presenting thesis research'
      },
      {
        type: 'image',
        src: '/events/symposium/award.jpg',
        caption: 'Receiving best presentation award'
      },
      {
        type: 'image',
        src: '/events/symposium/poster.jpg',
        caption: 'Research poster display'
      },
      {
        type: 'summary',
        text: 'Honored to receive recognition for research on sustainable fuel alternatives through pyrolysis optimization.'
      }
    ]
  },
  {
    id: 'lab-tour-csir-2024',
    title: 'CSIR-SERC Laboratory Tour',
    year: '2024',
    location: 'Chennai, India',
    dates: { start: 'Jul 15, 2024', end: 'Jul 15, 2024' },
    summary: 'Comprehensive tour of wind engineering and structural testing facilities at CSIR-SERC.',
    color: '#4a2a5d',
    highlights: [
      'Wind tunnel demonstration',
      'Structural testing labs',
      'Materials characterization facilities'
    ],
    frames: [
      {
        type: 'title',
        text: 'CSIR-SERC Laboratory Tour'
      },
      {
        type: 'image',
        src: '/events/csir-tour/wind-tunnel.jpg',
        caption: 'Industrial wind tunnel facility'
      },
      {
        type: 'image',
        src: '/events/csir-tour/equipment.jpg',
        caption: 'Advanced measurement equipment'
      },
      {
        type: 'image',
        src: '/events/csir-tour/team.jpg',
        caption: 'With research team'
      },
      {
        type: 'summary',
        text: 'Gained valuable insights into experimental techniques and large-scale testing infrastructure used in civil and aerospace engineering research.'
      }
    ]
  }
]

export default eventsData
