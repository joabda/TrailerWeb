import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { DB_NAME } from '../constants';
import { SCHEMA } from "../createSchema";
import { Tables } from "../enum/tables";
import { DATA } from "../populateDB";

@injectable()
export class DatabaseService {

    // A MODIFIER POUR VOTRE BD
    public connectionConfig: pg.ConnectionConfig = {
        user: "admin",
        database: 'tp3',
        password: "12345",
        port: 5432,
        host: "127.0.0.1",
        keepAlive : true
    };

    private pool: pg.Pool = new pg.Pool(this.connectionConfig);

    public constructor() {
        this.pool.connect();
    }

    public createSchema(): Promise<pg.QueryResult> {
        return this.pool.query(SCHEMA);
    }

    public populateDb(): Promise<pg.QueryResult> {
        return this.pool.query(DATA);
    }

    public getAllFromTable(tableName: string): Promise<pg.QueryResult> {
        return this.pool.query(`SELECT * FROM ${DB_NAME}.${tableName};`);
    }

    public verifyUser(username: string, password: string): Promise<pg.QueryResult> {
        return this.pool.query(`
            Select *
            FROM ${DB_NAME}.${Tables.M}
            WHERE email = '${username}'
            AND password = '${password}';`);
    }
    
    public addMovie(
        title:          string,
        category:       string,
        productionDate: Date,
        duration:       number,
        dvdPrice:       number,
        streamingFee:   number): Promise<pg.QueryResult> {
            const values: any[] = [
                title,
                category,
                productionDate,
                duration,
                dvdPrice,
                streamingFee
            ];
            const queryText: string = `INSERT INTO ${DB_NAME}.${Tables.Movie} VALUES(DEFAULT, $1, $2, $3, $4, $5, $6);`;

            return this.pool.query(queryText, values);
    }

	public deleteMovie(title: string): Promise<pg.QueryResult> {
        const values: any[] = [
            title,
        ];
        const queryText: string = `DELETE FROM ${DB_NAME}.${Tables.Movie} WHERE title = $1;`;
        return this.pool.query(queryText, values);
	}

    // Users
    public addUser(
        email:          string,
        password:       string,
        firstName:      string,
        lastName:       string,
        street:         string,
        appartmentNo:   number,
        postalCode:     string,
        city:           string,
        state:          string,
        country:        string,
        subscribed:     boolean,
        fee ?:          number,
        endDate ?:      Date
    ): Promise<pg.QueryResult> {
        let values: any[] = [
            email, password, firstName, lastName, street, appartmentNo, postalCode, city, state, country, subscribed
        ];
        if(subscribed) {
            values.push(fee);
            values.push(endDate);
        }
        const queryText = `INSERT INTO ${DB_NAME}.${subscribed ? Tables.SM : Tables.PPVM}
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10
                ${subscribed ? '$11, $12' : ''}
                );
        `;

        return this.pool.query(queryText, values);
    }
}
