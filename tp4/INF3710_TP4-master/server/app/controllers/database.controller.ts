import { NextFunction, Request, Response, Router } from "express";
import * as fs from "fs";
import { inject, injectable } from "inversify";
import * as jwt from 'jsonwebtoken';
import * as pg from "pg";
import { TOKEN } from "../constants";
import { HTTP } from "../enum/http-codes";
import { Tables } from "../enum/tables";
import { Actor } from "../interface/actor";
import { CreditCard } from "../interface/cc";
import { Movie } from "../interface/movie";
import { Nomination } from "../interface/nomination";
import { Participant } from "../interface/participant";
import { Participation } from "../interface/participation";
import { Token } from "../interface/token";
import { DatabaseService } from "../services/database.service";
import Types from "../types";

@injectable()
export class DatabaseController {
    public constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) { }

    public get router(): Router {
        const router: Router = Router();
        const RSA_PRIVATE_KEY = fs.readFileSync(require('path').resolve(__dirname, 'private.key')).toString('utf8');

        router.post("/createSchema", (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.createSchema().then((result: pg.QueryResult) => {
                res.json(result);
            }).catch((e: Error) => {
                console.error(e.stack);
            });
        });

        router.post("/populateDb", (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.populateDb().then((result: pg.QueryResult) => {
                res.json(result);
            }).catch((e: Error) => {
                console.error(e.stack);
            });
        });

        router.get("/movies", (req: Request, res: Response, next: NextFunction) => {
            if (!this.isValid(req.header(TOKEN) as unknown as string)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.getAllFromTable(Tables.Movie).then((result: pg.QueryResult) => {
                const movies: Movie[] = result.rows.map((movie: any) => (
                    {
                        id: movie.idmovie,
                        title: movie.title,
                        category: movie.category,
                        productionDate: movie.productiondate,
                        duration: movie.duration,
                        dvdPrice: movie.dvdprice,
                        streamingFee: movie.streamingfee,
                        image: movie.imgurl,
                        url: movie.movieurl,
                    }));
                res.json(movies);
            }).catch((e: Error) => {
                console.error(e.stack);
            });
        });

        router.get("/participants", (req: Request, res: Response, next: NextFunction) => {
            if (!this.isValid(req.header(TOKEN) as unknown as string)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.getAllFromTable(Tables.Participant).then((result: pg.QueryResult) => {
                const participants: Participant[] = result.rows.map((participant: any) => (
                    {
                        id: participant.idparticipant,
                        name: participant.name,
                        dateOfbirth: participant.dateofbirth,
                        nationality: participant.nationality,
                        sex: participant.sex,
                    }));
                res.json(participants);
            }).catch((e: Error) => {
                console.error(e.stack);
                res.json(HTTP.Error);
            });
        });

        router.get("/nominations", (req: Request, res: Response, next: NextFunction) => {
            if (!this.isValid(req.header(TOKEN) as unknown as string)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.getAllFromTable(Tables.Nomination).then((result: pg.QueryResult) => {
                const nominations: Nomination[] = result.rows.map((nomination: any) => (
                    {
                        dateOfCeremony: nomination.dateofceremony,
                        movieId: nomination.movieid,
                        winner: nomination.winner,
                        category: nomination.category,
                    }));
                res.json(nominations);
            }).catch((e: Error) => {
                console.error(e.stack);
                res.json(HTTP.Error);
            });
        });

        router.post("/participants/insert", (req: Request, res: Response, next: NextFunction) => {
            const tokenString = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.addParticipant(
                req.body.name,
                req.body.dateOfbirth,
                req.body.nationality,
                req.body.sex,
                req.body.role,
                req.body.salary,
                req.body.movieID
            ).then((result: pg.QueryResult) => {
                res.json(HTTP.Accepted);
            }).catch((e: Error) => {
                console.error(e.stack);
                res.json(HTTP.Error);
            });
        });

        router.get("/actors", (req: Request, res: Response, next: NextFunction) => {
            if (!this.isValid(req.header(TOKEN) as unknown as string)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.getAllFromTable(Tables.Participant).then((result: pg.QueryResult) => {
                const actors: Actor[] = result.rows.map((actor: any) => (
                    {
                        id: actor.idparticipant,
                        name: actor.name,
                        dateOfBirth: actor.dateOfBirth,
                        nationality: actor.nationality,
                        sex: actor.sex
                    }));
                res.json(actors);
            }).catch((e: Error) => {
                console.error(e.stack);
            });
        });

        router.get("/participation", (req: Request, res: Response, next: NextFunction) => {
            if (!this.isValid(req.header(TOKEN) as unknown as string)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.getAllFromTable(Tables.Participation).then((result: pg.QueryResult) => {
                const participations: Participation[] = result.rows.map((participation: any) => (
                    {
                        movieId: participation.movieid,
                        participantId: participation.participantid,
                        role: participation.role,
                        salary: participation.salary,
                    }));
                res.json(participations);
            }).catch((e: Error) => {
                console.error(e.stack);
            });
        });

        router.post("/participation/insert", (req: Request, res: Response, next: NextFunction) => {
            if (!this.isValid(req.header(TOKEN) as unknown as string)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.addParticipation(req.body.participantID, req.body.role, req.body.salary, req.body.movieID)
                .then((result: pg.QueryResult) => {
                    res.json(HTTP.Accepted);
                }).catch((e: Error) => {
                    if (e.message.indexOf('duplicate key') !== -1) {
                        res.json(HTTP.Exists);
                    }
                    res.json(HTTP.Error);
                });
        });

        router.post("/movies/insert", (req: Request, res: Response, next: NextFunction) => {
            const title: string = req.body.title;
            const category: string = req.body.category;
            const productionDate: string = req.body.productionDate;
            const duration: number = req.body.duration;
            const dvdPrice: number = req.body.dvdPrice;
            const streamingFee: number = req.body.streamingFee;
            const movieURL: string = req.body.movieURL;
            const imageURL: string = req.body.imageURL;
            this.databaseService.addMovie(title, category, productionDate, duration, dvdPrice, streamingFee, movieURL, imageURL)
                .then((result: pg.QueryResult) => {
                    res.json(result);
                }).catch((e: Error) => {
                    console.error(e.stack);
                    res.json(HTTP.Error);
                });
        });

        router.put("/movies/delete", (req: Request, res: Response, next: NextFunction) => {
            const tokenString = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            const id: number = req.body.id;
            this.databaseService.deleteMovie(id).then((result: pg.QueryResult) => {
                res.json(HTTP.Accepted);
            }).catch((e: Error) => {
                console.error(e.stack);
                res.json(HTTP.Error);
            });
        });

        router.put("/order/update", (req: Request, res: Response, next: NextFunction) => {
            const tokenString = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            const id: number = req.body.id;
            const stoppedAt: number = req.body.stoppedAt;
            this.databaseService.updateURL(id, stoppedAt).then((result: pg.QueryResult) => {
                res.json(HTTP.Accepted);
            }).catch((e: Error) => {
                console.error(e.stack);
                res.json(-1);
            });
        });

        router.post("/order/streaming/validation", (req: Request, res: Response, next: NextFunction) => {
            const tokenString = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.validateOrderStream(req.body.id, this.decode(tokenString).user)
                .then((result: pg.QueryResult) => {
                    res.json(result.rows[0]);
                }).catch((e: Error) => {
                    console.error(e.stack);
                    res.json(HTTP.Error);
                });
        });

        router.post("/order/dvd/validation", (req: Request, res: Response, next: NextFunction) => {
            const tokenString = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.validateOrderDVD(req.body.id, this.decode(tokenString).user)
                .then((result: pg.QueryResult) => {
                    res.json(result.rows[0]);
                }).catch((e: Error) => {
                    console.error(e.stack);
                    res.json(HTTP.Error);
                });
        });

        router.post("/order/insert/streaming", async (req: Request, res: Response, next: NextFunction) => {
            const tokenString: string = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            const email: string = this.decode(tokenString).user;
            this.databaseService.isPayPerView(email)
                .then((resU) => {
                    console.log('Result is here: ');
                    if (resU.rowCount === 1) {
                        console.log('User is pay per view');
                        this.databaseService.incrementMovieCount(email);
                    }
                });
            this.databaseService.addStreamingOrder(
                req.body.movieID,
                this.decode(tokenString).user,
                req.body.dateOfOrder)
                .then((result: pg.QueryResult) => {
                    res.json(HTTP.Accepted);
                }).catch((e: Error) => {
                    console.error(e.stack);
                    res.json(HTTP.Error);
                });
        });

        router.post("/order/insert/dvd", async (req: Request, res: Response, next: NextFunction) => {
            const tokenString: string = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.addDvdOrder(
                req.body.movieID,
                this.decode(tokenString).user,
                req.body.dateOfOrder,
                req.body.shippingfee)
                .then((result: pg.QueryResult) => {
                    res.json(HTTP.Accepted);
                }).catch((e: Error) => {
                    console.error(e.stack);
                    res.json(HTTP.Error);
                });
        });

        router.post("/ceremony/insert", (req: Request, res: Response, next: NextFunction) => {
            const tokenString = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.addCeremony(
                req.body.date,
                req.body.location,
                req.body.host,
                req.body.winner,
                req.body.category,
                req.body.movieID
            ).then((result: pg.QueryResult) => {
                res.json(HTTP.Accepted);
            }).catch((e: Error) => {
                console.error(e.stack);
                res.json(HTTP.Error);
            });
        });

        router.get("/users/postalCode", (req: Request, res: Response, next: NextFunction) => {
            const tokenString = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.getPostalCode(this.decode(tokenString).user)
            .then((result: pg.QueryResult) => {
                res.json(result.rows[0]);
            }).catch((e: Error) => {
                console.error(e.stack);
                res.json(HTTP.Error);
            });
        });

        router.post("/users/insert", (req: Request, res: Response, next: NextFunction) => {
            const tokenString = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.addUser(
                req.body.email,
                req.body.password,
                req.body.firstName,
                req.body.lastName,
                req.body.adress,
                req.body.number,
                req.body.postalCode,
                req.body.city,
                req.body.state,
                req.body.country,
                req.body.isSubsc,
                req.body.fee,
                req.body.dateSubsc
            ).then((result: pg.QueryResult) => {
                res.json(HTTP.Accepted);
            }).catch((e: Error) => {
                console.error(e.stack);
                res.json(HTTP.Error);
            });
        });

        router.post("/users", (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.verifyUser(req.body.username, req.body.password, Tables.M)
                .then((result: pg.QueryResult) => {
                    if (result.rowCount === 1) {
                        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                            algorithm: 'RS256',
                            expiresIn: 7200,
                            subject: req.body.username as string
                        });
                        res.status(200).json({
                            idToken: jwtBearerToken,
                            expiresIn: 7200
                        });
                    } else {
                        res.json(HTTP.Unauthorized);
                    }
                }).catch((e: Error) => {
                    console.error(e.stack);
                });
        });

        router.post("/participants/insert",
                    (req: Request, res: Response, next: NextFunction) => {
                const tokenString = req.header(TOKEN) as unknown as string;
                if (!this.isValid(tokenString)) {
                    res.json(HTTP.Unauthorized);
                }
                this.databaseService.addParticipant(
                    req.body.name,
                    req.body.dateOfBirth,
                    req.body.nationality,
                    req.body.sex,
                    req.body.role,
                    req.body.salary,
                    req.body.movieID
                ).then((result: pg.QueryResult) => {
                    res.json(HTTP.Accepted);
                }).catch((e: Error) => {
                    console.error(e.stack);
                });
            });

        router.post("/admins", (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.verifyUser(req.body.username, req.body.password, Tables.A)
                .then((result: pg.QueryResult) => {
                    if (result.rowCount === 1) {
                        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                            algorithm: 'RS256',
                            expiresIn: 7200,
                            subject: req.body.username as string
                        });
                        res.status(200).json({
                            idToken: jwtBearerToken,
                            expiresIn: 7200
                        });
                    } else {
                        res.json(HTTP.Unauthorized);
                    }
                }).catch((e: Error) => {
                    console.error(e.stack);
                });
        });

        router.get("/tables/:tableName", (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllFromTable(req.params.tableName)
                .then((result: pg.QueryResult) => {
                    res.json(result.rows);
                }).catch((e: Error) => {
                    console.error(e.stack);
                });
        });

        router.post("/users/insert",
                    (req: Request, res: Response, next: NextFunction) => {
                const tokenString = req.header(TOKEN) as unknown as string;
                if (!this.isValid(tokenString)) {
                    res.json(HTTP.Unauthorized);
                }
                this.databaseService.addUser(
                    req.body.email,
                    req.body.password,
                    req.body.firstName,
                    req.body.lastName,
                    req.body.adress,
                    req.body.number,
                    req.body.postalCode,
                    req.body.city,
                    req.body.state,
                    req.body.country,
                    req.body.isSubsc,
                    req.body.fee,
                    req.body.dateSubsc
                ).then((result: pg.QueryResult) => {
                    res.json(HTTP.Accepted);
                }).catch((e: Error) => {
                    if (e.message.indexOf('duplicate key') !== -1) {
                        res.json(HTTP.Exists);
                    }
                    res.json(HTTP.Error);
                });
            });

        router.get("/creditcards/", (req: Request, res: Response, next: NextFunction) => {
            const tokenString = req.header(TOKEN) as unknown as string;
            if (!this.isValid(tokenString)) {
                res.json(HTTP.Unauthorized);
            }
            this.databaseService.getCardsFor(this.decode(tokenString).user)
                .then((result: pg.QueryResult) => {
                    const ccs: CreditCard[] = result.rows.map((cc: any) => (
                        {
                            cardNumber: cc.cardnumber,
                            ownerID: cc.ownerid,
                            firstName: cc.firstname,
                            lastName: cc.lastname,
                            cvc: cc.cvc,
                            expiryDate: cc.expirydate
                        }));
                    res.json(ccs);
                }).catch((e: Error) => {
                    console.error(e.stack);
                    res.json(HTTP.Error);
                });
        });

        return router;
    }

    private isValid(tokenString: string): boolean {
        const token = this.decode(tokenString);
        const date = new Date(0);
        date.setUTCSeconds(token.expiry);
        return (date.valueOf() > new Date().valueOf());
    }

    private decode(token: string): Token {
        const result: any = jwt.decode(token);
        return {
            producedAt: result.iat,
            expiry: result.exp,
            user: result.sub
        };
    }
}
