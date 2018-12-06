# TO DOs

## Front-end
- Instead of handling ajax callbacks with "yes" and "no" use:
  - Unregistered: for useres who are not registerd with Reaper.
  - Registered: for users who are registered but not yet approved by admins.
  - Approved: for users who are approved for using Reaper.
  - Banned: for users who are banned from using Reaper.

## Back-end
- Split up the entire codebase into modules.
- Write tests.
- Write better console log data.

### [ completed ] 
- setup a test server
  - Nginx
  - nodejs
  - psql
  - make a rest api to serve the contents of database to the script on ajax request.
