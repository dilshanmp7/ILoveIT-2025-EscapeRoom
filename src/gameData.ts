import type { Room } from '@/types'

// Import DHL I Love IT 2025 branding images
import dhlLoveIt2025Intro1 from '@/assets/DHL_LOVE_IT_ 2025 _Into_1.png'
import wowImage from '@/assets/wow.png'
import iLoveItImage from '@/assets/IloveIT.png'

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
            id: 'sec1-2',
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
            id: 'sec1-3',
            question: 'What type of information do phishing emails typically seek to obtain?',
            options: [
              { id: 'a', text: 'Favorite hobbies' },
              { id: 'b', text: 'Personal information like passwords and credit card numbers' },
              { id: 'c', text: 'Work-related projects' },
              { id: 'd', text: 'Company policies' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec1-4',
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
            id: 'sec1-5',
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
            id: 'sec1-6',
            question: 'What is a common method used by phishing emails to appear legitimate?',
            options: [
              { id: 'a', text: 'Using generic email addresses' },
              { id: 'b', text: 'Spoofing the email address of a trusted source' },
              { id: 'c', text: 'Sending from a personal email account' },
              { id: 'd', text: 'Including a signature with no contact information' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec1-7',
            question: 'How can you verify the legitimacy of a suspicious email?',
            options: [
              { id: 'a', text: "Check the sender's email address carefully" },
              { id: 'b', text: 'Click on the links to see where they lead' },
              { id: 'c', text: 'Contact the company directly using official contact information' },
              { id: 'd', text: 'Both first and third answers' },
            ],
            correctOptionId: 'd',
          },
          {
            id: 'sec1-8',
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
            id: 'sec1-9',
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
      level2: {
        id: 'level2',
        title: 'Password Policy',
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
            question: 'What is the primary objective of a password policy?',
            options: [
              { id: 'a', text: 'To make it easier for employees to remember passwords' },
              {
                id: 'b',
                text: 'To protect sensitive information and ensure compliance with security standards',
              },
              { id: 'c', text: 'To allow unlimited password attempts' },
              { id: 'd', text: 'To eliminate the need for passwords' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec2-2',
            question: 'Which of the following is a characteristic of a strong password?',
            options: [
              { id: 'a', text: 'At least 6 characters long' },
              { id: 'b', text: 'Contains only letters' },
              { id: 'c', text: 'Includes a mix of letters, numbers, and special characters' },
              { id: 'd', text: 'Is a common word' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'sec2-3',
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
            id: 'sec2-4',
            question: 'What is the DHL policy for password to change it after one year?',
            options: [
              { id: 'a', text: '12 characters password' },
              { id: 'b', text: '14 characters password' },
              { id: 'c', text: '10 characters password' },
              { id: 'd', text: '15 Characters password' },
            ],
            correctOptionId: 'd',
          },
          {
            id: 'sec2-5',
            question: 'What is the guideline regarding password reuse?',
            options: [
              { id: 'a', text: 'Users should avoid reusing the last five to ten passwords' },
              { id: 'b', text: 'Passwords can be reused anytime' },
              { id: 'c', text: 'Password reuse is encouraged for convenience' },
              { id: 'd', text: 'There are no restrictions on password reuse' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'sec2-6',
            question: 'Which multi-factor authentication (MFA) used for O365?',
            options: [
              { id: 'a', text: 'Apple Authenticator' },
              { id: 'b', text: 'Microsoft Tokens' },
              { id: 'c', text: 'Biometrics Authenticator' },
              { id: 'd', text: 'Microsoft Authenticator' },
            ],
            correctOptionId: 'd',
          },
          {
            id: 'sec2-7',
            question: 'How should passwords be securely stored?',
            options: [
              { id: 'a', text: 'KeePass Manager' },
              { id: 'b', text: 'Memorize all the passwords' },
              { id: 'c', text: 'On sticky notes attached to the computer' },
              { id: 'd', text: 'In a shared document' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'sec2-8',
            question: 'What type of training should employees receive regarding password security?',
            options: [
              { id: 'a', text: 'How to create weak passwords' },
              { id: 'b', text: 'How to share passwords with colleagues' },
              { id: 'c', text: 'The importance of password management and security practices' },
              { id: 'd', text: 'No training is necessary' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'sec2-9',
            question: 'What should be done if a password is suspected to be compromised?',
            options: [
              { id: 'a', text: 'Ignore it' },
              { id: 'b', text: 'Change the password immediately and notify IT security' },
              { id: 'c', text: 'Wait for IT to discover it' },
              { id: 'd', text: 'Share the new password with colleagues' },
            ],
            correctOptionId: 'b',
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
        questions: [
          {
            id: 'sec3-1',
            question: 'What kind of data is "Customer Service Info"?',
            options: [
              { id: 'a', text: 'Internal use' },
              { id: 'b', text: 'Public' },
              { id: 'c', text: 'Restricted' },
              { id: 'd', text: 'Confidential' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec3-2',
            question: 'Financial Report of 2025 - Yet to be published?',
            options: [
              { id: 'a', text: 'Restricted' },
              { id: 'b', text: 'Internal' },
              { id: 'c', text: 'Confidential' },
              { id: 'd', text: 'Public' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'sec3-3',
            question: 'What is restricted data?',
            options: [
              { id: 'a', text: 'Data that can be freely shared with anyone' },
              { id: 'b', text: 'Data that is irrelevant to the organization' },
              { id: 'c', text: 'Data that is stored in the cloud' },
              { id: 'd', text: 'Data that is accessible only to authorized personnel' },
            ],
            correctOptionId: 'd',
          },
          {
            id: 'sec3-4',
            question: 'What is the primary purpose of data classification in an organization?',
            options: [
              { id: 'a', text: 'To create more complex data storage systems' },
              {
                id: 'b',
                text: 'To categorize data based on its sensitivity and impact on the organization',
              },
              { id: 'c', text: 'To ensure that data is stored in a single location' },
              { id: 'd', text: 'To eliminate the need for data backups' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'sec3-5',
            question: 'IT email communication by cphit@dhl.com.',
            options: [
              { id: 'a', text: 'Public' },
              { id: 'b', text: 'Restricted' },
              { id: 'c', text: 'Internal use' },
              { id: 'd', text: 'Confidential' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'sec3-6',
            question: 'What could be a consequence of improperly handling restricted data?',
            options: [
              { id: 'a', text: 'Data breaches and potential legal repercussions' },
              { id: 'b', text: 'Improved collaboration among teams' },
              { id: 'c', text: 'Increased data visibility' },
              { id: 'd', text: 'Enhanced data quality' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'sec3-7',
            question: 'Third Party SLA & Contract, what kind of Data it is?',
            options: [
              { id: 'a', text: 'Confidential' },
              { id: 'b', text: 'Public' },
              { id: 'c', text: 'Internal Use' },
              { id: 'd', text: 'Restricted' },
            ],
            correctOptionId: 'd',
          },
          {
            id: 'sec3-8',
            question: 'What is a best practice for handling confidential data in an organization?',
            options: [
              { id: 'a', text: 'Using strong passwords and two-factor authentication for access' },
              { id: 'b', text: 'Sharing it openly in team meetings' },
              { id: 'c', text: 'Storing it in unencrypted formats' },
              { id: 'd', text: 'Posting it on public forums for feedback' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'sec3-9',
            question: 'Which two Data classification labels will encrypt your files & emails?',
            options: [
              { id: 'a', text: 'Internal use & Restricted' },
              { id: 'b', text: 'Confidential & Restricted' },
              { id: 'c', text: 'Internal use & Confidential' },
              { id: 'd', text: 'Public & Internal use' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
    },
    finalPuzzle: {
      title: 'DHL Security Command Center Override',
      description:
        'A critical security breach has locked down the DHL IT infrastructure. The automated security system requires a master override code. Combine the security knowledge from all three levels to unlock the system and restore DHL operations.',
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
      title: 'DHL Service Desk Emergency Protocol',
      description:
        'The DHL Service Desk system has crashed during peak hours, affecting shipment tracking worldwide. The emergency recovery system needs a master ticket code. Use your troubleshooting expertise to generate the unlock sequence.',
      solutions: ['T4H', 'H7D'],
    },
  },
  'it-applications': {
    levels: {
      level1: {
        id: 'level1',
        title: 'Application Fundamentals',
        hintOptions: {
          D: [{ text: `The first letter of "DEPLOYMENT"` }],
          C: [{ text: `First letter of "CODE"` }],
        },
        questions: [
          {
            id: 'ita1-1',
            question: 'What is the primary role of the IT Application team?',
            options: [
              { id: 'a', text: 'Managing hardware infrastructure' },
              { id: 'b', text: 'Developing and maintaining software applications' },
              { id: 'c', text: 'Conducting market research' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'ita1-2',
            question: 'What types of tickets typically come under the Application team?',
            options: [
              { id: 'a', text: 'Application Performance Issues' },
              { id: 'b', text: 'Network Configuration Issues' },
              { id: 'c', text: 'Legal Compliance Tickets' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita1-3',
            question: 'What is the primary purpose of DHL Campfire?',
            options: [
              { id: 'a', text: 'To organize outdoor events for employees' },
              { id: 'b', text: "To manage DHL's logistics operations" },
              { id: 'c', text: 'To provide a digital learning and collaboration platform' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'ita1-4',
            question: 'What is Microsoft Power Automate mainly used for?',
            options: [
              { id: 'a', text: 'Making coffee automatically' },
              { id: 'b', text: 'Automating repetitive tasks and workflows' },
              { id: 'c', text: 'Designing customer logos' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'ita1-5',
            question: 'Which team has server access in DHL?',
            options: [
              { id: 'a', text: 'Marketing Team' },
              { id: 'b', text: 'Human Resources Team' },
              { id: 'c', text: 'IT Operations and application Team' },
            ],
            correctOptionId: 'c',
          },
        ],
      },
      level2: {
        id: 'level2',
        title: 'DHL Technology Strategy',
        hintOptions: {
          '4': [{ text: `The number of letters in the word "CODE"` }],
          '3': [{ text: `The number of letters in "API"` }],
        },
        questions: [
          {
            id: 'ita2-1',
            question: 'What does the WOW Strategy – Technology mainly focus on?',
            options: [
              { id: 'a', text: 'Only reducing IT costs' },
              {
                id: 'b',
                text: 'Ensuring IT systems are accessible, secure, and fast from anywhere, plus using data and agile ways of working to deliver new services',
              },
              { id: 'c', text: 'Replacing human staff with robots' },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'ita2-2',
            question: 'What does EGAP stand for?',
            options: [
              { id: 'a', text: 'Express Global Application Portfolio' },
              { id: 'b', text: 'Every Global App Process' },
              { id: 'c', text: 'Enterprise General Access Program' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita2-3',
            question:
              'Which of the following tools available on CPHHUB are powered by Power Automate?',
            options: [
              { id: 'a', text: 'CPH HUB Tour Tool' },
              { id: 'b', text: 'Local clearance application' },
              { id: 'c', text: 'Butterfly Reports' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita2-4',
            question: 'What is an example of something you could automate with Power Automate?',
            options: [
              { id: 'a', text: 'Automatically send an email when a shipment status changes' },
              { id: 'b', text: 'Build an airplane' },
              { id: 'c', text: 'Manage customs regulations directly' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita2-5',
            question:
              'In DHL, which stakeholders are typically involved in the BRS review process?',
            options: [
              { id: 'a', text: 'Only the project team' },
              { id: 'b', text: 'Only the development team' },
              { id: 'c', text: 'Project team and Apps Team' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'ita2-6',
            question: 'In DHL, The Application team responsible for which type of applications?',
            options: [
              { id: 'a', text: 'Only locally developed apps' },
              { id: 'b', text: 'Only regional global apps' },
              { id: 'c', text: 'Both locally developed & regional global apps' },
            ],
            correctOptionId: 'c',
          },
          {
            id: 'ita2-7',
            question: 'Should each application have a login ID and password for user access?',
            options: [
              { id: 'a', text: 'Yes, to ensure security and protect user data.' },
              { id: 'b', text: 'No, as it complicates the user experience unnecessarily.' },
              { id: 'c', text: 'Only for mobile applications, not for web applications.' },
            ],
            correctOptionId: 'a',
          },
        ],
      },
      level3: {
        id: 'level3',
        title: 'DHL Digital Innovation',
        hintOptions: {
          A: [{ text: `The last letter of "BETA"` }],
          X: [{ text: `The last letter of "HOTFIX"` }],
        },
        questions: [
          {
            id: 'ita3-1',
            question: 'Which of these is a real benefit of Power Automate for business processes?',
            options: [
              { id: 'a', text: 'Reducing manual errors by standardizing workflows' },
              { id: 'b', text: 'Tracking airplane fuel consumption' },
              { id: 'c', text: 'Forecasting weather in hub cities' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita3-2',
            question: "In DHL's digitalization journey, what is the role of automation?",
            options: [
              {
                id: 'a',
                text: 'To replace manual tasks with RPA, and robotics for fewer errors and faster operations',
              },
              { id: 'b', text: 'To automate employee performance reviews' },
              { id: 'c', text: 'To create automatic price discounts for all shipments' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita3-3',
            question: 'The Yellow Book of Architecture includes…',
            options: [
              {
                id: 'a',
                text: 'IT standards and architecture principles, Guidelines for tools and methodologies, Data privacy guidelines.',
              },
              { id: 'b', text: "DHL's financial performance reports" },
              { id: 'c', text: "DHL's annual KPI" },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita3-4',
            question: 'Which is a real example of Country Collaboration initiatives at DHL?',
            options: [
              { id: 'a', text: 'DHL Language Learning App (Germany)' },
              {
                id: 'b',
                text: 'DHL collaborated with Spotify in Sweden to create a music-streaming app for drivers to reduce stress on long routes',
              },
              { id: 'c', text: 'Each country building separate IT stacks.' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita3-5',
            question: 'What is the main difference between IT Developers and Application Analysts?',
            options: [
              {
                id: 'a',
                text: 'IT Developers primarily focus on coding and building software, while Application Analysts focus on gathering and analyzing business requirements.',
              },
              {
                id: 'b',
                text: 'IT Developers manage hardware installations, while Application Analysts oversee marketing strategies.',
              },
              {
                id: 'c',
                text: 'IT Developers work exclusively on user interface design, while Application Analysts handle financial reporting.',
              },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'ita3-6',
            question: 'How should an application ideally look and function?',
            options: [
              {
                id: 'a',
                text: 'It should have a complex design with many features that confuse users.',
              },
              {
                id: 'b',
                text: 'It should be intuitive, user-friendly, and visually appealing, with a clear layout and easy navigation.',
              },
              {
                id: 'c',
                text: 'It should prioritize flashy graphics over functionality and usability.',
              },
            ],
            correctOptionId: 'b',
          },
          {
            id: 'ita3-7',
            question: 'What are the key pillars of DHL in terms of IT applications?',
            options: [
              { id: 'a', text: 'User Experience, Security, Integration, and Scalability' },
              { id: 'b', text: 'Marketing, Sales, Finance, and HR' },
              { id: 'c', text: 'Customer Service, Product Development, Logistics, and Branding' },
            ],
            correctOptionId: 'a',
          },
        ],
      },
    },
    finalPuzzle: {
      title: 'DHL Digital Platform Recovery',
      description:
        "A critical failure in DHL's digital infrastructure has disrupted global operations. The automated deployment pipeline requires an emergency hotfix command. Apply your DHL technology knowledge to restore all applications and services.",
      solutions: ['D4A', 'C3X'],
    },
  },
}

// This part remains, but now references the more complex PUZZLE_DATA with DHL I Love IT 2025 branding
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
