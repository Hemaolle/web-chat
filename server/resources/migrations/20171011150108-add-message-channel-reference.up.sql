-- START:add-channel-reference
ALTER TABLE messages
  ADD channel_id INTEGER;
--;;
ALTER TABLE messages
  ADD FOREIGN KEY (channel_id) REFERENCES public.channels(id);
--;;
UPDATE messages
SET channel_id = 1;
-- END:add-channel-reference