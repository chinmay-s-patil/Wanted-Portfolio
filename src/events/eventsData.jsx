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
        type: 'title'
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
    id: 'robocup-2023',
    title: 'RoboCup Junior 2023',
    year: '2023',
    location: 'Bordeaux, France',
    dates: { start: 'Jul 4, 2023', end: 'Jul 10, 2023' },
    summary: 'World championship finals for autonomous rescue robots, representing German team.',
    color: '#c41e3a',
    highlights: [
      'Top 8 worldwide',
      'Advanced autonomous navigation',
      'International collaboration'
    ],
    frames: [
      {
        type: 'title'
      },
      {
        type: 'image',
        src: '/events/robocup2023/robot-action.jpg',
        caption: 'Our robot navigating the rescue arena'
      },
      {
        type: 'image',
        src: '/events/robocup2023/team.jpg',
        caption: 'Team Germany at the world finals'
      },
      {
        type: 'image',
        src: '/events/robocup2023/competition.jpg',
        caption: 'Competition arena overview'
      },
      {
        type: 'summary',
        text: 'A thrilling journey competing at the highest level of robotics, pushing the boundaries of autonomous systems and teamwork.'
      }
    ]
  },
  {
    id: 'tech-workshop-2022',
    title: 'Advanced CAD Workshop',
    year: '2022',
    location: 'Stuttgart, Germany',
    dates: { start: 'Mar 15, 2022', end: 'Mar 17, 2022' },
    summary: 'Intensive workshop on advanced CAD techniques and parametric design.',
    color: '#ff6b35',
    highlights: [
      'Parametric modeling',
      'Assembly optimization',
      'Design for manufacturing'
    ],
    frames: [
      {
        type: 'title'
      },
      {
        type: 'image',
        src: '/events/workshop2022/design-session.jpg',
        caption: 'Working on complex assemblies'
      },
      {
        type: 'image',
        src: '/events/workshop2022/presentation.jpg',
        caption: 'Final design presentations'
      },
      {
        type: 'summary',
        text: 'Gained invaluable hands-on experience with industry-standard CAD tools and advanced design methodologies.'
      }
    ]
  }
];

export default eventsData;
