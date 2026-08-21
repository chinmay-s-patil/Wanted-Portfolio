// src/events/eventsData.jsx
// Complete dataset for 35mm Film Reels & Memory Archives

const eventsData = [
  {
    id: 'drone-vitc',
    title: 'Drone VITC Competition',
    year: '2023',
    location: 'VIT Chennai, India',
    dates: { start: 'Feb 2023', end: 'Mar 2023' },
    summary: 'Designed, assembled, and piloted custom quadcopter drones for the VITC aerial robotics challenge, achieving top 3 in the high-speed endurance category.',
    color: '#c4a574', // Brass gold
    spoolType: 'vintage-brass',
    highlights: [
      'Top 3 Endurance Finish',
      'Betaflight FC Custom Tuning',
      'High-Speed FPV Piloting',
      'Carbon-Fiber Frame Assembly'
    ],
    frames: [
      { type: 'title' },
      { type: 'image', src: '/Events/Drone VITC/Drone VITC (1).JPG', caption: 'Pre-flight structural inspection and motor torque verification' },
      { type: 'image', src: '/Events/Drone VITC/Drone VITC (2).JPG', caption: 'Team strategy huddle before the high-speed endurance heat' },
      { type: 'image', src: '/Events/Drone VITC/Drone VITC (3).JPG', caption: 'FPV goggle feed calibration & receiver antenna tuning' },
      { type: 'image', src: '/Events/Drone VITC/Drone VITC (4).JPG', caption: 'Mid-flight aerial capture hovering over the obstacle course' },
      { type: 'image', src: '/Events/Drone VITC/Drone VITC (5).jpg', caption: 'Final landing approach under battery voltage constraints' },
      { type: 'image', src: '/Events/Drone VITC/Drone VITC (6).jpg', caption: 'Post-flight telemetry analysis & ESC temperature check' },
      { type: 'image', src: '/Events/Drone VITC/Drone VITC (7).jpg', caption: 'Podium presentation celebrating the top-3 endurance finish' },
      { type: 'summary', text: 'An intense hands-on experience in drone engineering, flight-controller PID tuning, and high-speed competitive FPV flight under pressure.' }
    ]
  },
  {
    id: 'iisc-do-drone',
    title: 'IISc Autonomous Drone Research',
    year: '2023',
    location: 'IISc Bangalore, India',
    dates: { start: 'Jul 2023', end: 'Aug 2023' },
    summary: 'Research fellowship at the Indian Institute of Science focusing on autonomous drone navigation and real-time SLAM mapping in GPS-denied environments.',
    color: '#00e0ff', // Electric cyan
    spoolType: 'anodized-cyan',
    highlights: [
      'Visual-Inertial SLAM',
      'GPS-Denied Indoor Flight',
      'VICON MoCap Calibration',
      'ROS2 Path Planning'
    ],
    frames: [
      { type: 'title' },
      { type: 'image', src: '/Events/IISc Do Drone/IISc Do Drone (1).jpg', caption: 'Lab orientation at the IISc Guidance & Aerial Robotics facility' },
      { type: 'image', src: '/Events/IISc Do Drone/IISc Do Drone (2).jpg', caption: 'Configuring retroreflective tracking markers for VICON MoCap system' },
      { type: 'image', src: '/Events/IISc Do Drone/IISc Do Drone (3).jpg', caption: 'Autonomous waypoint flight testing inside the indoor arena' },
      { type: 'image', src: '/Events/IISc Do Drone/IISc Do Drone (4).jpg', caption: 'Real-time 3D occupancy grid & SLAM map visualization' },
      { type: 'image', src: '/Events/IISc Do Drone/IISc Do Drone (5).jpg', caption: 'Hover stability & disturbance rejection tuning under optical flow' },
      { type: 'image', src: '/Events/IISc Do Drone/IISc Do Drone (6).jpg', caption: 'Hardware-in-the-loop simulation debrief with lab researchers' },
      { type: 'image', src: '/Events/IISc Do Drone/IISc Do Drone (7).jpg', caption: 'Stereo-camera depth estimation testing across obstacles' },
      { type: 'image', src: '/Events/IISc Do Drone/IISc Do Drone (8).jpg', caption: 'Custom ROS node deployment on Jetson Nano onboard computer' },
      { type: 'summary', text: 'A deep dive into state estimation, sensor fusion, and real-time path optimization for autonomous unmanned aerial vehicles.' }
    ]
  },
  {
    id: 'isawe',
    title: 'Int. Symposium of Advanced Wind Energy',
    year: '2024',
    location: 'Munich, Germany',
    dates: { start: 'Jun 2024', end: 'Jun 2024' },
    summary: 'Presented cutting-edge CFD research on aerodynamic optimization of multi-megawatt offshore wind turbine blade profiles at ISAWE 2024.',
    color: '#38bdf8', // Sky blue
    spoolType: 'chrome-steel',
    highlights: [
      'CFD Airfoil Optimization',
      'Poster Presentation',
      'Offshore Wind Dynamics',
      'Siemens & Vestas Networking'
    ],
    frames: [
      { type: 'title' },
      { type: 'image', src: '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (1).jpg', caption: 'Symposium opening ceremony at Technical University of Munich' },
      { type: 'image', src: '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (2).jpg', caption: 'Keynote presentation on next-generation floating offshore turbines' },
      { type: 'image', src: '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (3).jpg', caption: 'Poster session — presenting 3D boundary-layer transition CFD results' },
      { type: 'image', src: '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (4).jpg', caption: 'Technical discussion on vortex shedding with industry aerodynamicists' },
      { type: 'image', src: '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (5).jpg', caption: 'Comparing OpenFOAM numerical predictions against wind-tunnel data' },
      { type: 'image', src: '/Events/International Symposium of Advanced Wind Energy/International Symposium of Advanced Wind Energy (6).jpg', caption: 'Excursion to local wind turbine test facility and blade root display' },
      { type: 'summary', text: 'A key professional milestone bridging academic OpenFOAM numerical modeling with industrial renewable energy turbine design.' }
    ]
  },
  {
    id: 'ncwe',
    title: 'National Conference on Wind Energy',
    year: '2022',
    location: 'Chennai, India',
    dates: { start: 'Nov 2022', end: 'Nov 2022' },
    summary: 'Presented a comparative study of NACA 4412 vs S809 airfoils for low-wind speed urban turbine applications at NCWE.',
    color: '#eab308', // Amber gold
    spoolType: 'vintage-copper',
    highlights: [
      'NACA & S809 Airfoil Analysis',
      'Small-Scale Wind Turbines',
      'Best Paper Award Nominee',
      'IIT Madras Faculty Review'
    ],
    frames: [
      { type: 'title' },
      { type: 'image', src: '/Events/NCWE/NCWE (1).jpg', caption: 'Opening plenary session at the National Conference on Wind Energy' },
      { type: 'image', src: '/Events/NCWE/NCWE (2).jpg', caption: 'Delivering oral presentation on lift-to-drag polar optimization' },
      { type: 'image', src: '/Events/NCWE/NCWE (3).jpg', caption: 'Interactive Q&A session with aerospace professors from IIT Madras' },
      { type: 'image', src: '/Events/NCWE/NCWE (4).jpg', caption: 'Certificate of appreciation & Best Paper nomination ceremony' },
      { type: 'image', src: '/Events/NCWE/NCWE (5).jpg', caption: 'Exhibiting small-scale 3D printed turbine blade prototype' },
      { type: 'summary', text: 'A foundational academic research experience establishing core expertise in wind energy computational fluid dynamics.' }
    ]
  }
];

export default eventsData;
