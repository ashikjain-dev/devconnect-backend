# Connection request

- POST connectionrequest/:status/:userId
- ConnectionRequestSchema and Model
- fields fromUserId,toUserId,status
- validation
- fromUserId !== toUserId
- check if connection already exist
- allow only interested and ignored state
- check toUserId is exist in the DB.
