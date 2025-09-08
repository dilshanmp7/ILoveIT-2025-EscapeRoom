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
        questionPools: {
          easy: [
            {
              id: 'sec1-easy-1',
              question: 'What is phishing?',
              options: [
                { id: 'a', text: 'A method to catch fish' },
                { id: 'b', text: 'A fraudulent attempt to obtain sensitive information' },
                { id: 'c', text: 'A type of email marketing' },
                { id: 'd', text: 'A social media trend' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'sec1-easy-2',
              question: 'Which of the following is a common sign of a phishing email?',
              options: [
                { id: 'a', text: 'A personalized greeting' },
                { id: 'b', text: 'A sense of urgency in the message' },
                { id: 'c', text: 'A professional logo' },
                { id: 'd', text: 'A clear subject line' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'sec1-easy-3',
              question: 'What type of information do phishing emails typically seek to obtain?',
              options: [
                { id: 'a', text: 'Favorite hobbies' },
                { id: 'b', text: 'Personal information like passwords and credit card numbers' },
                { id: 'c', text: 'Work-related projects' },
                { id: 'd', text: 'Company policies' },
              ],
              correctOptionId: 'b',
            },
          ],
          medium: [
            {
              id: 'sec1-medium-1',
              question:
                'What should you do if you receive an email from an unknown sender requesting personal information?',
              options: [
                { id: 'a', text: 'Reply with the information they requested' },
                { id: 'b', text: 'Ignore the email' },
                { id: 'c', text: 'Forward the email to your IT department or security team' },
                { id: 'd', text: 'Click on the links to check their validity' },
              ],
              correctOptionId: 'c',
            },
            {
              id: 'sec1-medium-2',
              question: 'Which of the following is NOT a typical feature of a phishing email?',
              options: [
                { id: 'a', text: 'Poor grammar and spelling' },
                { id: 'b', text: 'A legitimate company email address' },
                { id: 'c', text: 'Suspicious attachments or links' },
                { id: 'd', text: 'Requests for urgent action' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'sec1-medium-3',
              question: 'What is a common method used by phishing emails to appear legitimate?',
              options: [
                { id: 'a', text: 'Using generic email addresses' },
                { id: 'b', text: 'Spoofing the email address of a trusted source' },
                { id: 'c', text: 'Sending from a personal email account' },
                { id: 'd', text: 'Including a signature with no contact information' },
              ],
              correctOptionId: 'b',
            },
          ],
          complex: [
            {
              id: 'sec1-complex-1',
              question: 'How can you verify the legitimacy of a suspicious email?',
              options: [
                { id: 'a', text: "Check the sender's email address carefully" },
                { id: 'b', text: 'Click on the links to see where they lead' },
                {
                  id: 'c',
                  text: 'Contact the company directly using official contact information',
                },
                { id: 'd', text: 'Both A and C' },
              ],
              correctOptionId: 'd',
            },
            {
              id: 'sec1-complex-2',
              question: 'What is spear phishing?',
              options: [
                { id: 'a', text: 'Phishing that targets a large number of people' },
                {
                  id: 'b',
                  text: 'A targeted attempt to steal sensitive information from a specific individual',
                },
                { id: 'c', text: 'Phishing that uses social media as a platform' },
                { id: 'd', text: 'A type of phishing that involves fake websites' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'sec1-complex-3',
              question:
                'If you accidentally clicked on a link in a phishing email, what should you do immediately?',
              options: [
                { id: 'a', text: 'Ignore it and continue with your work' },
                { id: 'b', text: 'Disconnect from the internet and run a security scan' },
                { id: 'c', text: 'Forward the email to your friends' },
                { id: 'd', text: 'Change your email password later' },
              ],
              correctOptionId: 'b',
            },
          ],
        },
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
            { text: `The number of letters in "FIREWALLS"` },
            { text: `The number on the NINE key` },
          ],
        },
        questions: [
          {
            id: 'sec2-1',
            question: 'What is a password?',
            options: [
              { id: 'a', text: 'A type of software' },
              { id: 'b', text: 'A secret word or phrase used for authentication' },
              { id: 'c', text: 'A hardware component' },
              { id: 'd', text: 'A network protocol' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec2-2',
            question: 'Why is it important to have a strong password?',
            options: [
              { id: 'a', text: 'It makes logging in faster' },
              { id: 'b', text: 'It is easier to remember' },
              { id: 'c', text: 'It looks good on paper' },
              { id: 'd', text: 'It protects your accounts from unauthorized access' },
            ],
            correctOptionId: 'd',
          },
          {
            id: 'sec2-3',
            question: 'Which of the following is a characteristic of a strong password?',
            options: [
              { id: 'a', text: 'It contains only letters' },
              { id: 'b', text: 'It is at least 8 characters long' },
              { id: 'c', text: 'It includes a mix of letters, numbers, and symbols' },
              { id: 'd', text: 'It is the same as your username' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'sec2-4',
            question: 'How often should passwords be changed?',
            options: [
              { id: 'a', text: 'Every 3 to 6 months' },
              { id: 'b', text: 'Never' },
              { id: 'c', text: 'Every month' },
              { id: 'd', text: 'Only when forgotten' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'sec2-5',
            question: 'What is multi-factor authentication (MFA)?',
            options: [
              { id: 'a', text: 'A method to remember passwords' },
              { id: 'b', text: 'A type of password' },
              { id: 'c', text: 'A software that generates passwords' },
              { id: 'd', text: 'A security measure requiring multiple forms of verification' },
            ],
            correctOptionId: 'd',
          },
          {
            id: 'sec2-6',
            question: 'What is a risk of using the same password across multiple accounts?',
            options: [
              { id: 'a', text: 'It makes it easier to remember' },
              { id: 'b', text: 'It increases the risk of all accounts being compromised' },
              { id: 'c', text: 'It does not affect security' },
              { id: 'd', text: 'It speeds up the login process' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec2-7',
            question: 'What is the purpose of a password manager?',
            options: [
              { id: 'a', text: 'To create weak passwords' },
              { id: 'b', text: 'To change passwords automatically' },
              { id: 'c', text: 'To send passwords via email' },
              { id: 'd', text: 'To store and manage passwords securely' },
            ],
            correctOptionId: 'd',
          },
          {
            id: 'sec2-8',
            question: 'How can users identify phishing attempts?',
            options: [
              { id: 'a', text: 'By checking for suspicious email addresses' },
              { id: 'b', text: 'By trusting all emails from known senders' },
              { id: 'c', text: 'By ignoring emails about account security' },
              { id: 'd', text: 'By clicking on all links provided' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'sec2-9',
            question: 'What is password hashing?',
            options: [
              { id: 'a', text: 'A way to remember passwords' },
              { id: 'b', text: 'A technique to generate passwords' },
              { id: 'c', text: 'A method of encrypting passwords for storage' },
              { id: 'd', text: 'A type of password' },
            ],
            correctOptionId: 'c',
          },
        ],
      },
      level3: {
        id: 'level3',
        title: 'Data Classification',
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
        questionPools: {
          easy: [
            {
              id: 'sec3-easy-1',
              question: 'What does "For Internal Use Only" mean in data classification?',
              options: [
                { id: 'a', text: 'Data that can be shared with the public' },
                { id: 'b', text: 'Data that is intended for use within the organization only' },
                { id: 'c', text: 'Data that is archived' },
                { id: 'd', text: 'Data that is automatically deleted' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'sec3-easy-2',
              question: 'Which of the following is an example of confidential data?',
              options: [
                { id: 'a', text: 'Company policies' },
                { id: 'b', text: 'Marketing brochures' },
                { id: 'c', text: 'Employee Social Security numbers' },
                { id: 'd', text: 'Public press releases' },
              ],
              correctOptionId: 'c',
            },
            {
              id: 'sec3-easy-3',
              question: 'What is restricted data?',
              options: [
                { id: 'a', text: 'Data that can be freely shared with anyone' },
                { id: 'b', text: 'Data that is irrelevant to the organization' },
                { id: 'c', text: 'Data that is stored in the cloud' },
                { id: 'd', text: 'Data that is accessible only to authorized personnel' },
              ],
              correctOptionId: 'd',
            },
          ],
          medium: [
            {
              id: 'sec3-medium-1',
              question:
                'What is the primary purpose of classifying data as "For Internal Use Only"?',
              options: [
                { id: 'a', text: 'To allow unrestricted access' },
                {
                  id: 'b',
                  text: 'To protect sensitive information and limit access to authorized users',
                },
                { id: 'c', text: 'To promote data sharing across departments' },
                { id: 'd', text: 'To simplify data storage' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'sec3-medium-2',
              question:
                'Which of the following actions is appropriate for handling confidential data?',
              options: [
                { id: 'a', text: 'Sharing it via personal email' },
                { id: 'b', text: 'Storing it on unsecured devices' },
                { id: 'c', text: 'Encrypting it and limiting access to authorized personnel' },
                { id: 'd', text: 'Publicly discussing it in meetings' },
              ],
              correctOptionId: 'c',
            },
            {
              id: 'sec3-medium-3',
              question: 'What could be a consequence of improperly handling restricted data?',
              options: [
                { id: 'a', text: 'Data breaches and potential legal repercussions' },
                { id: 'b', text: 'Improved collaboration among teams' },
                { id: 'c', text: 'Increased data visibility' },
                { id: 'd', text: 'Enhanced data quality' },
              ],
              correctOptionId: 'a',
            },
          ],
          complex: [
            {
              id: 'sec3-complex-1',
              question:
                'How should an organization manage "For Internal Use Only" data to ensure compliance?',
              options: [
                { id: 'a', text: 'By allowing all employees to access it without restrictions' },
                { id: 'b', text: 'By ignoring it after initial classification' },
                { id: 'c', text: 'By storing it on shared drives accessible to everyone' },
                { id: 'd', text: 'By implementing access controls and regular audits' },
              ],
              correctOptionId: 'd',
            },
            {
              id: 'sec3-complex-2',
              question:
                'What is a best practice for handling confidential data in an organization?',
              options: [
                {
                  id: 'a',
                  text: 'Using strong passwords and two-factor authentication for access',
                },
                { id: 'b', text: 'Sharing it openly in team meetings' },
                { id: 'c', text: 'Storing it in unencrypted formats' },
                { id: 'd', text: 'Posting it on public forums for feedback' },
              ],
              correctOptionId: 'a',
            },
            {
              id: 'sec3-complex-3',
              question:
                'Why is it important to train employees on the handling of restricted and confidential data?',
              options: [
                { id: 'a', text: 'To promote data sharing' },
                {
                  id: 'b',
                  text: 'To ensure they understand the risks and comply with data protection policies',
                },
                { id: 'c', text: 'To increase the amount of data collected' },
                { id: 'd', text: 'To eliminate the need for data classification' },
              ],
              correctOptionId: 'b',
            },
          ],
        },
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
          '7': [{ text: `The number of letters in "TROUBLE"` }],
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
      solutions: ['T4H', 'H7D'],
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
    name: 'IT Security',
    backgroundImage: 'https://placehold.co/1920x1080/1a202c/4a5568?text=IT+Security',
    ...PUZZLE_DATA['it-security'],
  },
  {
    id: 'it-services',
    name: 'IT Service',
    backgroundImage: 'https://placehold.co/1920x1080/2d3748/4a5568?text=IT+Services',
    ...PUZZLE_DATA['it-services'],
  },
  {
    id: 'it-applications',
    name: 'IT Applications',
    backgroundImage: 'https://placehold.co/1920x1080/4a5568/718096?text=IT+Application',
    ...PUZZLE_DATA['it-applications'],
  },
]
