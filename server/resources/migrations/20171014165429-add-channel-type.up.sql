ALTER TABLE channels
  ADD type INTEGER;
--;;
UPDATE channels
SET type=0;