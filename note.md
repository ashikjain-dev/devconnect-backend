# Connection request

- POST connectionrequest/:status/:userId
- ConnectionRequestSchema and Model
- fields fromUserId,toUserId,status
- validation
- fromUserId !== toUserId
- check if connection already exist
- allow only interested and ignored state
- check toUserId is exist in the DB.

# User Connection Request which are accepted

GET http://localhost:7777/user/connection/accepted

- Get all connection of the existing user which are in accepted state
- make a connection between two collections (user and connectionRequest)
- user is a primary collection and connectionrequest is a secondary collection
- use ref to make a connection
- use populate method to get data from primary collection

# User Connection Request which are in interested state

GET http://localhost:7777/user/connection/interested

- Get all connection of the existing user which are in interested state
