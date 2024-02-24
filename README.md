Currently deployed at : http://162.19.25.174:4455/

## Routes :

# Auth : /auth

/auth/login :
    Input : body - email + password
    Output : 
        - Response object with access_token and Superadmin object
        - message : validation code sent (in case of event manager login)
        - wrong email or password error

/auth/validate :
    Input : body - email + validationCode (currently defaulted to 123456)
    Output : 
        - Response object with access_token and eventmanager object
        - wrong validation code error

/auth/resend : 
    Input : body - email
    Output : 
        - invalid email
        - code sent to email

# Superadmin : /superadmin

default : 
email : superadmin@superadmin.com
pass : superadmin

/superadmin POST : create superadmin
/superadmin GET : get all superadmins
/superadmin/:id GET : get one superadmin
/superadmin/:id PATCH : update superadmin
/superadmin/:id DELETE : delete superadmin

# Event Manager : /eventmanager
default : 
email : eventmanager@eventmanager.com
pass : eventmanager

Same principles for crud