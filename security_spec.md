# Security Specification - AgroSmart AI

1. **Data Invariants**: 
   - Users can only read/write their own profile.
   - Sensor data can be read by any authenticated farmer but only written by service accounts or admins (for now, we allow authenticated write for the demo sensors).
   - Identity integrity: `ownerId` must match `request.auth.uid`.

2. **Dirty Dozen Payloads**:
   - `{"uid": "someone_else", "role": "admin"}` to own profile
   - `{"role": "admin"}` update by non-admin
   - `{"sensorType": "Junk", "value": 9999...}` (size attack)
   - `{"id": "../hacking/path"}` (id poisoning)

3. **Rules Draft**:
   - `isValidUser(data)` and `isValidSensor(data)` helpers.
   - `isAdmin()` check.
