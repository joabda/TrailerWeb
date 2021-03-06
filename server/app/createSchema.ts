export const SCHEMA: string = `
SET search_path = netflixpoly;

DROP SCHEMA IF EXISTS netflixpoly CASCADE;
CREATE SCHEMA netflixpoly;

CREATE DOMAIN NETFLIXPOLY.sex AS VARCHAR
	CHECK (VALUE IN ('M', 'F'));

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Administrator (
	email				VARCHAR(320)					NOT NULL,
	password			VARCHAR(60)						NOT NULL,
	PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Member (
	email				VARCHAR(320)					NOT NULL,
	password			VARCHAR(60)						NOT NULL,
	firstName			VARCHAR							NOT NULL,
	lastName			VARCHAR							NOT NULL,
	street				VARCHAR							NOT NULL,
	appartmentNo		NUMERIC							NOT NULL,
	postalCode			VARCHAR(7)						NOT NULL,
	city				VARCHAR							NOT NULL,
	state				VARCHAR							NOT NULL,
	country				VARCHAR							NOT NULL,
	PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.SubscribedMember (
	email				VARCHAR(320)					NOT NULL,
	fee					NUMERIC							NOT NULL,
	startDate			DATE							NOT NULL,
	endDate				DATE							NOT NULL,
	PRIMARY KEY (email),
	FOREIGN KEY (email) REFERENCES NETFLIXPOLY.Member(email)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.PayPerViewMember (
	email				VARCHAR(320)					NOT NULL,
	film_payPerView		NUMERIC,
	PRIMARY KEY (email),
	FOREIGN KEY (email) REFERENCES NETFLIXPOLY.Member(email)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.CreditCard (
	cardNumber			VARCHAR(16)						NOT NULL,
	ownerID				VARCHAR(320)					NOT NULL,
	firstName			VARCHAR							NOT NULL,
	lastName			VARCHAR							NOT NULL,
	expiryDate			DATE							NOT NULL,
	cvc					NUMERIC							NOT NULL,
	PRIMARY KEY (cardNumber),
	FOREIGN KEY (ownerID) REFERENCES NETFLIXPOLY.Member(email)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Movie (
	idMovie				SERIAL							NOT NULL,
	title				VARCHAR							NOT NULL,
	category			VARCHAR(30)						NOT NULL,
	productionDate		DATE							NOT NULL,
	duration			NUMERIC							NOT NULL,
	dvdPrice			NUMERIC							NOT NULL,
	streamingFee		NUMERIC							NOT NULL,
	movieURL			VARCHAR							NOT NULL,
	imgURL				VARCHAR							NOT NULL,
	PRIMARY KEY (idMovie)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Order (
	idOrder				SERIAL							NOT NULL,
	clientID			VARCHAR(320)					NOT NULL,
	movieID				INTEGER							NOT NULL,
	dateOrder			DATE 							NOT NULL,
	PRIMARY KEY (idOrder),
	FOREIGN KEY (clientID) REFERENCES NETFLIXPOLY.Member(email),
	FOREIGN KEY (movieID)  REFERENCES NETFLIXPOLY.Movie(idMovie)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.OrderDVD (
	idOrder				SERIAL							NOT NULL,
	dvdID				VARCHAR(30)						NOT NULL,
	shippingFee			NUMERIC							NOT NULL,
	PRIMARY KEY (idOrder),
	FOREIGN KEY (idOrder) REFERENCES NETFLIXPOLY.Order(idOrder)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Streaming (
	idOrder				SERIAL							NOT NULL,
	stoppedAt			NUMERIC,
	PRIMARY KEY (idOrder),
	FOREIGN KEY (idOrder) REFERENCES NETFLIXPOLY.Order(idOrder)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Participant (
	idParticipant		SERIAL							NOT NULL,
	name				VARCHAR							NOT NULL,
	dateOfBirth			DATE							NOT NULL,
	nationality			VARCHAR(30)						NOT NULL,
	sex					NETFLIXPOLY.sex					NOT NULL,
	PRIMARY KEY (idParticipant)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Participation (
	movieID				INTEGER							NOT NULL,
	participantID		INTEGER							NOT NULL,
	role				VARCHAR(30)						NOT NULL,
	salary				NUMERIC							NOT NULL,
	PRIMARY KEY (movieID, participantID),
	FOREIGN KEY (movieID) 		REFERENCES NETFLIXPOLY.Movie(idMovie),
	FOREIGN KEY (participantID) REFERENCES NETFLIXPOLY.Participant(idParticipant)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Oscars (
	dateOfCeremony		DATE							NOT NULL,
	locationOfCeremony	VARCHAR							NOT NULL,
	host				VARCHAR,
	PRIMARY KEY (dateOfCeremony)
);

CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Nomination (
	dateOfCeremony		DATE							NOT NULL,
	movieID				INTEGER							NOT NULL,
	winner				BOOLEAN,
	category			VARCHAR							NOT NULL,
	PRIMARY KEY (dateOfCeremony, movieID),
	FOREIGN KEY (dateOfCeremony) 		REFERENCES NETFLIXPOLY.Oscars(dateOfCeremony),
	FOREIGN KEY (movieID) 				REFERENCES NETFLIXPOLY.Movie(idMovie)
);
`;
