import type { Room } from '@/types'

// New data structure for randomized hints and solutions
export const PUZZLE_DATA: Record<Room['id'], Omit<Room, 'id' | 'name' | 'backgroundImage'>> = {
  'it-security': {
    levels: {
      level1: {
        id: 'level1',
        title: 'Phishing Analysis',
        // Hint pools for each possible character of the final code
        hintOptions: {
          P: [
            { text: `First letter of the word "PHISHING"` },
            { text: `First letter of the word "PASSWORD"` },
          ],
          K: [
            { text: `First letter of the word "KEYLOGGER"` },
            { text: `The first letter in "Known Threats"` },
          ],
        },
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
        ],
      },
      level2: {
        id: 'level2',
        title: 'Password Security',
        hintOptions: {
          '4': [
            { text: `The number of letters in the word "LOCK"` },
            { text: `The number of letters in the word "SAFE"` },
          ],
          '9': [
            { text: `The number of letters in "ENCRYPTION"` },
            { text: `The number on the NINE key` },
          ],
        },
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
            question: 'What is a strong password characteristic?',
            options: [
              { id: 'a', text: 'Contains personal information' },
              { id: 'b', text: 'Uses a mix of letters, numbers, and symbols' },
              { id: 'c', text: 'Is easy to remember and share' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
      level3: {
        id: 'level3',
        title: 'General Security Principles',
        hintOptions: {
          S: [
            { text: `Last letter of the word "ACCESS"` },
            { text: `The first letter of "SECURITY"` },
          ],
          T: [
            { text: `The last letter of the word "THREAT"` },
            { text: `First letter of "TWO-FACTOR"` },
          ],
        },
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
          {
            id: 'sec3-4',
            question: 'What is the principle of "least privilege"?',
            options: [
              { id: 'a', text: 'Give users maximum access rights' },
              { id: 'b', text: 'Give users only the minimum access they need' },
              { id: 'c', text: 'Give everyone admin privileges' },
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
      solutions: ['P4S', 'K9T'],
    },
  },
  'it-services': {
    levels: {
      level1: {
        id: 'level1',
        title: 'Basic Troubleshooting',
        hintOptions: {
          T: [{ text: `The first letter of the word "TICKET"` }],
          H: [{ text: `First letter of "HELP DESK"` }],
        },
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
            question: 'What should you do if your keyboard is not responding?',
            options: [
              { id: 'a', text: "Check if it's properly connected" },
              { id: 'b', text: 'Restart the entire system immediately' },
              { id: 'c', text: 'Buy a new computer' },
            ],
            correctOptionId: 'a',
          },
        ],
      },
      level2: {
        id: 'level2',
        title: 'Intermediate Diagnostics',
        hintOptions: {
          '4': [{ text: `How many letters in the word "DESK"?` }],
          '8': [{ text: `The number of letters in "TROUBLE"` }],
        },
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
            id: 'its2-3',
            question: 'What is the purpose of clearing browser cache?',
            options: [
              { id: 'a', text: 'To free up storage space and fix loading issues' },
              { id: 'b', text: 'To make the browser faster permanently' },
              { id: 'c', text: 'To delete all your saved passwords' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'its2-4',
            question: 'If an application freezes, what is the best first step?',
            options: [
              { id: 'a', text: 'Wait for it to unfreeze automatically' },
              { id: 'b', text: 'Force close the application' },
              { id: 'c', text: 'Restart the computer immediately' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
      level3: {
        id: 'level3',
        title: 'Advanced System Tools',
        hintOptions: {
          H: [{ text: `The first letter of the word "HELP"` }],
          D: [{ text: `First letter of "DIAGNOSTICS"` }],
        },
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
            id: 'its3-3',
            question: 'What tool can help you monitor system performance in Windows?',
            options: [
              { id: 'a', text: 'Task Manager' },
              { id: 'b', text: 'Notepad' },
              { id: 'c', text: 'Calculator' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'its3-4',
            question: 'How can you check if a service is running in Windows?',
            options: [
              { id: 'a', text: 'Through Services.msc or Task Manager' },
              { id: 'b', text: 'By looking at the desktop' },
              { id: 'c', text: 'By checking the recycle bin' },
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
      solutions: ['T4H', 'H8D'],
    },
  },
  'it-applications': {
    levels: {
      level1: {
        id: 'level1',
        title: 'Agile & Scrum Basics',
        hintOptions: {
          D: [{ text: `The first letter of "DEPLOYMENT"` }],
          C: [{ text: `First letter of "CODE"` }],
        },
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
            question: 'What does "MVP" stand for in product development?',
            options: [
              { id: 'a', text: 'Most Valuable Player' },
              { id: 'b', text: 'Minimum Viable Product' },
              { id: 'c', text: 'Maximum Value Proposition' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'ita1-4',
            question: 'What is the purpose of a daily standup meeting?',
            options: [
              { id: 'a', text: 'To assign new tasks' },
              { id: 'b', text: 'To share progress and identify blockers' },
              { id: 'c', text: 'To review the final product' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
      level2: {
        id: 'level2',
        title: 'Programming Logic',
        hintOptions: {
          '4': [{ text: `The number of letters in the word "CODE"` }],
          '3': [{ text: `The number of letters in "API"` }],
        },
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
            question: 'What is debugging?',
            options: [
              { id: 'a', text: 'Writing new code' },
              { id: 'b', text: 'Finding and fixing errors in code' },
              { id: 'c', text: 'Deleting old files' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'ita2-4',
            question: 'What does "DRY" principle mean in programming?',
            options: [
              { id: 'a', text: "Don't Repeat Yourself" },
              { id: 'b', text: 'Debug Regularly, Yearly' },
              { id: 'c', text: 'Develop Rapidly, Yesterday' },
            ],
            correctOptionId: 'a',
          },
        ],
      },
      level3: {
        id: 'level3',
        title: 'Development & Operations (DevOps)',
        hintOptions: {
          A: [{ text: `The last letter of "BETA"` }],
          X: [{ text: `The last letter of "HOTFIX"` }],
        },
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
            question: 'What is the main benefit of automated testing?',
            options: [
              { id: 'a', text: 'It makes code run faster' },
              { id: 'b', text: 'It helps catch bugs early and ensures code quality' },
              { id: 'c', text: 'It writes code automatically' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'ita3-4',
            question: 'What does "deployment" mean in software development?',
            options: [
              { id: 'a', text: 'Writing code' },
              { id: 'b', text: 'Testing applications' },
              { id: 'c', text: 'Releasing software to production environment' },
            ],
            correctOptionId: 'c',
          },
        ],
      },
    },
    finalPuzzle: {
      title: 'Emergency Production Hotfix',
      description:
        'The automated deployment pipeline has failed. Use the hints from the three levels to enter the correct emergency hotfix command.',
      solutions: ['D4A', 'C3X'],
    },
  },
}

// This part remains, but now references the more complex PUZZLE_DATA
export const ROOM_DATA: Room[] = [
  {
    id: 'it-security',
    name: 'DHL IT Security Operations Center',
    backgroundImage: 'https://placehold.co/1920x1080/1a202c/4a5568?text=IT+Security+SOC',
    ...PUZZLE_DATA['it-security'],
  },
  {
    id: 'it-services',
    name: 'DHL IT Service Management Hub',
    backgroundImage: 'https://placehold.co/1920x1080/2d3748/4a5568?text=IT+Services+Hub',
    ...PUZZLE_DATA['it-services'],
  },
  {
    id: 'it-applications',
    name: 'DHL IT Application Development',
    backgroundImage: 'https://placehold.co/1920x1080/4a5568/718096?text=IT+Application+Dev',
    ...PUZZLE_DATA['it-applications'],
  },
]
