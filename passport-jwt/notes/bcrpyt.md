## Why you should use `bcrypt()`

If you store user passwords in the clear, then an attacker who steals a copy of your database has a giant list of emails
and passwords. Some of your users will only have one password -- for their email account, for their banking account, for
your application. A simple hack could escalate into massive identity theft.

It's your responsibility as a web developer to make your web application secure -- blaming your users for not being
security experts is not a professional response to risk.

`bcrypt()` allows you to easily harden your application against these kinds of attacks.

## bcrypt methods

### Generating salt - gensalt (asynchronous) , genSaltSync (synchronous)

- Callback

```
bcrypt.genSalt(saltRounds, function(err, salt) {
// salt
});
```

- Promises

```
bycrpt.genSalt(saltRounds)
.then(salt=>{
    // salt
})
.catch(err=>{
    //err
})
```

- Async/ Await

```
async function generateSalt(username, password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

}
```

- Synchronous

```
const salt = bcrypt.genSaltSync(saltRounds);

```

### Password Hashing - hash (asynchronous), hashSync (synchronous)

- Callback

  - Technique 1 (generate a salt and hash on separate function calls):

        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            // Store hash in your password DB.
            });
        });

  - Technique 2 (auto-gen a salt and hash):

        bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
            // Store hash in your password DB.
        });

- Promises

  - Technique 1 (generate a salt and hash on separate function calls):

        bcrypt.genSalt(saltRounds)
        .then(salt=>{
            return bcrypt.hash(myPlaintextPassword,salt)
        })
        .then(hash=>{
            // Store hash in your password DB.
        })
        .catch(err=>{
            console.log(err)
        })

  - Technique 2 (auto-gen a salt and hash):

        const saltRounds = 10;
        bcrypt.hash(myPlaintextPassword, saltRounds)
        .then(hash=>{
            // Store hash in your password DB.
        })
        .catch(err=>{
            console.log(err)
        })

- Async/Await

  - Technique 1 (generate a salt and hash on separate function calls):

        async function generateHash( myPlaintextPassword){
            const saltRounds= 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await  bcrypt.hash(myPlaintextPassword, salt)
            // Store hash in your password DB
        }

  - Technique 2 (auto-gen a salt and hash):

        async function generateHash( myPlaintextPassword){
            const saltRounds= 10;
            const hash = await  bcrypt.hash(myPlaintextPassword, saltRpunds)
            // Store hash in your password DB
        }

- Synchronous

  - Technique 1 (generate a salt and hash on separate function calls):

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(myPlaintextPassword, salt);
        // Store hash in your password DB.

  - Technique 2 (auto-gen a salt and hash):

        const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
        // Store hash in your password DB.

### Validating Password - compare (asynchronous), compareSync (synchronous)

- Callback

  ```
  // Load hash from your password DB.
  bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
  // if result == true password matched
  // if result == false password wrong

  });

  ```

- Promises

  ```
  // Load hash from your password DB.
  bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
      // if result == true password matched
      // if result == false password wrong
  });
  ```

- Async/Await

  ```
  async function checkPassword(user,password) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if(match) {
          //login
      }
  }
  ```

- Synchronous

  ```
  // Load hash from your password DB.
  bcrypt.compareSync(myPlaintextPassword, hash); // true
  ```

## How `bcrypt()` works

`bcrypt()` is a hashing algorithm designed by Niels Provos and David Mazières of the OpenBSD Project.

### Background

Hash algorithms take a chunk of data (e.g., your user's password) and create a "digital fingerprint," or hash, of it.
Because this process is not reversible, there's no way to go from the hash back to the password.

In other words:

    hash(p) #=> <unique gibberish>

You can store the hash and check it against a hash made of a potentially valid password:

    <unique gibberish> =? hash(just_entered_password)

### Rainbow Tables

But even this has weaknesses -- attackers can just run lists of possible passwords through the same algorithm, store the
results in a big database, and then look up the passwords by their hash:

    PrecomputedPassword.find_by_hash(<unique gibberish>).password #=> "secret1"

### Salts

The solution to this is to add a small chunk of random data -- called a salt -- to the password before it's hashed:

    hash(salt + p) #=> <really unique gibberish>

The salt is then stored along with the hash in the database, and used to check potentially valid passwords:

    <really unique gibberish> =? hash(salt + just_entered_password)

bcrypt-ruby automatically handles the storage and generation of these salts for you.

Adding a salt means that an attacker has to have a gigantic database for each unique salt -- for a salt made of 4
letters, that's 456,976 different databases. Pretty much no one has that much storage space, so attackers try a
different, slower method -- throw a list of potential passwords at each individual password:

    hash(salt + "aadvark") =? <really unique gibberish>
    hash(salt + "abacus")  =? <really unique gibberish>
    etc.

This is much slower than the big database approach, but most hash algorithms are pretty quick -- and therein lies the
problem. Hash algorithms aren't usually designed to be slow, they're designed to turn gigabytes of data into secure
fingerprints as quickly as possible. `bcrypt()`, though, is designed to be computationally expensive:

    Ten thousand iterations:
                 user     system      total        real
    md5      0.070000   0.000000   0.070000 (  0.070415)
    bcrypt  22.230000   0.080000  22.310000 ( 22.493822)

If an attacker was using Ruby to check each password, they could check ~140,000 passwords a second with MD5 but only
~450 passwords a second with `bcrypt()`.

### Cost Factors

In addition, `bcrypt()` allows you to increase the amount of work required to hash a password as computers get faster. Old
passwords will still work fine, but new passwords can keep up with the times.

The default cost factor used by bcrypt is 12, which is fine for session-based authentication. If you are using a
stateless authentication architecture (e.g., HTTP Basic Auth), you will want to lower the cost factor to reduce your
server load and keep your request times down. This will lower the security provided you, but there are few alternatives.

## Doubt 1 : how is it getting the salt??

We did not store the salt though, so how does bcrypt.compare know which salt to use? Looking at a previous hash/salt result, notice how the hash is the salt with the hash appended to it:

    Salt: $2b$10$3euPcmQFCiblsZeEu5s7p.
    Hash: $2b$10$3euPcmQFCiblsZeEu5s7p.9OVHgeHWFDk9nhMqZ0m/3pd/lhwZgES

bcrypt.compare deduces the salt from the hash and is able to then hash the provided password correctly for comparison.

## Doubt 2: breakdown of bcrypt hash

    $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa

This is actually three fields, delimited by "$":

- 2a identifies the bcrypt algorithm version that was used.
- 10 is the cost factor; 210 iterations of the key derivation function are used (which is not enough, by the way. I'd recommend a cost of 12 or more.)
- vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa is the salt and the cipher text, concatenated and encoded in a modified Base-64.<br>The first 22 characters decode to a 16-byte value for the salt. The remaining characters are cipher text to be compared for authentication.
