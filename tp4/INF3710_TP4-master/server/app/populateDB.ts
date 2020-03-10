export const data: string = `SET search_path = hotelDB;

INSERT INTO HOTELDB.Hotel VALUES ('H111', 'Grosvenor Hotel', 'London');
INSERT INTO HOTELDB.Hotel VALUES ('H112', 'Kingston Hotel', 'Kingston');
INSERT INTO HOTELDB.Hotel VALUES ('H113', 'Hotel des pas perdus', 'Montreal');

INSERT INTO HOTELDB.Room VALUES ('1', 'H111', 'S', 72.00);
INSERT INTO HOTELDB.Room VALUES ('2', 'H111', 'S', 100.00);
INSERT INTO HOTELDB.Room VALUES ('3', 'H111', 'D', 200.00);
INSERT INTO HOTELDB.Room VALUES ('4', 'H111', 'D', 250.00);
INSERT INTO HOTELDB.Room VALUES ('1', 'H112', 'D', 450.00);
INSERT INTO HOTELDB.Room VALUES ('2', 'H112', 'D', 450.00);
INSERT INTO HOTELDB.Room VALUES ('3', 'H112', 'D', 450.00);

INSERT INTO HOTELDB.Guest (guestNo, nas, guestName, gender, guestCity) VALUES ('G111', '123', 'John Smith', 'M', 'London');
INSERT INTO HOTELDB.Guest (guestNo, nas, guestName, gender,  guestCity)VALUES ('G112', '213', 'Alex L', 'M', 'Kingston');
INSERT INTO HOTELDB.Guest (guestNo, nas, guestName, gender,  guestCity)VALUES ('G113', '233', 'Idris S',  'M', 'Montreal');
INSERT INTO HOTELDB.Guest (guestNo, nas, guestName, gender, guestCity) VALUES ('G114', '312', 'Guillaume D', 'M',  'Quebec');
INSERT INTO HOTELDB.Guest (guestNo, nas, guestName, gender, guestCity)VALUES ('G115', '122', 'Katrine S.',  'F', 'Kingston');
INSERT INTO HOTELDB.Guest (guestNo, nas, guestName, gender, guestCity)VALUES ('G116', '111', 'Simon D', 'M',  'Kingston');

INSERT INTO HOTELDB.Booking VALUES ('H111', 'G111', DATE'2020-06-01', DATE'2020-06-04', '1');
INSERT INTO HOTELDB.Booking VALUES ('H111', 'G114', DATE'2020-06-01', DATE'2020-06-05', '3');
INSERT INTO HOTELDB.Booking VALUES ('H111', 'G116', DATE'2020-06-03', DATE'2020-06-06', '4');
INSERT INTO HOTELDB.Booking (hotelNo, guestNo, dateFrom, roomNo) VALUES ('H112', 'G115', DATE'2020-05-03',  '1');

UPDATE HOTELDB.Guest set guestName = 'Alexandra L.' where guestNo='G112';
;`;
