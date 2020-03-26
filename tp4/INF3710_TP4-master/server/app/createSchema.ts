export const SCHEMA: string = `
	SET search_path = netflixpoly;

	DROP SCHEMA IF EXISTS NETFLIXPOLY CASCADE;
	CREATE SCHEMA NETFLIXPOLY;

	CREATE DOMAIN NETFLIXPOLY.sex AS VARCHAR
		CHECK (VALUE IN ('M', 'F'));

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Member (
		email				VARCHAR(30)						NOT NULL,
		password			VARCHAR(30)						NOT NULL,
		firstName			VARCHAR(30)						NOT NULL,
		lastName			VARCHAR(30)						NOT NULL,
		street				VARCHAR(30)						NOT NULL,
		appartmentNo		NUMERIC							NOT NULL,
		postalCode			VARCHAR(30)						NOT NULL,
		city				VARCHAR(30)						NOT NULL,
		state				VARCHAR(30)						NOT NULL,
		country				VARCHAR(30)						NOT NULL,
		PRIMARY KEY (email)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.SubscribedMember (
		email				VARCHAR(30)						NOT NULL,
		fee					NUMERIC							NOT NULL,
		startDate			DATE							NOT NULL,
		endDate				DATE							NOT NULL,
		PRIMARY KEY (email),
		FOREIGN KEY (email) REFERENCES NETFLIXPOLY.Member(email)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.PayPerViewMember (
		email				VARCHAR(30)						NOT NULL,
		film_payPerView		NUMERIC,
		PRIMARY KEY (email),
		FOREIGN KEY (email) REFERENCES NETFLIXPOLY.Member(email)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.CreditCard (
		cardNumber			VARCHAR(30)						NOT NULL,
		ownerID				VARCHAR(30)						NOT NULL,
		firstName			VARCHAR(30)						NOT NULL,
		lastName			VARCHAR(30)						NOT NULL,
		expiryDate			DATE							NOT NULL,
		cvc					NUMERIC							NOT NULL,
		PRIMARY KEY (cardNumber),
		FOREIGN KEY (ownerID) REFERENCES NETFLIXPOLY.Member(email)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Movie (
		idMovie				SERIAL							NOT NULL,
		title				VARCHAR(30)						NOT NULL,
		category			VARCHAR(30)						NOT NULL,
		productionDate		DATE							NOT NULL,
		duration			NUMERIC							NOT NULL,
		dvdPrice			NUMERIC							NOT NULL,
		streamingFee		NUMERIC							NOT NULL,
		PRIMARY KEY (idMovie)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Order (
		idOrder				SERIAL							NOT NULL,
		clientID			VARCHAR(30)						NOT NULL,
		movieID				INTEGER							NOT NULL,
		dateOrder			DATE 							NOT NULL,
		PRIMARY KEY (idOrder),
		FOREIGN KEY (clientID) REFERENCES NETFLIXPOLY.Member(email),
		FOREIGN KEY (movieID)  REFERENCES NETFLIXPOLY.Movie(id)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.OrderDVD (
		idOrder				SERIAL							NOT NULL,
		dvdID				VARCHAR(30)						NOT NULL,
		shippingFee			NUMERIC							NOT NULL,
		PRIMARY KEY (idOrder),
		FOREIGN KEY (idOrder) REFERENCES NETFLIXPOLY.Order(id)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Streaming (
		idOrder				SERIAL							NOT NULL,
		stoppedAt			NUMERIC,
		PRIMARY KEY (idOrder),
		FOREIGN KEY (idOrder) REFERENCES NETFLIXPOLY.Order(id)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Participant (
		idParticipant		SERIAL							NOT NULL,
		name				VARCHAR(30)						NOT NULL,
		age					NUMERIC							NOT NULL,
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
		FOREIGN KEY (movieID) 		REFERENCES NETFLIXPOLY.Movie(id),
		FOREIGN KEY (participantID) REFERENCES NETFLIXPOLY.Participant(id)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Oscars (
		dateOfCeremony		DATE							NOT NULL,
		locationOfCeremony	VARCHAR(30)						NOT NULL,
		host				VARCHAR(30),
		PRIMARY KEY (dateOfCeremony)
	);

	CREATE TABLE IF NOT EXISTS  NETFLIXPOLY.Nomination (
		dateOfCeremony		DATE							NOT NULL,
		movieID				INTEGER							NOT NULL,
		winner				BOOLEAN,
		category			VARCHAR(30)						NOT NULL,
		PRIMARY KEY (dateOfCeremony, movieID),
		FOREIGN KEY (dateOfCeremony) 		REFERENCES NETFLIXPOLY.Oscars(dateOfCeremony),
		FOREIGN KEY (movieID) 				REFERENCES NETFLIXPOLY.Movie(idMovie)
	);
`;
