# Cookie

An HTTP cookie (also called web cookie, Internet cookie, browser cookie, or simply cookie) is a small piece of data stored on the user's computer by the web browser while browsing a website.
Typically, it's used to tell if two requests came from the same browser — keeping a user logged-in, for example. It remembers stateful information for the stateless HTTP protocol.

### Cookies are mainly used for three purposes:

- Session management
  Logins, shopping carts, game scores, or anything else the server should remember

- Personalization
  User preferences, themes, and other settings

- Tracking
  Recording and analyzing user behavior

Cookies were once used for general client-side storage. While this was legitimate when they were the only way to store data on the client, it is now recommended to use modern storage APIs. Cookies are sent with every request, so they can worsen performance (especially for mobile data connections). Modern APIs for client storage are the Web Storage API (localStorage and sessionStorage) and IndexedDB.

<br>

# Implementation

Cookies are arbitrary pieces of data, usually chosen and first sent by the web server, and stored on the client computer by the web browser. The browser then sends them back to the server with every request, introducing states (memory of previous events) into otherwise stateless HTTP transactions. Without cookies, each retrieval of a web page or component of a web page would be an isolated event, largely unrelated to all other page views made by the user on the website. Although cookies are usually set by the web server, they can also be set by the client using a scripting language such as JavaScript (unless the cookie's HttpOnly flag is set, in which case the cookie cannot be modified by scripting languages).

The cookie specifications require that browsers meet the following requirements in order to support cookies:

- Can support cookies as large as 4,096 bytes in size.
- Can support at least 50 cookies per domain (i.e. per website).
- Can support at least 3,000 cookies in total.

<br>

# Setting a cookie

Cookies are set using the `Set-Cookie` HTTP header, sent in an HTTP response from the web server. This header instructs the web browser to store the cookie and send it back in future requests to the server.

```
Set-Cookie: <cookie-name>=<cookie-value>
```

### Example 1

<hr style=" float: left;" width="30%"><br>

Below HTTP response shows the server sending headers to tell the client to store a pair of cookies:

```
HTTP/2.0 200 OK
Content-Type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[page content]
```

Then, with every subsequent request to the server, the browser sends back all previously stored cookies to the server using the Cookie header.

```
GET /sample_page.html HTTP/2.0
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

### Example 2

<hr style=" float: left;" width="30%"><br>

As an example, the browser sends its first request for the homepage of the `www.example.org` website:

```
GET /index.html HTTP/1.1
Host: www.example.org
...
```

The server responds with two Set-Cookie headers:

```
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: theme=light
Set-Cookie: sessionToken=abc123; Expires=Wed, 09 Jun 2021 10:18:14 GMT
...
```

The server's HTTP response contains the contents of the website's homepage. But it also instructs the browser to set two cookies. The first, "theme", is considered to be a session cookie since it does not have an Expires or Max-Age attribute. Session cookies are intended to be deleted by the browser when the browser closes. The second, "sessionToken", is considered to be a persistent cookie since it contains an Expires attribute, which instructs the browser to delete the cookie at a specific date and time.

Next, the browser sends another request to visit the spec.html page on the website. This request contains a Cookie HTTP header, which contains the two cookies that the server instructed the browser to set:

```
GET /spec.html HTTP/1.1
Host: www.example.org
Cookie: theme=light; sessionToken=abc123
…
```

This way, the server knows that this request is related to the previous one. The server would answer by sending the requested page, possibly including more Set-Cookie headers in the response in order to add new cookies, modify existing cookies, or delete cookies.

The value of a cookie can be modified by the server by including a Set-Cookie header in response to a page request. The browser then replaces the old value with the new value.

The value of a cookie may consist of any printable ASCII character (! through ~, Unicode \u0021 through \u007E) excluding , and ; and whitespace characters. The name of a cookie excludes the same characters, as well as =, since that is the delimiter between the name and value. The cookie standard RFC 2965 is more restrictive but not implemented by browsers.

The term "cookie crumb" is sometimes used to refer to a cookie's name–value pair.

Cookies can also be set by scripting languages such as JavaScript that run within the browser. In JavaScript, the object document.cookie is used for this purpose. For example, the instruction document.cookie = "temperature=20" creates a cookie of name "temperature" and value "20".

<br>

# Set-Cookie Attributes

```
Set-Cookie: <cookie-name>=<cookie-value>

Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>

Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<non-zero-digit>

Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>

Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>

Set-Cookie: <cookie-name>=<cookie-value>; Secure

Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly

Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict

Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax

Set-Cookie: <cookie-name>=<cookie-value>; SameSite=None; Secure

// Multiple attributes are also possible, for example:
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
```

- `Expires=<date> Optional`

  The maximum lifetime of the cookie as an HTTP-date timestamp.
  If unspecified, the cookie becomes a session cookie. A session finishes when the client shuts down, and session cookies will be removed.
  When an Expires date is set, the deadline is relative to the client the cookie is being set on, not the server.

- `Max-Age=<number> Optional`

  Number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately. If both Expires and Max-Age are set, Max-Age has precedence.

- `Domain=<domain-value> Optional`

  Host to which the cookie will be sent.
  If omitted, defaults to the host of the current document URL, not including subdomains.
  Contrary to earlier specifications, leading dots in domain names (.example.com) are ignored.
  Multiple host/domain values are not allowed, but if a domain is specified, then subdomains are always included.

- `Path=<path-value> Optional`

  A path that must exist in the requested URL, or the browser won't send the Cookie header.
  The forward slash (/) character is interpreted as a directory separator, and subdirectories will be matched as well: for Path=/docs, /docs, /docs/Web/, and /docs/Web/HTTP will all match.

- `Secure Optional`

  Cookie is only sent to the server when a request is made with the https: scheme (except on localhost), and therefore is more resistent to man-in-the-middle attacks.

  - Do not assume that Secure prevents all access to sensitive information in cookies (session keys, login details, etc.). Cookies with this attribute can still be read/modified with access to the client's hard disk, or from JavaScript if the HttpOnly cookie attribute is not set.

  - Insecure sites (http:) can't set cookies with the Secure attribute (since Chrome 52 and Firefox 52). For Firefox, the https: requirements are ignored when the Secure attribute is set by localhost (since Firefox 75).

- `HttpOnly Optional`

  Forbids JavaScript from accessing the cookie, for example, through the `Document.cookie` property.

  - Note that a cookie that has been created with HttpOnly will still be sent with JavaScript-initiated requests, e.g. when calling XMLHttpRequest.send() or fetch(). This mitigates attacks against cross-site scripting (XSS).

- `SameSite=<samesite-value> Optional`

  Controls whether a cookie is sent with cross-origin requests, providing some protection against cross-site request forgery attacks (CSRF).

  Inline options are:

  - Strict :

    The browser sends the cookie only for same-site requests (that is, requests originating from the same site that set the cookie). If the request originated from a different URL than the current one, no cookies with the SameSite=Strict attribute are sent.

    Cookies will only be sent in a first-party context and not be sent along with requests initiated by third party websites.

  - Lax:

    The cookie is not sent on cross-site requests, such as calls to load images or frames into a third party site, but is sent when a user is navigating to the origin site from an external site (e.g. if following a link).

    Cookies are only sent in first party context and along with the GET request initiated by third party website that causes a top level navigation to the original site.

    Chrome 80 made this the default behavior if the SameSite attribute is not specified.
    Before chrome 80 it was none.

  - None:

    The browser sends the cookie with both cross-site and same-site requests. The Secure attribute must also be set when SameSite=None.

    Cookies will be sent in all contexts, i.e in responses to both first-party and cross-origin requests.If SameSite=None is set, the cookie Secure attribute must also be set (or the cookie will be blocked).

<br>

# Define the lifetime of a cookie

The lifetime of a cookie can be defined in two ways:

### Session

<hr style=" float: left;" width="30%"><br>

Session cookies are deleted when the current session ends. The browser defines when the "current session" ends, and some browsers use session restoring when restarting, which can cause session cookies to last indefinitely long.

Cookies are session cookies if they don't specify the Expires or Max-Age attributes.

```
Set-Cookie: sessionId=38afes7a8
```

### Permanent

<hr style=" float: left;" width="30%"><br>

Permanent cookies are deleted at a date specified by the Expires attribute, or after a period of time specified by the Max-Age attribute.

```
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT

Set-Cookie: id=a3fWb; Max-Age=2592000
```

<br>

# Restrict access to cookies

There are a couple of ways to ensure that cookies are sent securely and are not accessed by unintended parties or scripts: the Secure attribute and the HttpOnly attribute

### Secure Attribute :

<hr style=" float: left;" width="30%"><br>

A cookie with the `Secure` attribute is sent to the server only with an encrypted request over the HTTPS protocol, never with unsecured HTTP (except on localhost), and therefore can't easily be accessed by a man-in-the-middle attacker. Insecure sites (with http: in the URL) can't set cookies with the Secure attribute. However, do not assume that Secure prevents all access to sensitive information in cookies; for example, it can be read and modified by someone with access to the client's hard disk (or JavaScript if the HttpOnly attribute is not set).

### HttpOnly Attribute :

<hr style=" float: left;" width="30%"><br>

A cookie with the HttpOnly attribute is inaccessible to the JavaScript `Document.cookie API;` it is sent only to the server. For example, cookies that persist server-side sessions don't need to be available to JavaScript, and should have the HttpOnly attribute. This precaution helps mitigate cross-site scripting (XSS) attacks.

Example :

```
Set-Cookie: id=a3fWa; Expires=Thu, 21 Oct 2021 07:28:00 GMT; Secure; HttpOnly
```

<br>

# Define where cookies are sent

The Domain and Path attributes define the scope of the cookie: what URLs the cookies should be sent to.

### Domain attribute :

<hr style=" float: left;" width="30%"><br>

The Domain attribute specifies which hosts are allowed to receive the cookie. If unspecified, it defaults to the same host that set the cookie, excluding subdomains. If Domain is specified, then subdomains are always included. Therefore, specifying Domain is less restrictive than omitting it. However, it can be helpful when subdomains need to share information about a user.

For example, if `Domain=mozilla.org` is set, then cookies are available on subdomains like `developer.mozilla.org`.

### Path attribute:

<hr style=" float: left;" width="30%"><br>

The Path attribute indicates a URL path that must exist in the requested URL in order to send the Cookie header. The %x2F ("/") character is considered a directory separator, and subdirectories match as well.

For example, if `Path=/docs` is set, these paths match:

`/docs`<br>
`/docs/Web/`<br>
`/docs/Web/HTTP`

### SameSite attribute

<hr style=" float: left;" width="30%"><br>

The SameSite attribute lets servers specify whether/when cookies are sent with cross-origin requests (where Site is defined by the registrable domain), which provides some protection against cross-site request forgery attacks (CSRF).

It takes three possible values : `Strict, Lax, and None`

- With Strict, the cookie is sent only to the same site as the one that originated it;
- Lax is similar, except that cookies are sent when the user navigates to the cookie's origin site, for example, by following a link from an external site;
- None specifies that cookies are sent on both originating and cross-site requests, but only in secure contexts (i.e. if SameSite=None then the Secure attribute must also be set). If no SameSite attribute is set then the cookie is treated as Lax.

<br>

# Cookie Prefixes

The design of the cookie mechanism is such that a server is unable to confirm that a cookie was set on a secure origin or even to tell where a cookie was originally set.

A vulnerable application on a sub-domain can set a cookie with the Domain attribute, which gives access to that cookie on all other subdomains. This mechanism can be abused in a session fixation attack.

As a defense-in-depth measure, however, it is possible to use cookie prefixes to assert specific facts about the cookie. Two prefixes are available:

### \_\_Host-

<hr style=" float: left;" width="30%"><br>

If a cookie name has this prefix, it is accepted in a Set-Cookie header only if it is also marked with the Secure attribute, was sent from a secure origin, does not include a Domain attribute, and has the Path attribute set to /. In this way, these cookies can be seen as "domain-locked".

### \_\_Secure-

<hr style=" float: left;" width="30%"><br>

If a cookie name has this prefix, it is accepted in a Set-Cookie header only if it is marked with the Secure attribute and was sent from a secure origin. This is weaker than the `__Host-` prefix.

# Terminology

### Session cookie

<hr style=" float: left;" width="30%"><br>

A session cookie, also known as an in-memory cookie, transient cookie or non-persistent cookie, exists only in temporary memory while the user navigates the website. Web browsers normally delete session cookies when the user closes the browser. Unlike other cookies, session cookies do not have an expiration date assigned to them, which is how the browser knows to treat them as session cookies.

### Persistent cookie

<hr style=" float: left;" width="30%"><br>

Instead of expiring when the web browser is closed as session cookies do, a persistent cookie expires at a specific date or after a specific length of time. For the persistent cookie's lifespan set by its creator, its information will be transmitted to the server every time the user visits the website that it belongs to, or every time the user views a resource belonging to that website from another website (such as an advertisement).

For this reason, persistent cookies are sometimes referred to as tracking cookies because they can be used by advertisers to record information about a user's web browsing habits over an extended period of time. However, they are also used for "legitimate" reasons (such as keeping users logged into their accounts on websites, to avoid re-entering login credentials at every visit).

### Secure cookie

<hr style=" float: left;" width="30%"><br>

A secure cookie can only be transmitted over an encrypted connection (i.e. HTTPS). They cannot be transmitted over unencrypted connections (i.e. HTTP). This makes the cookie less likely to be exposed to cookie theft via eavesdropping. A cookie is made secure by adding the Secure flag to the cookie.

### Http-only cookie

<hr style=" float: left;" width="30%"><br>

An http-only cookie cannot be accessed by client-side APIs, such as JavaScript. This restriction eliminates the threat of cookie theft via cross-site scripting (XSS). However, the cookie remains vulnerable to cross-site tracing (XST) and cross-site request forgery (CSRF) attacks. A cookie is given this characteristic by adding the HttpOnly flag to the cookie.
Cookies cannot be accessed through-
`document.cookie`

### Same-site cookie

<hr style=" float: left;" width="30%"><br>

In 2016 Google Chrome version 51 introduced a new kind of cookie with attribute SameSite. Attribute SameSite can have a value of Strict, Lax or None. With attribute SameSite=Strict, the browsers should only send these cookies with requests originated from the same domain/site as the target domain. This would effectively mitigate cross-site request forgery (CSRF) attacks. SameSite=Lax would not restrict originating site, but enforce target domain to be the same as cookie domain, effectively blocking third-party (cross-site) cookies. Attribute SameSite=None would allow third-party (cross-site) cookies. The Same-site cookie is incorporated into a new RFC draft for "Cookies: HTTP State Management Mechanism" to update RFC6265 (if approved).

Chrome, Firefox, Microsoft Edge all started to support Same-site cookies. The key of rollout is the treatment of existing cookies without SameSite attribute defined, Chrome has been treating those existing cookies as if SameSite=None, this would keep all website/applications run as before. Google intended to change that default to SameSite=Lax in February 2020,the change would break those applications/websites if they rely on third-party/cross-site cookies, but without SameSite attribute defined. Given the extensive changes for web developers and COVID-19 circumstances, Google temporarily rolled back the SameSite cookie change.

### Third-party cookie

<hr style=" float: left;" width="30%"><br>

Normally, a cookie's domain attribute will match the domain that is shown in the web browser's address bar. This is called a first-party cookie. A third-party cookie, however, belongs to a domain different from the one shown in the address bar. This sort of cookie typically appears when web pages feature content from external websites, such as banner advertisements. This opens up the potential for tracking the user's browsing history and is often used by advertisers in an effort to serve relevant advertisements to each user.

As an example, suppose a user visits `www.example.org`. This website contains an advertisement from `ad.foxytracking.com`, which, when downloaded, sets a cookie belonging to the advertisement's domain (`ad.foxytracking.com`) in the user's browser. Then, the user visits another website, `www.foo.com`, which also contains an advertisement from `ad.foxytracking.com` and the same cookie belonging to `ad.foxytracking.com` is sent when the ad is downloded by `www.foo.com` . Eventually, these cookies will be sent to the advertiser when loading their advertisements or visiting their website. The advertiser can then use these cookies to build up a browsing history of the user across all the websites that have ads from this advertiser, through the use of the HTTP referer header field.

- **The referrer problem :**
  The Referer (sic) header contains the address of the previous web page from which a link to the currently requested page was followed, which has lots of fairly innocent uses including analytics, logging, or optimized caching. However, there are more problematic uses such as tracking or stealing information, or even just side effects such as inadvertently leaking sensitive information.

# Doubts

### Doubt 1 - When are persistent cookies used?

<hr style=" float: left;" width="70%"><br>

- for normal sites keeping the user logged in
  is done by persistent cookies

- for sensitive sites like banking session cookies are used to keep the user logged in.

### Doubt 2 - How do third party cookies work?

<hr style=" float: left;" width="70%"><br>

- Whenever any resourse (ad) is shown on a website it will go fetch the resourse from the third-party website (ad website) and a cookie will be set in domain of third-party website domain which is used to track the user.

- So, if website A contains an ad that is served by website B, then website B can set a cookie in your browser. For example, maybe website A uses `<iframe src="http://websiteB.com/ad.html"></iframe>` to serve the ad from website B. Then when your browser goes to fetch `http://websiteB.com/ad.html`, the response will come back with a `Set-Cookie` header that sets a cookie with some unique random string (on domain of `websiteB.com`). If website C also includes an ad from website B, then that unique cookie will be sent when the ad on website C is fetched from website B.

### Doubt 3 : Difference in samesite strict mode and lax mode

<hr style=" float: left;" width="70%"><br>

In the strict mode, the cookie is withheld with any cross-site usage. Even when the user follows a link to another website the cookie is not sent.

In lax mode, some cross-site usage is allowed. Specifically if the request is a GET request and the request is top-level. Top-level means that the URL in the address bar changes because of this navigation. This is not the case for iframes, images or XMLHttpRequests.

This table shows what cookies are sent with cross-origin requests. As you can see cookies with none as same-site attribute indicated by ‘none’ are always sent. Strict cookies are never sent. Lax cookies are only send with a top-level get request

<table>
  <thead>
    <tr>
      <th>request type,</th>
      <th>example code,</th>
      <th>cookies sent</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>link</td>
      <td><code>&lt;a href="…"&gt;</code></td>
      <td>none, lax</td>
    </tr>
    <tr>
      <td>prerender</td>
      <td><code>&lt;link rel="prerender" href="…"&gt;</code></td>
      <td>none, lax</td>
    </tr>
    <tr>
      <td>form get</td>
      <td><code>&lt;form method="get" action="…"&gt;</code></td>
      <td>none, lax</td>
    </tr>
    <tr>
      <td>form post</td>
      <td><code>&lt;form method="post" action="…"&gt;</code></td>
      <td>none</td>
    </tr>
    <tr>
      <td>iframe</td>
      <td><code>&lt;iframe src="…"&gt;</code></td>
      <td>none</td>
    </tr>
    <tr>
      <td>ajax</td>
      <td><code>$.get('…')</code></td>
      <td>none</td>
    </tr>
    <tr>
      <td>image</td>
      <td><code>&lt;img src="…"&gt;</code></td>
      <td>none</td>
    </tr>
  </tbody>
</table>

<br>

### Doubt 4 - Usecase of samesite - strict / lax / none

<hr style=" float: left;" width="70%"><br>

Tracking cookies / Third-party ( fonts and scripts from Google, and share buttons from Facebook and Twitter) have samesite attribute as none so that cookies can be sent from both cross-site and same-site requests.

When requesting data from another site, any cookies that you had on that site are also sent with the request. If you are logged in to Facebook, your session cookie is sent to Facebook whenever you visit a page that contains a Facebook share button. This can be used by Facebook to track which pages you are visiting.
In this scenario, the cookies sent to Facebook are called third-party cookies. The user and the web page are the first and second party. Any other site is a third party.

<hr width='50%' style=" float: left;" ><br>

As you would expect strict mode gives better security, but breaks some functionality. Links to protected resources (e.g. `https://github.com/Sjord/privateProject`) won’t work from other sites. Even if you are logged in to GitHub and would have access to this private project, your strict cookies won’t be sent to GitHub when coming from another site. With lax mode this still works, while providing decent security by blocking cross site post requests.

Cookies working as session Ids or for authenticaion should be lax or strict to prevent Cross-site-request-frogery attacks and to avoid additional overhead.
