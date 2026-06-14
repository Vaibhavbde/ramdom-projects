export const hackerScript = `
[root@kali ~]# initializing breach protocol v2.7...
[root@kali ~]# running network reconnaissance scan on target IP: 192.168.1.101

[INFO] Pinging 192.168.1.101 with 32 bytes of data:
[INFO] Reply from 192.168.1.101: bytes=32 time<1ms TTL=128
[INFO] Ping statistics for 192.168.1.101: Packets: Sent = 4, Received = 4, Lost = 0 (0% loss).

[SUCCESS] Host is online. Starting deep port scan...
[INFO] Scanning ports 1-65535...
[RESULT] Open Port: 22 (SSH - OpenSSH 7.6p1)
[RESULT] Open Port: 80 (HTTP - Apache httpd 2.4.29)
[RESULT] Open Port: 443 (HTTPS - Apache httpd 2.4.29)
[RESULT] Open Port: 3306 (MYSQL - MySQL 5.7.32)

[ALERT] Apache server version 2.4.29 detected. Known vulnerability: CVE-2021-41773 (Path Traversal).
[root@kali ~]# Preparing exploit payload for CVE-2021-41773...

[root@kali ~]# ./exploit -t 192.168.1.101 -p 80 --payload "/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd"

[*] Sending crafted HTTP request to target...
[*] Bypassing Web Application Firewall...
[+] Firewall bypassed.
[+] Exploit sent successfully. Analyzing response...

[SUCCESS] Remote code execution vulnerability confirmed. Shell access obtained.
[INFO] Spawning reverse shell... connection established.

www-data@target:/var/www/html$ whoami
www-data
www-data@target:/var/www/html$ searching for privilege escalation vectors...
www-data@target:/var/www/html$ kernel version 5.4.0 is vulnerable to CVE-2021-3493.

www-data@target:/var/www/html$ compiling local privilege escalation exploit...
www-data@target:/var/www/html$ gcc exploit_CVE-2021-3493.c -o pwn_root
www-data@target:/var/www/html$ ./pwn_root

[+] Exploit successful. Root privileges acquired.
root@target:/# whoami
root
root@target:/# accessing root directory...
root@target:/# disabling security protocols...
root@target:/# rm -rf /sys/firmware/acpi/tables/DSDT
[SUCCESS] System security disabled.

root@target:/# locating primary data vault...
root@target:/# initiating core data exfiltration...
[###################################] 100%
[INFO] Data transfer complete. Wiping tracks...

[SYSTEM COMPROMISED]
`;