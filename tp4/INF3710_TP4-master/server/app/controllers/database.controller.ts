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
                    this.databaseService.getMovies().then((result: pg.QueryResult) => {
                        const movies: Movie[] = result.rows.map((movie: any) => (
                            {
                                id: movie.id,
                                title: movie.title,
                                category: movie.category,
                                productionDate: movie.productionDate,
                                duration: movie.duraction,
                                dvdPrice: movie.dvdPrice,
                                streamingFee: movie.streamingFee
                            }));
                        res.json(movies);
                    }).catch((e: Error) => {
                        console.error(e.stack);
                    });
                } else {
                    res.sendStatus(401);
                }
            });

        router.post("/movie/insert",
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

        router.delete("/movie/insert");

        router.get("/participant",
        (req: Request, res: Response, next: NextFunction) => {
            if(this.isValid(req.header(TOKEN) as unknown as string)) {
                this.databaseService.getAllFromTable(Tables.Participant).then((result: pg.QueryResult) => {
                    const movies: Participant[] = result.rows.map((movie: any) => (
                        {

                        }));
                    res.json(movies);
                }).catch((e: Error) => {
                    console.error(e.stack);
                });
            } else {
                res.sendStatus(401);
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
                            res.sendStatus(401);
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
