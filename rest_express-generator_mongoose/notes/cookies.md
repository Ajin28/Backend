# Cookie

An HTTP cookie (also called web cookie, Internet cookie, browser cookie, or simply cookie) is a small piece of data stored on the user's computer by the web browser while browsing a website.
Typically, it's used to tell if two requests came from the same browser — keeping a user logged-in, for example. It remembers stateful information for the stateless HTTP protocol.

## Cookies are mainly used for three purposes:

### Session management

Logins, shopping carts, game scores, or anything else the server should remember

### Personalization

User preferences, themes, and other settings

### Tracking

Recording and analyzing user behavior

## Implementation

Cookies are arbitrary pieces of data, usually chosen and first sent by the web server, and stored on the client computer by the web browser. The browser then sends them back to the server with every request, introducing states (memory of previous events) into otherwise stateless HTTP transactions. Without cookies, each retrieval of a web page or component of a web page would be an isolated event, largely unrelated to all other page views made by the user on the website. Although cookies are usually set by the web server, they can also be set by the client using a scripting language such as JavaScript (unless the cookie's HttpOnly flag is set, in which case the cookie cannot be modified by scripting languages).

The cookie specifications require that browsers meet the following requirements in order to support cookies:

- Can support cookies as large as 4,096 bytes in size.
- Can support at least 50 cookies per domain (i.e. per website).
- Can support at least 3,000 cookies in total.

## Setting a cookie

Cookies are set using the **Set-Cookie** HTTP header, sent in an HTTP response from the web server. This header instructs the web browser to store the cookie and send it back in future requests to the server (the browser will ignore this header if it does not support cookies or has disabled cookies).

As an example, the browser sends its first request for the homepage of the www.example.org website:

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

## Terminology

**Session cookie**
A session cookie, also known as an in-memory cookie, transient cookie or non-persistent cookie, exists only in temporary memory while the user navigates the website. Web browsers normally delete session cookies when the user closes the browser. Unlike other cookies, session cookies do not have an expiration date assigned to them, which is how the browser knows to treat them as session cookies.

**Persistent cookie**
Instead of expiring when the web browser is closed as session cookies do, a persistent cookie expires at a specific date or after a specific length of time. For the persistent cookie's lifespan set by its creator, its information will be transmitted to the server every time the user visits the website that it belongs to, or every time the user views a resource belonging to that website from another website (such as an advertisement).

For this reason, persistent cookies are sometimes referred to as tracking cookies because they can be used by advertisers to record information about a user's web browsing habits over an extended period of time. However, they are also used for "legitimate" reasons (such as keeping users logged into their accounts on websites, to avoid re-entering login credentials at every visit).

**Secure cookie**
A secure cookie can only be transmitted over an encrypted connection (i.e. HTTPS). They cannot be transmitted over unencrypted connections (i.e. HTTP). This makes the cookie less likely to be exposed to cookie theft via eavesdropping. A cookie is made secure by adding the Secure flag to the cookie.

**Http-only cookie**
An http-only cookie cannot be accessed by client-side APIs, such as JavaScript. This restriction eliminates the threat of cookie theft via cross-site scripting (XSS). However, the cookie remains vulnerable to cross-site tracing (XST) and cross-site request forgery (CSRF) attacks. A cookie is given this characteristic by adding the HttpOnly flag to the cookie.
Cookies cannot be accessed through-
`document.cookie`

**Same-site cookie**
In 2016 Google Chrome version 51 introduced a new kind of cookie with attribute SameSite. Attribute SameSite can have a value of Strict, Lax or None. With attribute SameSite=Strict, the browsers should only send these cookies with requests originated from the same domain/site as the target domain. This would effectively mitigate cross-site request forgery (CSRF) attacks.SameSite=Lax would not restrict originating site, but enforce target domain to be the same as cookie domain, effectively blocking third-party (cross-site) cookies. Attribute SameSite=None would allow third-party (cross-site) cookies. The Same-site cookie is incorporated into a new RFC draft for "Cookies: HTTP State Management Mechanism" to update RFC6265 (if approved).

Chrome, Firefox, Microsoft Edge all started to support Same-site cookies. The key of rollout is the treatment of existing cookies without SameSite attribute defined, Chrome has been treating those existing cookies as if SameSite=None, this would keep all website/applications run as before. Google intended to change that default to SameSite=Lax in February 2020,the change would break those applications/websites if they rely on third-party/cross-site cookies, but without SameSite attribute defined. Given the extensive changes for web developers and COVID-19 circumstances, Google temporarily rolled back the SameSite cookie change.

**Third-party cookie**
Normally, a cookie's domain attribute will match the domain that is shown in the web browser's address bar. This is called a first-party cookie. A third-party cookie, however, belongs to a domain different from the one shown in the address bar. This sort of cookie typically appears when web pages feature content from external websites, such as banner advertisements. This opens up the potential for tracking the user's browsing history and is often used by advertisers in an effort to serve relevant advertisements to each user.

As an example, suppose a user visits www.example.org. This website contains an advertisement from ad.foxytracking.com, which, when downloaded, sets a cookie belonging to the advertisement's domain (ad.foxytracking.com). Then, the user visits another website, www.foo.com, which also contains an advertisement from ad.foxytracking.com and sets a cookie belonging to that domain (ad.foxytracking.com). Eventually, both of these cookies will be sent to the advertiser when loading their advertisements or visiting their website. The advertiser can then use these cookies to build up a browsing history of the user across all the websites that have ads from this advertiser, through the use of the HTTP referer header field.

- **The referrer problem**
  The Referer (sic) header contains the address of the previous web page from which a link to the currently requested page was followed, which has lots of fairly innocent uses including analytics, logging, or optimized caching. However, there are more problematic uses such as tracking or stealing information, or even just side effects such as inadvertently leaking sensitive information.

## Uses

### Doubt 1

- for normal sites keeping the user logged in
  is done by persistent cookies

- for sensitive sites like banking session cookies are used to keep the user logged in.

### Doubt 2

- How do third party cookies work?
- whenever any resourse(ad) is shown the on a website it will go fetch the resourse from the third-party website(ad website) and a cookie will be set in domain of third-party website domain which is used to track the user.

-So, if website A contains an ad that is served by website B, then website B can set a cookie in your browser. For example, maybe website A uses `<iframe src="http://websiteB.com/ad.html"></iframe>` to serve the ad from website B. Then when your browser goes to fetch http://websiteB.com/ad.html, the response will come back with a Set-Cookie header that sets a cookie with some unique random string (on domain of websiteB.com). If website C also includes an ad from website B, then that unique cookie will be sent when the ad on website C is fetched from website B.
