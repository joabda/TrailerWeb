SET search_path = netflixpoly;

-- 1 Affichez toutes les informations sur un film spécifié par l'utilisateur (selon le titre) 
PREPARE infoForMovie (VARCHAR) AS
    SELECT * 
    FROM Movie
    WHERE title = $1;
EXECUTE infoForMovie('movie from user');


-- 2 Pour chaque genre de film, listez tous les titres de films ainsi que la dernière date à laquelle un film a été acheté (DVD) ou visionné
SELECT category, title, MAX(dateOrder) AS lastViewing
	FROM Movie, netflixpoly.Order
	WHERE netflixpoly.Order.movieID = Movie.idMovie
	GROUP BY title, category
	ORDER BY category;

-- 3 Pour chaque genre de film, trouvez les noms et courriels des membres qui les ont téléchargés le  plus  souvent.  
-- Par  exemple,  Amal  Z  est  le  membre  qui  a  téléchargé  le  plus  de documentaires animaliers
DROP VIEW IF EXISTS categoryCountByMember;
CREATE VIEW categoryCountByMember									 -- Obtenir le nb de films regardé par personne par cat
	AS SELECT firstName, lastName, category, COUNT(title)
		FROM Movie, netflixpoly.Order, streaming, netflixpoly.Member
		WHERE netflixpoly.Order.idOrder = streaming.idOrder 
		AND netflixpoly.Order.clientID = netflixpoly.Member.email
		AND netflixpoly.Order.movieID = Movie.idMovie
		GROUP BY firstName, lastName, category;

SELECT *															-- Si plusieurs personnes ont le meme nombre, affiche les deux
	FROM categoryCountByMember
	WHERE (category, count) IN (
		SELECT category, MAX(count)
			FROM categoryCountByMember
			GROUP BY category		
	)
	ORDER BY category;

	
-- 4 Trouvez le nombre total de films groupés par réalisateur
SELECT p.name, COUNT(m.idmovie) as numberOfMovies 
	FROM netflixpoly.movie as m, netflixpoly.participant as p, netflixpoly.participation as ps
	WHERE idmovie = ps.movieID 
	AND ps.participantID = p.idparticipant
	AND ps.role = 'Producer'
	GROUP BY p.idparticipant;

-- 5 Trouvez les noms des membres dont le coût total d’achat de DVD est plus élevé que la moyenne
-- SELECT firstName, lastName, SUM()


-- 6 Ordonnez et retournez les films en termes de quantité totale vendue (DVD) et en nombre de visionnements
-- 	SELECT title, COUNT(Streaming.idOrder) as nbVisionnement--, COUNT(OrderDVD.idOrder) as totalVendu
-- 		FROM Movie, Streaming, OrderDVD, netflixpoly.Order
-- 		WHERE netflixpoly.Order.idOrder = Streaming.idOrder
-- 		--OR netflixpoly.Order.idOrder = OrderDVD.idOrder
-- 		AND Movie.idMovie = netflixpoly.Order.movieId
-- 		GROUP By Movie.idMovie
-- 		ORDER BY title;

-- 7 Trouvez le titre et le prix des films qui n’ont jamais été commandés sous forme de DVD mais qui ont été visionnés plus de 10 fois
SELECT title
FROM netflixpoly.movie as m, netflixpoly.order as o, netflixpoly.streaming as s
WHERE m.idmovie = o.movieid
AND s.idorder = o.idorder
AND o.movieid NOT IN (
	SELECT o.movieid 
	FROM netflixpoly.orderdvd as d, netflixpoly.order as o
	WHERE d.idorder = o.idorder
)
GROUP BY title
HAVING COUNT(title) > 10;

-- 8 Trouvez le nom et date de naissance des acteurs qui jouent dans les films qui sont visionnés le plus souvent (soit plus que la moyenne) 
DROP VIEW IF EXISTS mostViewedMovies;
CREATE VIEW mostViewedMovies
	AS SELECT idMovie, title, COUNT(title) as count
		FROM Movie, netflixpoly.Order, Streaming
		WHERE Movie.idmovie = netflixpoly.Order.movieid
		AND streaming.idorder = netflixpoly.Order.idorder
		GROUP BY title, idMovie;
		
SELECT name, dateOfBirth, title --On garde l'age ou on en deduit l'année de naissance ?
	FROM Participant, Participation, mostViewedMovies
	WHERE mostViewedMovies.idMovie = Participation.movieID
	AND Participation.participantID = Participant.idParticipant
	AND mostViewedMovies.count >= (SELECT AVG(mostViewedMovies.count) FROM mostViewedMovies);
	

-- 9 Trouvez le nom du ou des réalisateurs qui ont réalisé les films qui ont le plus grand nombre de nominations aux oscars.  Par exemple, Woody Allen et Steven Spielberg ont réalisé 10 films qui ont été nominés aux oscars.
DROP VIEW IF EXISTS nominationCount;
CREATE VIEW nominationCount
	AS SELECT idmovie, title, COUNT(title) as count
		FROM Movie, Nomination
		WHERE Movie.idmovie = Nomination.movieid
		GROUP BY title, idMovie;

SELECT name, title
	FROM Participant, Participation, nominationCount
	WHERE nominationCount.idMovie = Participation.movieID
	AND Participation.participantID = Participant.idParticipant
	AND Participation.role = 'Producer'
	AND nominationCount.count >= (SELECT AVG(nominationCount.count) FROM nominationCount);

-- 10 Trouvez le nom des réalisateurs qui ont été le plus souvent nominés aux oscars mais qui n’ont jamais gagné d’oscar
DROP VIEW IF EXISTS nominationWithoutWinCount;
CREATE VIEW nominationWithoutWinCount
	AS SELECT idmovie, title, count
		FROM nominationCount, Nomination
		WHERE Nomination.winner = false
		AND Nomination.movieID = nominationCount.idmovie
		GROUP BY title, idMovie, count;

SELECT name
	FROM Participant, Participation, nominationWithoutWinCount
	WHERE nominationWithoutWinCount.idMovie = Participation.movieID
	AND Participation.participantID = Participant.idParticipant
	AND Participation.role = 'Producer'
	AND nominationWithoutWinCount.count >= (SELECT AVG(nominationWithoutWinCount.count) FROM nominationWithoutWinCount);

-- 11 Trouvez  les  films  (titre,  année)  qui  ont  gagné  le  plus  d’oscars.  Listez  également  leur réalisateurs et leurs acteurs ;
DROP VIEW IF EXISTS nominationWinCount;
CREATE VIEW nominationWinCount
	AS SELECT idmovie, title, productionDate, COUNT(title) as count
		FROM Movie, Nomination
		WHERE Movie.idmovie = Nomination.movieid
		AND Nomination.winner = true
		GROUP BY title, idMovie;

SELECT title,  productionDate, name, count AS nbOscars
	FROM Participant, Participation, nominationWinCount
	WHERE nominationWinCount.idMovie = Participation.movieID
	AND Participation.participantID = Participant.idParticipant
	AND Participation.role IN ('Producer', 'Actor')
	AND nominationWinCount.count >= (SELECT AVG(nominationWinCount.count) FROM nominationWinCount)
	ORDER BY title;

-- 12 Quelles paires de femmes québécoises ont le plus souvent travaillé ensemble dans différents films ? 


-- 13 Comment a évolué la carrière de Woody Allen ? (On veut connaitre tous ses rôles dans un film (réalisateur, acteur, etc.) du plus ancien au plus récent)
SELECT name, title, role, productionDate
	FROM Movie, Participant, Participation
	WHERE Participant.name = 'Woody Allen'
	AND Participant.idParticipant = Participation.participantID
	AND Participation.movieID = Movie.idMovie
	ORDER BY productionDate;
