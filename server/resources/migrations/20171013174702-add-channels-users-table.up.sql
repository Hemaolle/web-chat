CREATE TABLE channelsUsers
(user_id INTEGER,
channel_id INTEGER,
CONSTRAINT FK_UserId FOREIGN KEY (user_id) REFERENCES public.users(id),
CONSTRAINT FK_ChannelId FOREIGN KEY (channel_id) REFERENCES public.channels(id));