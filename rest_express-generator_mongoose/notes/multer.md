Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

- NOTE: Multer will not process any form which is not multipart (multipart/form-data).

## USAGE

Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.

- NOTE: Don't forget the enctype="multipart/form-data" in your form.

Front-end

```
<form action="/profile" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" />
</form>
```

Back-end - files will be added to /uploads directory in root folder of project.

```
var express = require('express')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var app = express()

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})

var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
})
```

In case you need to handle a text-only multipart form, you should use the .none() method:

```
var express = require('express')
var app = express()
var multer  = require('multer')
var upload = multer()

app.post('/profile', upload.none(), function (req, res, next) {
  // req.body contains the text fields
})

```

# API

## File Information

Each req.file / req.files[...] object contains follwing fields -

| Key            | Description                                   | Note            |
| -------------- | --------------------------------------------- | --------------- |
| `fieldname`    | Field name specified in the form              |
| `originalname` | Name of the file on the user's computer       |
| `encoding`     | Encoding type of the file                     |
| `mimetype`     | Mime type of the file                         |
| `size`         | Size of the file in bytes                     |
| `destination`  | The folder to which the file has been saved   | `DiskStorage`   |
| `filename`     | The name of the file within the `destination` | `DiskStorage`   |
| `path`         | The full path to the uploaded file            | `DiskStorage`   |
| `buffer`       | A `Buffer` of the entire file                 | `MemoryStorage` |

<br>
<hr>
<br>

## Multer Options: multer(opts)

Multer accepts an options object, the most basic of which is the dest property, which tells Multer where to upload the files. In case you omit the options object, the files will be kept in memory and never written to disk.

Files will be in memory

```
 app.post(multer().single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(req.file);
    })
```

Files will be in /uploads directory of project.

```
 app.post(multer({ dest: 'uploads/' }).single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(req.file);
    })
```

By default, Multer will rename the files so as to avoid naming conflicts. The renaming function can be customized according to your needs.

The following are the options that can be passed to Multer.

| Key                 | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `dest` or `storage` | Where to store the files                                  |
| `fileFilter`        | Function to control which files are accepted              |
| `limits`            | Limits of the uploaded data                               |
| `preservePath`      | Keep the full path of files instead of just the base name |

<br>

- dest : String<br>
  The destination directory for uploaded files. If storage is not set and dest is, Multer will create a DiskStorage instance configured to store files at dest with random filenames.
  Ignored if storage is set.

- preservePath : Boolean<br>
  Preserve the full path of the original filename rather than the basename. (Default: false)

- limits : Object<br>

  ```
  {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      parts?: number;
      headerPairs?: number;
  }
  ```

  An object specifying various limits on incoming data. This object is passed to Busboy directly.<br>
  Specifying the limits can help protect your site against denial of service (DoS) attacks.

  | Key             | Description                                                             | Default   |
  | --------------- | ----------------------------------------------------------------------- | --------- |
  | `fieldNameSize` | Max field name size                                                     | 100 bytes |
  | `fieldSize`     | Max field value size (in bytes)                                         | 1MB       |
  | `fields`        | Max number of non-file fields                                           | Infinity  |
  | `fileSize`      | For multipart forms, the max file size (in bytes)                       | Infinity  |
  | `files`         | For multipart forms, the max number of file fields                      | Infinity  |
  | `parts`         | For multipart forms, the max number of parts (fields + files)           | Infinity  |
  | `headerPairs`   | For multipart forms, the max number of header key=>value pairs to parse | 2000      |

  <br>

- fileFilter : Function<br>
  Optional function to control which files are uploaded. This is called for every file that is processed.
  Parameters :

  - req — The Express Request object.
  - file — Object containing information about the processed file.
  - callback — a function to control which files should be uploaded and which should be skipped.

  ```
  function fileFilter (req, file, cb) {

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To reject this file pass `false`, like so:
  cb(null, false)

  // To accept the file pass `true`, like so:
  cb(null, true)

  // You can always pass an error if something goes wrong:
  cb(new Error('I don\'t have a clue!'))

  }

  ```

- storage : StorageEngine<br>

  A StorageEngine responsible for processing files uploaded via Multer. Takes precedence over dest.
  Multer ships with storage engines DiskStorage and MemoryStorage

  - ### DiskStorage

    The disk storage engine gives you full control on storing files to disk.

    ```
    var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' +   Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' +   uniqueSuffix)
    }
    })
    var upload = multer({ storage: storage })

    ```

    There are two options available, `destination` and `filename`. They are both functions that determine where the file should be stored.

    `destination`<br>
    A string (e.g. '/tmp/uploads') or function that determines the destination path for uploaded files. If a string is passed and the directory does not exist, Multer attempts to create it recursively. If neither a string or a function is passed, the destination defaults to os.tmpdir().<br>

    - Note: You are responsible for creating the directory when providing destination as a function. When passing a string, multer will make sure that the directory is created for you.

    `filename`<br>
    A function that determines the name of the uploaded file. If nothing is passed, Multer will generate a 32 character pseudorandom hex string with no extension.

    - Note: Multer will not append any file extension for you, your function should return a filename complete with an file extension.

    Each function for `destination` and `filename` gets passed 3 parameters.

    - req — The Express Request object.
    - file — Object containing information about the processed file.
    - cb — Callback to determine the destination path / filename.<br>
      Callback is passed two parameters-

      ```
      // cb(error: Error, destination/filename: string);

      // to set file destination folder
      cb(null,'/uploads')

      // to set filename
      cb(null, file.originalname)

      // to pass an error
      cb(new Error ("Can't save file"))

      ```

  - ### MemoryStorage

    The memory storage engine stores the files in memory as Buffer objects. It doesn't have any options.

    ```
    var storage = multer.memoryStorage()
    var upload = multer({ storage: storage })
    ```

    When using memory storage, the file info will contain a field called buffer that contains the entire file.

    - WARNING: Uploading very large files, or relatively small files in large numbers very quickly, can cause your application to run out of memory when memory storage is used.

<br>
<hr>
<br>

### Doubt 1 dest vs storage

In an average web app, only dest might be required.
If you want more control over your uploads, you'll want to use the storage option instead of dest. Multer ships with storage engines DiskStorage and MemoryStorage; More engines are available from third parties.

<br>
<hr>
<br>

## Multer methods

- .single(fieldname)<br>
  Accept a single file with the name fieldname. The single file will be stored in req.file.

  ```
  app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if   there were any
  })
  ```

- .array(fieldname[, maxCount])<br>
  Accept an array of files, all with the name fieldname. Optionally error out if more than maxCount files are uploaded. The array of files will be stored in req.files.

  ```
  app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  })
  ```

- .fields(fields)<br>
  Accept a mix of files, specified by fields. An object with arrays of files will be stored in req.files.

  fields should be an array of objects with name and optionally a maxCount. Example:

  ```

  var upload = upload.fields(
    [
      { name: 'avatar', maxCount: 1 },
      { name: 'gallery', maxCount: 8 }
    ]
  )
  app.post('/cool-profile', upload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
  })

  ```

- .none()<br>
  Accept only text fields. If any file upload is made, error with code "LIMIT_UNEXPECTED_FILE" will be issued.

  ```
    app.post('/profile', upload.none(), function(req, res, next) {
    // req.body contains the text fields
    })
  ```

- .any()<br>
  Accepts all files that comes over the wire. An array of files will be stored in req.files.

### WARNING:

Make sure that you always handle the files that a user uploads. Never add multer as a global middleware since a malicious user could upload files to a route that you didn't anticipate. Only use this function on routes where you are handling the uploaded files.
