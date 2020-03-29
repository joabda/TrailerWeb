import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as jwt from 'jsonwebtoken';
import * as pg from "pg";
import * as fs from "fs";
import { TOKEN } from "../constants";
import { Tables } from "../enum/tables";
import { Movie } from "../interface/movie";
import { Participant } from "../interface/participant";
import { Token } from "../interface/token";
import { DatabaseService } from "../services/database.service";
import Types from "../types";
import { HTTP } from "../enum/http-codes";
import { CreditCard } from "../interface/cc";

@injectable()
export class DatabaseController {
    public constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) { }

    public get router(): Router {
        const router: Router = Router();
        const RSA_PRIVATE_KEY = fs.readFileSync(require('path').resolve(__dirname, 'private.key')).toString('utf8');

        router.post("/createSchema",
            (req: Request, res: Response, next: NextFunction) => {
                this.databaseService.createSchema().then((result: pg.QueryResult) => {
                    res.json(result);
                }).catch((e: Error) => {
                    console.error(e.stack);
                });
            });

        router.post("/populateDb",
            (req: Request, res: Response, next: NextFunction) => {
                this.databaseService.populateDb().then((result: pg.QueryResult) => {
                    res.json(result);
                }).catch((e: Error) => {
                    console.error(e.stack);
                });
            });

        router.get("/movies",
            (req: Request, res: Response, next: NextFunction) => {
                if (this.isValid(req.header(TOKEN) as unknown as string)) {
                    // Send the request to the service and send the response
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
                } else {
                    res.sendStatus(HTTP.Unauthorized);
                }
            });

        router.post("/movies/insert",
            (req: Request, res: Response, next: NextFunction) => {
                const title: string = req.body.title;
                const category: string = req.body.category;
                const productionDate: Date = req.body.productionDate;
                const duration: number = req.body.duration;
                const dvdPrice: number = req.body.dvdPrice;
                const streamingFee: number = req.body.streamingFee;
                this.databaseService.addMovie(title, category, productionDate, duration, dvdPrice, streamingFee).then((result: pg.QueryResult) => {
                    res.json(result.rowCount);
                }).catch((e: Error) => {
                    console.error(e.stack);
                    res.json(-1);
                });
            });

        router.put("/order/update",
            (req: Request, res: Response, next: NextFunction) => {
                const tokenString = req.header(TOKEN) as unknown as string;
                if (this.isValid(tokenString)) {
                    const id: number = req.body.title;
                    const stoppedAt: number = req.body.stoppedAt;
                    const user: string = this.decode(tokenString).user;
                    this.databaseService.updateURL(id, stoppedAt, user).then((result: pg.QueryResult) => {
                        res.sendStatus(HTTP.Accepted)
                    }).catch((e: Error) => {
                        console.error(e.stack);
                        res.json(-1);
                    });
                } else {
                    res.sendStatus(HTTP.Unauthorized);
                }
            });

        router.post("/order/validation",
            (req: Request, res: Response, next: NextFunction) => {
                const tokenString = req.header(TOKEN) as unknown as string;
                if (this.isValid(tokenString)) {
                    const id: number = req.body.id;
                    const user: string = this.decode(tokenString).user;
                    this.databaseService.validateOrder(id, user).then((result: pg.QueryResult) => {
                        if (result.rowCount === 1) {
                            res.json(result.rowCount);
                        } else {
                            res.sendStatus(HTTP.NoContent);
                        }
                    }).catch((e: Error) => {
                        console.error(e.stack);
                        res.sendStatus(HTTP.Error);
                    });
                } else {
                    res.sendStatus(HTTP.Unauthorized);
                }
            });

        router.post("/order/insert",
            (req: Request, res: Response, next: NextFunction) => {
                const tokenString = req.header(TOKEN) as unknown as string;
                if (this.isValid(tokenString)) {
                    const id  : number = req.body.movieID;
                    const date: string = req.body.dateOfOrder;
                    const user: string = this.decode(tokenString).user;
                    this.databaseService.addStreamingOrder(id, user, date).then((result: pg.QueryResult) => {
                        res.sendStatus(HTTP.Accepted);
                    }).catch((e: Error) => {
                        console.error(e.stack);
                        res.sendStatus(HTTP.Error);
                    });
                } else {
                    res.sendStatus(HTTP.Unauthorized);
                }
            });

        router.delete("/movie/insert");

        router.get("/participant",
            (req: Request, res: Response, next: NextFunction) => {
                if (this.isValid(req.header(TOKEN) as unknown as string)) {
                    this.databaseService.getAllFromTable(Tables.Participant).then((result: pg.QueryResult) => {
                        const movies: Participant[] = result.rows.map((movie: any) => (
                            {

                            }));
                        res.json(movies);
                    }).catch((e: Error) => {
                        console.error(e.stack);
                    });
                } else {
                    res.sendStatus(HTTP.Unauthorized);
                }
            });

        router.post("/users",
            (req: Request, res: Response, next: NextFunction) => {
                this.databaseService.verifyUser(req.body.username, req.body.password)
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
                            res.sendStatus(HTTP.Unauthorized);
                        }
                    }).catch((e: Error) => {
                        console.error(e.stack);
                    });
            });

        router.get("/tables/:tableName",
            (req: Request, res: Response, next: NextFunction) => {
                this.databaseService.getAllFromTable(req.params.tableName)
                    .then((result: pg.QueryResult) => {
                        res.json(result.rows);
                    }).catch((e: Error) => {
                        console.error(e.stack);
                    });
            });

        router.get("/creditcards/",
            (req: Request, res: Response, next: NextFunction) => {
                const tokenString = req.header(TOKEN) as unknown as string;
                if (this.isValid(tokenString)) {
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
                            res.sendStatus(HTTP.Error);
                        });
                } else {
                    res.sendStatus(HTTP.Unauthorized);
                }
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
