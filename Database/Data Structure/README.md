Do not generate the primary keys (e.g. U_id in Users, H_id in Helpers, etc.) and Ts_created! They are automatically computed!
Leave every I_id NULL and don't populate the Profile_Images table.
The password of the Users and Helpers is encrypted using this configuration of salt:
```
const saltRounds = 10; // Higher = more secure, but slower
const hashedPassword = await bcrypt.hash(password, saltRounds);
```