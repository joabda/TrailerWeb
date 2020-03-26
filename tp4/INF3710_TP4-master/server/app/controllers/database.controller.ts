import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as pg from "pg";
import * as jwt from 'jsonwebtoken';

import { DatabaseService } from "../services/database.service";
import Types from "../types";
import { Movie } from "../interface/movie";
import * as fs from "fs";

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
                // Send the request to the service and send the response
                this.databaseService.getMovies().then((result: pg.QueryResult) => {
                    const movies: Movie[] = result.rows.map((movie: any) => (
                        {
                            id             : movie.id,                
                            title          : movie.title,             
                            category       : movie.category,          
                            productionDate : movie.productionDate,    
                            duration       : movie.duraction,          
                            dvdPrice       : movie.dvdPrice,          
                            streamingFee   : movie.streamingFee      
                        }));
                    res.json(movies);
                }).catch((e: Error) => {
                    console.error(e.stack);
                });
            });

        router.post("/movie/insert",
            (req: Request, res: Response, next: NextFunction) => {
                const title : string        = req.body.title;
                const category : string     = req.body.category;
                const productionDate : Date = req.body.productionDate;
                const duration: number      = req.body.duration;
                const dvdPrice : number     = req.body.dvdPrice;
                const streamingFee : number = req.body.streamingFee;
                this.databaseService.addMovie(title, category, productionDate, duration, dvdPrice, streamingFee).then((result: pg.QueryResult) => {
                    res.json(result.rowCount);
                }).catch((e: Error) => {
                    console.error(e.stack);
                    res.json(-1);
                });
            });

        router.delete("/movie/insert");

        router.post("/users",
            (req: Request, res: Response, next: NextFunction) => {
                this.databaseService.verifyUser(req.body.username, req.body.password)
                    .then((result: pg.QueryResult) => {
                        if(result.rowCount === 1) {
                            const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                                algorithm: 'RS256',
                                expiresIn: 120,
                                subject: req.body.username as string
                            });
                            res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
                            res.status(200).json({
                                idToken: jwtBearerToken, 
                                expiresIn: 120
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
}
