## MongoDB

NoSql not only SQL

## NoSQL DB Types-

- Document DB (eg- MongoDB)
- Key-Value DB (eg- Redis)
- Column-family DB (eg- Cassandra)
- Graph DB (eg- Neo4)

## Terms

Document databases, as the name implies, are built around documents.

A document is a self-contained unit of information and can be in many different formats, JSON being one of the most popular formats for storing documents in a document database.

Documents themselves can be organized into collections.So a collection is a group of documents and in turn, the database itself can be considered as a set of collections.

- Document: A self-contained piece of information
- Collection: collection od documents
- Database: A set of collections

## Document Database

- Sever can support multiple databases
- A database consists of a set of collections
- A collection is a set of documents
- Document is effectively a JSON document with some additional features

## MongoDB Format

Mongo stores the documents in a more compact form BSON (Binary JSON) format

- Supports length prefix on each value. Easy to skip over a field
- Information about the type field value.
- Additional primitive types not supported by raw JSON like UTC date time, raw binary and ObjectId

## MongoDB ObjectId

- Every document in Mongo must have an "\_id" field that is unique
- id.getTimestamp() returns the timestamp in ISO Date format
- Default ObjectId is created by Mongo when you insert a document
- ObjectId is a 12 byte field

| Timestamp | Machine ID | Process ID | Increment |
| --------- | ---------- | ---------- | --------- |
| 4 bytes   | 3 bytes    | 2 bytes    | 3 bytes   |

- **Timestamp**: The first four bytes includes a timestamp, the typical Unix timestamp in the resolution of a second.
- **Machine ID**: Then the next three bytes towards the machine ID, the machine on which the Mongo server is running
- **Proc ID**: The next two bytes is the process ID, the specific Mongo process which has created this document
- **Increment**: The last field is an increment.The timestamp field itself is at the resolution of a second.So if you have multiple documents that are stored within the same second, then the increment field will distinguish among the documents.

[HowToWrite.md](https://medium.com/@saumya.ranjan/how-to-write-a-readme-md-file-markdown-file-20cb7cbcd6f 'How to write in .md file')
