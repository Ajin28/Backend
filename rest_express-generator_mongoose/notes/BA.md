```
 npx express-generator
 npm i
```

## Basic Authentication

Basic authentication is a simple authentication scheme built into the HTTP protocol. The client sends HTTP requests with the Authorization header that contains the word Basic followed by a space and a base64-encoded string username:password. For example, to authorize as demo / p@55w0rd the client would send

`Authorization: Basic ZGVtbzpwQDU1dzByZA==`

- Note: Because base64 is easily decoded, Basic authentication should only be used together with other security mechanisms such as HTTPS/SSL.

**_RFC 7235 defines the HTTP authentication framework, which can be used by a server to challenge a client request, and by a client to provide authentication information._**

The challenge and response flow works like this:

1. The server responds to a client with a 401 (Unauthorized) response status and provides information on how to authorize with a WWW-Authenticate response header containing at least one challenge.
2. A client that wants to authenticate itself with the server can then do so by including an Authorization request header with the credentials.
3. Usually a client will present a password prompt to the user and will then issue the request including the correct Authorization header.

<img src="HTTPAuth.png" style="background-color:white">

# step 1

<img src='step1.png'>

# step 2

<img src='step2.png'>
<img src='step2.1.png'>

# step 3

<img src='step3.png'>
<hr>

## Intro

In the context of an HTTP transaction, basic access authentication is a method for an HTTP user agent (e.g. a web browser) to provide a user name and password when making a request. In basic HTTP authentication, a request contains a header field in the form of Authorization: Basic <credentials>, where credentials is the Base64 encoding of ID and password joined by a single colon.

It is specified in RFC 7617 from 2015.

## Features

HTTP Basic authentication (BA) implementation is the simplest technique for enforcing access controls to web resources because it does not require cookies, session identifiers, or login pages; rather, HTTP Basic authentication uses standard fields in the HTTP header.

## Security

The BA mechanism does not provide confidentiality protection for the transmitted credentials. They are merely encoded with Base64 in transit and not encrypted or hashed in any way. Therefore, basic authentication is typically used in conjunction with HTTPS to provide confidentiality.

Because the BA field has to be sent in the header of each HTTP request, the web browser needs to cache credentials for a reasonable period of time to avoid constantly prompting the user for their username and password. Caching policy differs between browsers.

HTTP does not provide a method for a web server to instruct the client to "log out" the user. However, there are a number of methods to clear cached credentials in certain web browsers. One of them is redirecting the user to a URL on the same domain, using credentials that are intentionally incorrect. However, this behavior is inconsistent between various browsers and browser versions. Microsoft Internet Explorer offers a dedicated JavaScript method to clear cached credentials.

`<script>document.execCommand('ClearAuthenticationCache');</script>`

In modern browsers, cached credentials for basic authentication are typically cleared when clearing browsing history. Most browsers allow users to specifically clear only credentials, though the option may be hard to find, and typically clears credentials for all visited sites.

# Protocol

## Server side

When the server wants the user agent to authenticate itself towards the server, the server must respond appropriately to unauthenticated requests.

To unauthenticated requests, the server should return a response whose header contains a HTTP 401 Unauthorized status and a WWW-Authenticate field.

The WWW-Authenticate field for basic authentication is constructed as following:

WWW-Authenticate: Basic realm="User Visible Realm"

The server may choose to include the charset parameter from RFC 7617.

WWW-Authenticate: Basic realm="User Visible Realm", charset="UTF-8"

This parameter indicates that the server expects the client to use UTF-8 for encoding username and password

## Client side

When the user agent wants to send authentication credentials to the server, it may use the Authorization field.

The Authorization field is constructed as follows:

1. The username and password are combined with a single colon (:). This means that the username itself cannot contain a colon.
2. The resulting string is encoded into an octet sequence. The character set to use for this encoding is by default unspecified, as long as it is compatible with US-ASCII, but the server may suggest use of UTF-8 by sending the charset parameter.
3. The resulting string is encoded using a variant of Base64.
   The authorization method and a space (e.g. "Basic ") is then prepended to the encoded string.
   For example, if the browser uses Aladdin as the username and OpenSesame as the password, then the field's value is the Base64 encoding of Aladdin:OpenSesame, or QWxhZGRpbjpPcGVuU2VzYW1l. Then the Authorization header will appear as:

   Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l

[Read also at wikipedia](https://en.wikipedia.org/wiki/Basic_access_authentication)
