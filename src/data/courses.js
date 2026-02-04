import {
    Trophy, Shield, Search, Globe, Lock, Terminal,
    FileText, Zap, BookOpen, Target, Server, Database
} from 'lucide-react';

export const courses = [
    {
        id: 'intro-to-bug-bounty',
        title: 'Bug Bounty Hunting 101',
        description: 'The complete beginner\'s guide to ethical hacking. Learn how to legally hack companies and get paid for it.',
        icon: Trophy,
        level: 'Beginner',
        duration: '2h 30m',
        xp: 500,
        modules: [
            {
                id: 'm1',
                title: 'Introduction to Bug Bounties',
                duration: '30m',
                lessons: [
                    {
                        id: 'what-is-bug-bounty',
                        title: 'What is Bug Bounty?',
                        type: 'text',
                        duration: '10m',
                        xp: 50,
                        content: `
# What is a Bug Bounty?

A bug bounty program is a deal offered by many websites, organizations and software developers by which individuals can receive recognition and compensation for reporting bugs, especially those pertaining to security exploits and vulnerabilities.

## Why Companies Do This?

- **Continuous Security**: Traditional penetration testing is done annually. Bug bounties are 24/7.
- **Diverse Talent**: Thousands of hackers with different skills test the system.
- **Cost Effective**: They only pay for valid, found vulnerabilities.

## The Players

1.  **Program Owner**: The company getting hacked (e.g., Google, Uber).
2.  **Platform**: The intermediary (e.g., HackerOne, Bugcrowd).
3.  **Researcher (You)**: The hunter finding the bugs.
                        `
                    },
                    {
                        id: 'legal-and-ethics',
                        title: 'Ethics & Legal Boundaries',
                        type: 'text',
                        duration: '10m',
                        xp: 50,
                        content: `
# Staying Legal

Hacking is illegal without permission. Bug bounty programs give you that permission, but only within strict boundaries called **Scope**.

## The Golden Rules

1.  **Scope is God**: Only test domains listed in scope.
2.  **Do No Harm**: Never delete data or crash services.
3.  **Privacy First**: If you find user data, stop and report. Don't dump the database.

> [!IMPORTANT]
> Always read the program policy before sending a single request. Creating an account on a production system without permission can get you banned or sued.
                        `
                    },
                    {
                        id: 'platforms-intro',
                        title: 'Overview of Platforms',
                        type: 'text',
                        duration: '10m',
                        xp: 50,
                        content: `
# Major Platforms

Most programs are hosted on these major platforms:

- **HackerOne**: The largest platform. Good for beginners but competitive.
- **Bugcrowd**: Known for good triage and private invites.
- **Intigriti**: Leading European platform, very community focused.
- **Synack**: Requires vetting/interview to join (Private only).

## Private vs Public

- **Public**: Anyone can join. Huge competition. Harder to find bugs.
- **Private**: Invite only. Less competition. Easier to find bugs.
                        `
                    }
                ]
            },
            {
                id: 'm2',
                title: 'Setting Up Your Lab',
                duration: '45m',
                lessons: [
                    {
                        id: 'burpsuite-setup',
                        title: 'Setting up Burp Suite',
                        type: 'text',
                        duration: '25m',
                        xp: 100,
                        content: `
# Burp Suite: The Hacker's Swiss Army Knife

Burp Suite is an intercepting proxy. It sits between your browser and the target server, allowing you to pause, view, and modify requests before they are sent.

## Core Components

1.  **Proxy**: Intercepts requests.
2.  **Repeater**: Modify and resend requests manually (Most used tab!).
3.  **Intruder**: Automate attacks (Brute force, Fuzzing).
4.  **Decoder**: Encoding/Decoding data (Base64, URL, etc).

## Installation

1.  Download **Burp Suite Community Edition** (Free).
2.  Install the certificate in your browser to inspect HTTPS traffic.
3.  Use the built-in Chromium browser for zero-config hacking.
                        `
                    },
                    {
                        id: 'browser-tools',
                        title: 'Essential Browser Extensions',
                        type: 'text',
                        duration: '20m',
                        xp: 50,
                        content: `
# Must-Have Extensions

Equip your browser (Firefox/Chrome) with these tools:

- **Wappalyzer**: Identifies technology stack (CMS, Frameworks, Libraries).
- **FoxyProxy**: Quickly switch Burp Proxy on/off.
- **HackTools**: Cheatsheets for XSS, SQLi payloads.
- **Cookie Editor**: View and modify cookies easily.
- **DotGit**: Checks for exposed .git directories.
                        `
                    }
                ]
            },
            {
                id: 'm3',
                title: 'Reconnaissance',
                duration: '45m',
                lessons: [
                    {
                        id: 'subdomain-enum',
                        title: 'Subdomain Enumeration',
                        type: 'text',
                        duration: '25m',
                        xp: 100,
                        content: `
# Finding the Attack Surface

The more you find, the more you can hack. Subdomain enumeration is finding the subdomains of a target.

## Why?
Main sites (www.target.com) are hardened. Dev sites (dev.target.com), staging (staging.api.target.com), or internal portals are often vulnerable.

## Tools
- **Subfinder**: Fast passive enumeration.
- **Amass**: Deep enumeration (Passive + Active).
- **Chaos**: Project Discovery's massive dataset.
                        `
                    },
                    {
                        id: 'tech-profiling',
                        title: 'Technology Profiling',
                        type: 'text',
                        duration: '20m',
                        xp: 50,
                        content: `
# Know Your Enemy

Before attacking, understand what the target is built with.

1.  **Wappalyzer**: Shows server type, JS libs.
2.  **HTTP Headers**: look for 'Server', 'X-Powered-By'.
3.  **GitHub**: Search for the company's repos.

> [!TIP]
> If you know they use an old version of WordPress, you can look for specific CVEs (Common Vulnerabilities) for that version instead of guessing.
                        `
                    }
                ]
            },
            {
                id: 'm4',
                title: 'First Vulnerabilities',
                duration: '30m',
                lessons: [
                    {
                        id: 'owasp-intro',
                        title: 'Intro to OWASP Top 10',
                        type: 'text',
                        duration: '15m',
                        xp: 50,
                        content: `
# The Holy Bible of Web Security

OWASP Top 10 is a standard awareness document for developers and web application security. It lists the most critical security risks to web applications.

1.  **Broken Access Control** (IDOR)
2.  **Cryptographic Failures**
3.  **Injection** (SQLi, Command Injection)
4.  **Insecure Design**
5.  **Security Misconfiguration**
                        `
                    },
                    {
                        id: 'idor-basics',
                        title: 'Finding Your First IDOR',
                        type: 'text',
                        duration: '15m',
                        xp: 75,
                        content: `
# Insecure Direct Object Reference (IDOR)

IDOR happens when an application exposes a reference to an internal object (like a file or database key) without checking access control.

## Example
\`https://api.site.com/user/1001\`

If I change \`1001\` to \`1002\` and see someone else's data, that's an IDOR.

## How to find?
1.  Create two accounts.
2.  Find ID parameters (user_id, order_id).
3.  Swap the ID from Account A into a request from Account B.
4.  If it works -> **BOUNTY!** $$
                        `
                    }
                ]
            }
        ]
    },
    {
        id: 'network-security-101',
        title: 'Network Security',
        description: 'Master the art of network mapping, packet analysis, and exploiting common services.',
        icon: Server,
        level: 'Intermediate',
        duration: '3h 15m',
        xp: 800,
        modules: [
            {
                id: 'net-m1',
                title: 'Network Fundamentals',
                duration: '45m',
                lessons: [
                    {
                        id: 'nmap-basics',
                        title: 'Nmap Scanning',
                        type: 'text', // Keeping 'text' as primary type, but video acts as enhancement
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // TODO: Replace with your actual unlisted YouTube URL
                        duration: '20m',
                        xp: 75,
                        content: `# Nmap: Network Mapper\n\nLearn how to discover hosts and services on a computer network.`
                    },
                    {
                        id: 'wireshark-intro',
                        title: 'Packet Analysis with Wireshark',
                        type: 'text',
                        duration: '25m',
                        xp: 75,
                        content: `# Wireshark\n\nThe world's foremost network protocol analyzer.`
                    }
                ]
            }
        ]
    },
    {
        id: 'python-for-pentesters',
        title: 'Python for Pentesters',
        description: 'Automate your attacks and build custom tools using Python.',
        icon: Terminal,
        level: 'Advanced',
        duration: '4h',
        xp: 1200,
        modules: [
            {
                id: 'py-m1',
                title: 'Python Basics for Hacking',
                duration: '60m',
                lessons: [
                    {
                        id: 'python-requests',
                        title: 'Automating HTTP with Requests',
                        type: 'text',
                        duration: '30m',
                        xp: 100,
                        content: `# Python Requests\n\nHow to send HTTP requests using Python code.`
                    },
                    {
                        id: 'writing-exploits',
                        title: 'Writing Custom Exploits',
                        type: 'text',
                        duration: '30m',
                        xp: 100,
                        content: `# Custom Exploits\n\nTranslating manual attacks into automated Python scripts.`
                    }
                ]
            }
        ]
    }
];
