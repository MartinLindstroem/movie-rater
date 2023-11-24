# The Maze

Available at https://the-maze-frontend-jxbccvuzla-lz.a.run.app/

## Security Considerations

This section will cover this applications vulnerabilities and/or mitigations against [OWASP Top 10 vulnerabilities](https://owasp.org/www-project-top-ten/).

### Broken Access Control

[Broken Access Control on OWASP](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)

The application is vulnerable to broken access control for the following reasons:

- ~~CORS currently allows API access from any origin.~~

_Fixed_:
_Added cors-origin to only accept requests from the frontend application_

### Cryptographic Failures

[Cryptographic Failures on OWASP](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)

The application is **not** vulnerable to cryptographic failures for the following reasons:

- The passwords are hashed and salted with bcrypt before being stored in the database.

### Injection

[Injection on OWASP](https://owasp.org/Top10/A03_2021-Injection/)

The application is **not** vulnerable to injections for the following reasons:

- It uses firestores API to interact with the firestore database.
- JSX prevents injection attacks by escaping any values before rendering them.

### Insecure Design

[Insecure design on OWASP](https://owasp.org/Top10/A04_2021-Insecure_Design/)

The application contains some vulnerabilities as a result of an insecure design:

- No checks on who has rated which movies, meaning any user can rate the same movie several times.
- No unit or integration tests have been written.

### Security Misconfiguration

[Security Misconfiguration on OWASP](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)

The application contains some vulnerabilities as a result of security misconfigurations:

- The database does not have any permission rules set
- ~~No security headers set by the server~~

_Fixed_: _Security headers set_

### Vulnerable and Outdated Components

[Vulnerable and Outdated Components on OWASP](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

The application does **not** contain any vulnerable or outdated components (to my knowledge).

### Identification and Authentication Failures

[Identification and Authentication Failures on OWASP](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)

The application does contain identification or authentication failure related vulnerabilities for the following reasons:

- The application allows users to use weak passwords.
- The application does not invalidate tokens on logout.

### Software and Data Integrity Failures

[Software and Data Integrity Failures on OWASP](https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/)

N/A

### Security Logging and Monitoring Failures

[Security Logging and Monitoring Failures on OWASP](https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/)

The application has vulnerabilities related to security logging and monitoring for the following reasons:

- There is no logging or monitoring of the application.

### Server-Side Request Forgery (SSRF)

[Server-Side Request Forgery on OWASP](https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/)

The application is **not** vulnerable to SSRF due to the following reason:

- The server does not make any outgoing requests.
