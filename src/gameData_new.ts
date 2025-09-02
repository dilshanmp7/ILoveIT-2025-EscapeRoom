import type { Room } from '@/types'

export const QUESTION_BANK: Record<Room['id'], Omit<Room, 'id' | 'name' | 'backgroundImage'>> = {
  'it-security': {
    levels: {
      level1: {
        id: 'level1',
        title: 'Phishing Analysis',
        hint: 'ALPHA',
        questions: [
          {
            id: 'sec1-1',
            question: 'Which of these is a sign of a phishing email?',
            options: [
              { id: 'a', text: 'An offer that seems too good to be true' },
              { id: 'b', text: 'A generic greeting like "Dear Customer"' },
              { id: 'c', text: 'Both A and B' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'sec1-2',
            question: 'What should you do if you receive a suspicious email with a link?',
            options: [
              { id: 'a', text: 'Click the link to see where it goes' },
              { id: 'b', text: 'Delete it and report it as phishing' },
              { id: 'c', text: 'Forward it to your colleagues' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec1-3',
            question: 'Hovering your mouse over a link in an email can show you...',
            options: [
              { id: 'a', text: 'The actual web address it links to' },
              { id: 'b', text: 'If the sender is trustworthy' },
              { id: 'c', text: 'If your antivirus is on' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'sec1-4',
            question: 'Phishing attacks can lead to...',
            options: [
              { id: 'a', text: 'Identity theft' },
              { id: 'b', text: 'Malware infection' },
              { id: 'c', text: 'All of the above' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'sec1-5',
            question:
              'An email from your bank asks for your password to "verify your account". You should:',
            options: [
              { id: 'a', text: 'Reply with your password' },
              { id: 'b', text: 'Ignore and delete the email' },
              { id: 'c', text: 'Call the number listed in the email' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
      level2: {
        id: 'level2',
        title: 'Password Security',
        hint: '7',
        questions: [
          {
            id: 'sec2-1',
            question: 'What is the most secure password?',
            options: [
              { id: 'a', text: 'Password123' },
              { id: 'b', text: 'Tr0ub4dor&3' },
              { id: 'c', text: 'dhlpassword' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec2-2',
            question: 'What is Two-Factor Authentication (2FA)?',
            options: [
              { id: 'a', text: 'Using two different passwords' },
              { id: 'b', text: 'A second verification step after your password' },
              { id: 'c', text: 'A password that is twice as long' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec2-3',
            question: 'How often should you change your main work password?',
            options: [
              { id: 'a', text: 'Every day' },
              { id: 'b', text: 'Never' },
              { id: 'c', text: 'According to company policy (e.g., every 90 days)' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'sec2-4',
            question: 'A password manager is a tool that helps you...',
            options: [
              { id: 'a', text: 'Generate and store strong, unique passwords' },
              { id: 'b', text: 'Share passwords easily with friends' },
              { id: 'c', text: 'Remember just one simple password' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'sec2-5',
            question:
              'Is it safe to write your passwords on a sticky note attached to your monitor?',
            options: [
              { id: 'a', text: 'Yes, if you work from home' },
              { id: 'b', text: 'No, it is never safe' },
              { id: 'c', text: "Only if it's a complex password" },
            ],
            correctOptionId: 'b',
          },
        ],
      },
      level3: {
        id: 'level3',
        title: 'General Security Principles',
        hint: 'DELTA',
        questions: [
          {
            id: 'sec3-1',
            question: 'What is the purpose of a VPN (Virtual Private Network)?',
            options: [
              { id: 'a', text: 'To make your internet faster' },
              { id: 'b', text: 'To encrypt your internet traffic and hide your IP' },
              { id: 'c', text: 'To get free Wi-Fi' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec3-2',
            question: 'What is "social engineering" in the context of cybersecurity?',
            options: [
              { id: 'a', text: 'Designing secure software for social media' },
              { id: 'b', text: 'Manipulating people into giving up confidential info' },
              { id: 'c', text: 'An IT social event' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec3-3',
            question: 'You receive a USB drive from an unknown source. What should you do?',
            options: [
              { id: 'a', text: "Plug it in to see what's on it" },
              { id: 'b', text: 'Give it to IT security to be safely analyzed' },
              { id: 'c', text: 'Throw it away in a public bin' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
    },
    finalPuzzle: {
      title: 'Security Override Protocol',
      description:
        'The main security gate is locked. Combine the hints from the three security levels to form the master override code.',
      solution: 'ALPHA7DELTA',
    },
  },
  'it-services': {
    levels: {
      level1: {
        id: 'level1',
        title: 'Basic Troubleshooting',
        hint: 'TICKET',
        questions: [
          {
            id: 'its1-1',
            question: "What is the first thing you should do if your computer won't turn on?",
            options: [
              { id: 'a', text: 'Check the power supply' },
              { id: 'b', text: 'Restart the router' },
              { id: 'c', text: 'Update the operating system' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'its1-2',
            question: 'How can you tell if your internet connection is working?',
            options: [
              { id: 'a', text: 'The WiFi icon is blue' },
              { id: 'b', text: 'You can access websites' },
              { id: 'c', text: 'The computer is turned on' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'its1-3',
            question: 'What does it mean when your computer shows a "blue screen"?',
            options: [
              { id: 'a', text: 'It is updating' },
              { id: 'b', text: 'There is a system error' },
              { id: 'c', text: 'The battery is low' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'its1-4',
            question: 'How do you restart your computer?',
            options: [
              { id: 'a', text: 'Turn off the power supply' },
              { id: 'b', text: 'Click on the Start menu and select "Restart"' },
              { id: 'c', text: 'Close all applications' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
      level2: {
        id: 'level2',
        title: 'Intermediate Diagnostics',
        hint: '801',
        questions: [
          {
            id: 'its2-1',
            question: 'What steps would you take to troubleshoot a slow computer?',
            options: [
              { id: 'a', text: 'Check for malware and close unused programs' },
              { id: 'b', text: 'Buy a new computer' },
              { id: 'c', text: 'Change the wallpaper' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'its2-2',
            question: 'How can you reset your network settings on a Windows computer?',
            options: [
              { id: 'a', text: 'Through the Control Panel' },
              { id: 'b', text: 'By restarting the computer' },
              { id: 'c', text: 'By turning off the WiFi' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'its2-5',
            question: 'What command can you use to check your IP address in the command prompt?',
            options: [
              { id: 'a', text: 'ipconfig' },
              { id: 'b', text: 'ping' },
              { id: 'c', text: 'netstat' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'its2-6',
            question: 'How can you find out which program is using too much CPU?',
            options: [
              { id: 'a', text: 'Task Manager' },
              { id: 'b', text: 'Control Panel' },
              { id: 'c', text: 'Windows Explorer' },
            ],
            correctOptionId: 'a',
          },
        ],
      },
      level3: {
        id: 'level3',
        title: 'Advanced System Tools',
        hint: '9',
        questions: [
          {
            id: 'its3-1',
            question: "How do you troubleshoot a DNS issue when a website won't load?",
            options: [
              { id: 'a', text: 'Clear the browser cache and check DNS settings' },
              { id: 'b', text: 'Restart the computer' },
              { id: 'c', text: 'Update the browser' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'its3-2',
            question: 'What is the process for diagnosing hardware failures in a computer?',
            options: [
              { id: 'a', text: 'Check the Event Viewer and run hardware diagnostics' },
              { id: 'b', text: 'Replace all parts' },
              { id: 'c', text: 'Reinstall the operating system' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'its3-6',
            question: 'What is the significance of the Event Viewer in Windows troubleshooting?',
            options: [
              { id: 'a', text: 'It shows system logs and errors' },
              { id: 'b', text: 'It speeds up the computer' },
              { id: 'c', text: 'It updates drivers' },
            ],
            correctOptionId: 'a',
          },
        ],
      },
    },
    finalPuzzle: {
      title: 'Master Ticket Resolution',
      description:
        'An automated system has locked the Service Desk. Combine the hints from the three levels to find the Master Ticket ID and unlock the system.',
      solution: 'TICKET8019',
    },
  },
  'it-applications': {
    levels: {
      level1: {
        id: 'level1',
        title: 'Agile & Scrum Basics',
        hint: 'DEPLOY',
        questions: [
          {
            id: 'ita1-1',
            question: 'What is a "sprint" in Scrum?',
            options: [
              { id: 'a', text: 'A quick run to get coffee' },
              { id: 'b', text: 'A short, time-boxed period to complete a set amount of work' },
              { id: 'c', text: 'The final day before a release' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'ita1-2',
            question: 'What is a "user story"?',
            options: [
              { id: 'a', text: 'A bug report from a user' },
              { id: 'b', text: 'A fictional story about a user' },
              {
                id: 'c',
                text: 'An informal explanation of a feature from an end-user perspective',
              },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'ita1-3',
            question: 'The "product backlog" is a list of...',
            options: [
              { id: 'a', text: 'All bugs found in the product' },
              { id: 'b', text: 'Everything that is needed in the product' },
              { id: 'c', text: 'Team members on the project' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
      level2: {
        id: 'level2',
        title: 'Programming Logic',
        hint: '404',
        questions: [
          {
            id: 'ita2-1',
            question: 'What does the acronym "API" stand for?',
            options: [
              { id: 'a', text: 'Application Programming Interface' },
              { id: 'b', text: 'Advanced Programming Instructions' },
              { id: 'c', text: 'Automated Program Interaction' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita2-2',
            question: 'In programming, what does a "boolean" value represent?',
            options: [
              { id: 'a', text: 'A number' },
              { id: 'b', text: 'True or false' },
              { id: 'c', text: 'A line of text' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'ita2-3',
            question: 'Which of these is NOT a common programming language?',
            options: [
              { id: 'a', text: 'Python' },
              { id: 'b', text: 'HTML' },
              { id: 'c', text: 'JavaScript' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
      level3: {
        id: 'level3',
        title: 'Development & Operations (DevOps)',
        hint: 'FIX',
        questions: [
          {
            id: 'ita3-1',
            question: 'What is "version control"?',
            options: [
              { id: 'a', text: 'A system for managing changes to code over time, like Git' },
              { id: 'b', text: 'The version number of an application (e.g., v1.2)' },
              { id: 'c', text: 'A license for using software' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita3-2',
            question: 'What does "CI/CD" stand for?',
            options: [
              { id: 'a', text: 'Continuous Integration / Continuous Deployment' },
              { id: 'b', text: 'Code Integration / Code Delivery' },
              { id: 'c', text: 'Customer Information / Customer Data' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita3-3',
            question: 'What is the goal of DevOps?',
            options: [
              { id: 'a', text: 'To have developers do the job of operations staff' },
              {
                id: 'b',
                text: 'To shorten the development life cycle and deliver features faster',
              },
              { id: 'c', text: 'To use more automated tools' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
    },
    finalPuzzle: {
      title: 'Emergency Production Hotfix',
      description:
        'The automated deployment pipeline has failed. Use the hints from the three levels to enter the correct emergency hotfix command.',
      solution: 'DEPLOY404FIX',
    },
  },
}

export const ROOM_DATA: Room[] = [
  {
    id: 'it-security',
    name: 'DHL IT Security Operations Center',
    backgroundImage: 'https://placehold.co/1920x1080/1a202c/4a5568?text=IT+Security+SOC',
    ...QUESTION_BANK['it-security'],
  },
  {
    id: 'it-services',
    name: 'DHL IT Service Management Hub',
    backgroundImage: 'https://placehold.co/1920x1080/2d3748/4a5568?text=IT+Services+Hub',
    ...QUESTION_BANK['it-services'],
  },
  {
    id: 'it-applications',
    name: 'DHL IT Application Development',
    backgroundImage: 'https://placehold.co/1920x1080/4a5568/718096?text=IT+Application+Dev',
    ...QUESTION_BANK['it-applications'],
  },
]
