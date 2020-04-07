export const DATA: string = `
SET search_path = netflixpoly;
-- Enables pgcrypto
DROP EXTENSION pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgcrypto; 

-- Administrators 
INSERT INTO NETFLIXPOLY.Administrator VALUES ('admin@netflixpoly.com', crypt('password1', netflixpoly.gen_salt('bf')));

-- Members
INSERT INTO NETFLIXPOLY.Member VALUES ('email1@gmail.com', crypt('password1', netflixpoly.gen_salt('bf')), 'Jean',   'Lebeau',       'rue du gouverneur',        '301', 'H7P 9H7', 'Laval',      'QC', 'Canada');
INSERT INTO NETFLIXPOLY.Member VALUES ('email2@gmail.com', crypt('password2', netflixpoly.gen_salt('bf')), 'Marie',  'Antoinette',   '90e avenue',               '590', 'H7W 6H7', 'Laval',      'QC', 'Canada');
INSERT INTO NETFLIXPOLY.Member VALUES ('email3@gmail.com', crypt('password3', netflixpoly.gen_salt('bf')), 'Maude',  'Saint-Paul',   'boulevard saint-martin',   '200', 'H7W 8L7', 'Laval',      'QC', 'Canada');
INSERT INTO NETFLIXPOLY.Member VALUES ('email4@gmail.com', crypt('password4', netflixpoly.gen_salt('bf')), 'Calvin', 'Klein',        'edouard mont-petit',       '908', 'H3R 9H7', 'Montreal',   'QC', 'Canada');
INSERT INTO NETFLIXPOLY.Member VALUES ('email5@gmail.com', crypt('password5', netflixpoly.gen_salt('bf')), 'Hugo',   'Boss',         'rue cavendish',            '100', 'H4P 9H7', 'Montreal',   'QC', 'Canada');
INSERT INTO NETFLIXPOLY.Member VALUES ('email6@gmail.com', crypt('password6', netflixpoly.gen_salt('bf')), 'Nina',   'Ricci',        'boulevard sainte rose',    '604', 'H3P 8H7', 'Montreal',   'QC', 'Canada');
INSERT INTO NETFLIXPOLY.Member VALUES ('email7@gmail.com', crypt('password7', netflixpoly.gen_salt('bf')), 'Yves',   'Rocher',       'rue mille',                '307', 'H2N 3N7', 'Montreal',   'QC', 'Canada');

-- Subscribed Members
INSERT INTO NETFLIXPOLY.SubscribedMember VALUES ('email1@gmail.com', 100,   '2019-12-04', '2020-12-04');
INSERT INTO NETFLIXPOLY.SubscribedMember VALUES ('email2@gmail.com', 15,    '2020-03-04', '2020-04-04');
INSERT INTO NETFLIXPOLY.SubscribedMember VALUES ('email3@gmail.com', 60,    '2019-12-04', '2020-06-04');
INSERT INTO NETFLIXPOLY.SubscribedMember VALUES ('email4@gmail.com', 100,   '2019-01-04', '2021-01-04');

-- Pay Per View Members
INSERT INTO NETFLIXPOLY.PayPerViewMember VALUES ('email5@gmail.com', NULL);
INSERT INTO NETFLIXPOLY.PayPerViewMember VALUES ('email6@gmail.com', 5);
INSERT INTO NETFLIXPOLY.PayPerViewMember VALUES ('email7@gmail.com', 3);

-- Credit Cards
INSERT INTO NETFLIXPOLY.CreditCard VALUES ('5151909080876564',  'email1@gmail.com', 'Jean', 'Lebeau',       '2025-01-04', 555);
INSERT INTO NETFLIXPOLY.CreditCard VALUES ('4917194934861415',  'email2@gmail.com', 'Marie',  'Antoinette', '2024-09-01', 666);
INSERT INTO NETFLIXPOLY.CreditCard VALUES ('6397436373151426',  'email3@gmail.com', 'Maude',  'Saint-Paul', '2025-12-08', 815);
INSERT INTO NETFLIXPOLY.CreditCard VALUES ('3537624155758678',  'email4@gmail.com', 'Calvin', 'Klein',      '2022-11-15', 972);
INSERT INTO NETFLIXPOLY.CreditCard VALUES ('5485667163502783',  'email5@gmail.com', 'Hugo',   'Boss',       '2024-08-19', 673);
INSERT INTO NETFLIXPOLY.CreditCard VALUES ('6011605900024209',  'email6@gmail.com', 'Nina',   'Ricci',      '2024-04-20', 747);
INSERT INTO NETFLIXPOLY.CreditCard VALUES ('0604177510135516',  'email7@gmail.com', 'Yves',   'Rocher',     '2023-10-13', 978);
INSERT INTO NETFLIXPOLY.CreditCard VALUES ('348930913082441',   'email1@gmail.com', 'Jean', 'Lebeau',     '2022-06-04', 874);

-- Movies
SELECT SETVAL((SELECT pg_get_serial_sequence('NETFLIXPOLY.Movie', 'idmovie')), 1, false);
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'Fast and Furious 9',    'Action',   '2020-04-01', 230, 70, 5, '_qyw6LC5pnE?start=0', 'https://honknews.com/wp-content/uploads/2020/01/fast-furious-1-696x451.png'); -- 1
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'The Transporter 3',     'Crime',    '2008-11-26', 125, 30, 2, 'Pbh3CDBNIQA?start=0', 'https://images.squarespace-cdn.com/content/v1/54e310f0e4b0f4a6ba3ac899/1566682302737-QXI2DF3C1YBQZ07ZU2A1/ke17ZwdGBToddI8pDm48kC_zU2BfZ5ZIMnHNJenIZNVZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpxijL9Wuh_4Ac8cZwXoOib6zhExuFZ5P2Nej7FDWJFPl4XcRpbKNAnqXKYQs44295g/Transporter+3+poster.jpg?format=750w'); -- 2
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'Spenser Confidential',  'Action',   '2020-03-06', 177, 60, 5, 'bgKEoHNi3Uc?start=0', 'https://m.media-amazon.com/images/M/MV5BMTdkOTEwYjMtNDA1YS00YzVlLTg0NWUtMmQzNDZhYWUxZmIyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg'); -- 3
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'Salt',                  'Drama',    '2010-07-23', 118, 30, 3, 'QZ40WlshNwU?start=0', 'https://s3.amazonaws.com/sobrosimages/wp-content/uploads/2018/03/15094425/salt1.jpg'); -- 4
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'Taken',                 'Thriller', '2008-01-30', 112, 20, 2, 'uPJVJBm9TPA?start=0', 'https://images.moviesanywhere.com/9eaf38a4ad109ab3da9969a7a758ce7c/45732e76-78e0-4f7e-82f2-94a77498c0a1.jpg?r=3x1&w=2400'); -- 5
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'Skyfall',               'Mystery',  '2012-11-09', 153, 25, 3, '6kw1UVovByw?start=0', 'https://www.denofgeek.com/wp-content/uploads/2012/11/skyfall-main_1.jpg?resize=640%2C380'); -- 6
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'Central Intelligence',  'Crime',    '2016-06-17', 147, 40, 3, '0FKctBraQj0?start=0', 'https://www.denofgeek.com/wp-content/uploads/2016/06/central-intelligence-poster.jpg?resize=620%2C347'); -- 7
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'Ride Along',            'Comedy',   '2016-01-15', 154, 40, 4, '5klp6rkHIks?start=0', 'https://images.moviesanywhere.com/e38d1594e908c0227da7f0fc6eb92824/fc6b6dcd-2a75-4876-9a51-4fa7e474613c.jpg?h=375&resize=fit&w=250'); -- 8
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'Top Gun',               'Action',   '1986-04-12',  88, 10, 1, 'xa_z57UatDY?start=0', 'https://www.armytimes.com/resizer/hFdTeHDRGBwBbRX81rIwxXTX_e8=/1200x0/filters:quality(100)/arc-anglerfish-arc2-prod-mco.s3.amazonaws.com/public/35IHQVBWRBCNFPKY6I5CJU3WVQ.jpg'); -- 9
INSERT INTO NETFLIXPOLY.Movie VALUES (DEFAULT, 'Titanic',               'Drama',    '1997-11-18', 117, 10, 1, '2e-eXJ6HgkQ?start=0', 'https://www.onthisday.com/images/articles/titanic-the-movie.jpg'); -- 10

-- Order
SELECT SETVAL((SELECT pg_get_serial_sequence('NETFLIXPOLY.Order', 'idorder')), 1, false);
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email1@gmail.com', 4,  '2020-03-29'); -- 1
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email2@gmail.com', 3,  '2020-01-30'); -- 2 
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email2@gmail.com', 4,  '2020-01-13'); -- 3
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email2@gmail.com', 5,  '2020-03-28'); -- 4
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email3@gmail.com', 1,  '2020-02-15'); -- 5
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email3@gmail.com', 2,  '2020-02-03'); -- 6
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email4@gmail.com', 1,  '2020-02-01'); -- 7
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email3@gmail.com', 2,  '2020-03-04'); -- 8
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email3@gmail.com', 8,  '2020-03-07'); -- 9
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email6@gmail.com', 1,  '2019-12-30'); -- 10
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email6@gmail.com', 2,  '2019-10-13'); -- 11
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email5@gmail.com', 3,  '2019-12-17'); -- 12
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email6@gmail.com', 4,  '2019-11-30'); -- 13
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email6@gmail.com', 5,  '2019-09-14'); -- 14
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email7@gmail.com', 7,  '2019-10-18'); -- 15
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email3@gmail.com', 3,  '2019-12-21'); -- 16
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email2@gmail.com', 5,  '2019-11-24'); -- 17
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email7@gmail.com', 9,  '2019-11-24'); -- 18
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email7@gmail.com', 10, '2019-11-24'); -- 19
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email6@gmail.com', 10, '2019-12-24'); -- 20
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email7@gmail.com', 10, '2019-10-24'); -- 21
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email1@gmail.com', 10, '2019-09-24'); -- 22
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email1@gmail.com', 10, '2019-08-24'); -- 23
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email7@gmail.com', 10, '2019-07-24'); -- 24
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email7@gmail.com', 10, '2019-06-24'); -- 25
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email5@gmail.com', 10, '2019-05-24'); -- 26
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email7@gmail.com', 10, '2019-04-24'); -- 27
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email4@gmail.com', 10, '2019-03-24'); -- 28
INSERT INTO NETFLIXPOLY.Order VALUES (DEFAULT, 'email7@gmail.com', 10, '2019-02-24'); -- 29

-- IDs des deux tables susivantes reliés au IDs des orders
-- DVDid, comment on le relie à un film en particulier ?
-- Order DVD
INSERT INTO NETFLIXPOLY.OrderDVD VALUES (1, 2, 666); -- 666 temproraires
INSERT INTO NETFLIXPOLY.OrderDVD VALUES (2, 1, 666); -- frais a calculer en fonction de la distance
INSERT INTO NETFLIXPOLY.OrderDVD VALUES (3, 5, 666);
INSERT INTO NETFLIXPOLY.OrderDVD VALUES (4, 7, 666); -- DVD IDs a changer
INSERT INTO NETFLIXPOLY.OrderDVD VALUES (5, 6, 666); 
INSERT INTO NETFLIXPOLY.OrderDVD VALUES (6, 2, 666); 
INSERT INTO NETFLIXPOLY.OrderDVD VALUES (7, 2, 666);
INSERT INTO NETFLIXPOLY.OrderDVD VALUES (8, 2, 666);

-- Streaming
INSERT INTO NETFLIXPOLY.Streaming VALUES (10, 1.12);
INSERT INTO NETFLIXPOLY.Streaming VALUES (11, 0.50);
INSERT INTO NETFLIXPOLY.Streaming VALUES (12, 0.27);
INSERT INTO NETFLIXPOLY.Streaming VALUES (13, 1.50);
INSERT INTO NETFLIXPOLY.Streaming VALUES (14, 0.02);
INSERT INTO NETFLIXPOLY.Streaming VALUES (15, 0.35);
INSERT INTO NETFLIXPOLY.Streaming VALUES (16, 2.10);
INSERT INTO NETFLIXPOLY.Streaming VALUES (17, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (18, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (19, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (20, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (21, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (22, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (23, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (24, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (25, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (26, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (27, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (28, 2.00);
INSERT INTO NETFLIXPOLY.Streaming VALUES (29, 2.00);

-- Participant
SELECT SETVAL((SELECT pg_get_serial_sequence('NETFLIXPOLY.Participant', 'idparticipant')), 1, false);
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Vin Diesel',          '1967/07/18', 'USA',      'M'); -- 1
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'John Cena',           '1977/04/23', 'USA',      'M'); -- 2
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Jason Statham',       '1967/07/26', 'USA',      'M'); -- 3
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Iliza Shlesinger',    '1983/02/22', 'USA',      'F'); -- 4
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Angelina Jolie',      '1975/06/04', 'USA',      'F'); -- 5
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Jeremy Renner',       '1971/01/07', 'USA',      'M'); -- 6
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Daniel Craig',        '1968/03/02', 'England',  'M'); -- 7
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Dwayne Johnson',      '1972/05/02', 'Canada',   'M'); -- 8
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Kevin Hart',          '1979/07/06', 'USA',      'M'); -- 9
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Tom Cruise',          '1962/07/03', 'USA',      'M'); -- 10
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Kate Winslet',        '1975/10/05', 'England',  'F'); -- 11
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'James Cameron',       '1954/08/16', 'USA',      'M'); -- 12
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Steven Spielberg',    '1946/12/18', 'USA',      'M'); -- 13
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Mel Brooks'      ,    '1926/06/28', 'USA',      'M'); -- 14
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Jerry Bruckheimer',   '1943/09/21', 'USA',      'M'); -- 15
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'George Lucas',        '1944/05/14', 'USA',      'M'); -- 16
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Woody Allen',        	'1935/12/01', 'USA',      'M'); -- 17
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Hope Olaide Wilson', 	'1985/08/16', 'England',  'F'); -- 18
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'olya zueva',        	'1987/08/23', 'Russia',   'F'); -- 19
INSERT INTO NETFLIXPOLY.Participant VALUES (DEFAULT, 'Jennifer Connelly',  	'1970/12/12', 'USA',      'F'); -- 20


-- Participation
INSERT INTO NETFLIXPOLY.Participation VALUES (1,  15,    'Producer', 11000);
INSERT INTO NETFLIXPOLY.Participation VALUES (2,  14,    'Producer', 12000);
INSERT INTO NETFLIXPOLY.Participation VALUES (3,  13,    'Producer', 13000);
INSERT INTO NETFLIXPOLY.Participation VALUES (4,  14,    'Producer', 13200);
INSERT INTO NETFLIXPOLY.Participation VALUES (5,  16,    'Producer', 14000);
INSERT INTO NETFLIXPOLY.Participation VALUES (6,  13,    'Producer', 15000);
INSERT INTO NETFLIXPOLY.Participation VALUES (7,  15,    'Producer', 16000);
INSERT INTO NETFLIXPOLY.Participation VALUES (8,  14,    'Producer', 11500);
INSERT INTO NETFLIXPOLY.Participation VALUES (9,  16,    'Producer', 12400);
INSERT INTO NETFLIXPOLY.Participation VALUES (10, 16,    'Producer', 10000);
INSERT INTO NETFLIXPOLY.Participation VALUES (10, 17,    'Producer', 15000);

INSERT INTO NETFLIXPOLY.Participation VALUES (1, 1,     'Actor',    10000);
INSERT INTO NETFLIXPOLY.Participation VALUES (1, 2,     'Actor',    50000);
INSERT INTO NETFLIXPOLY.Participation VALUES (2, 5,     'Actor',    100000);
INSERT INTO NETFLIXPOLY.Participation VALUES (3, 4,     'Actor',    65000);
INSERT INTO NETFLIXPOLY.Participation VALUES (4, 5,     'Actor',    45000);
INSERT INTO NETFLIXPOLY.Participation VALUES (5, 6,     'Actor',    25000);
INSERT INTO NETFLIXPOLY.Participation VALUES (6, 7,     'Actor',    26500);
INSERT INTO NETFLIXPOLY.Participation VALUES (7, 8,     'Actor',    28700);
INSERT INTO NETFLIXPOLY.Participation VALUES (8, 9,     'Actor',    99000);
INSERT INTO NETFLIXPOLY.Participation VALUES (9, 10,    'Actor',    9600);
INSERT INTO NETFLIXPOLY.Participation VALUES (9, 11,    'Actor',    65000);
INSERT INTO NETFLIXPOLY.Participation VALUES (2, 17,    'Actor', 	15000);
INSERT INTO NETFLIXPOLY.Participation VALUES (3, 18,    'Actor', 	19500);
INSERT INTO NETFLIXPOLY.Participation VALUES (4, 19,    'Actor', 	190500);
INSERT INTO NETFLIXPOLY.Participation VALUES (9, 20,    'Actor', 	85000);

-- Oscars
INSERT INTO NETFLIXPOLY.Oscars VALUES ('2020-02-09', 'Los Angeles', ''); -- No host
INSERT INTO NETFLIXPOLY.Oscars VALUES ('2019-02-24', 'Los Angeles', 'David Oyelowo'); 
INSERT INTO NETFLIXPOLY.Oscars VALUES ('2018-03-04', 'Los Angeles', 'Jimmy Kimmel');

-- Nomination
INSERT INTO NETFLIXPOLY.Nomination VALUES ('2020-02-09', 1, true,  'Action');
INSERT INTO NETFLIXPOLY.Nomination VALUES ('2019-02-24', 7, false, 'Action');
INSERT INTO NETFLIXPOLY.Nomination VALUES ('2019-02-24', 5, false, 'Drama');
INSERT INTO NETFLIXPOLY.Nomination VALUES ('2018-03-04', 9, true,  'Foreign');
INSERT INTO NETFLIXPOLY.Nomination VALUES ('2018-03-04', 4, true,  'Thriller');
;`;
