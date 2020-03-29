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
    private connectionConfig: pg.ConnectionConfig = {
        user: "admin",
        database: 'tp3',
        password: "12345",
        port: 5432,
        host: "127.0.0.1",
        keepAlive : true
    };

    private pool: pg.Pool = new pg.Pool(this.connectionConfig);

    constructor() {
        this.pool.connect();
    }

    createSchema(): Promise<pg.QueryResult> {
        return this.pool.query(SCHEMA);
    }

    populateDb(): Promise<pg.QueryResult> {
        return this.pool.query(DATA);
    }

    getAllFromTable(tableName: string): Promise<pg.QueryResult> {
        return this.pool.query(`SELECT * FROM ${DB_NAME}.${tableName};`);
    }

    verifyUser(username: string, password: string): Promise<pg.QueryResult> {
        return this.pool.query(`
            Select *
            FROM ${DB_NAME}.${Tables.M}
            WHERE email = '${username}'
            AND password = '${password}';`);
    }
    
    addMovie(
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

	deleteMovie(title: string): Promise<pg.QueryResult> {
        const values: any[] = [
            title,
        ];
        const queryText: string = `DELETE FROM ${DB_NAME}.${Tables.Movie} WHERE title = $1;`;
        return this.pool.query(queryText, values);
    }
    
    updateURL(id: number, stoppedAt: number, member: string): Promise<pg.QueryResult> {
        const queryText: string = `
            UPDATE ${DB_NAME}.${Tables.OStream} SET stoppedat=${stoppedAt} WHERE idorder = (
                SELECT DISTINCT idorder 
                FROM ${DB_NAME}.${Tables.Order}, ${DB_NAME}.${Tables.Movie}
                WHERE movieid = ${id}
                AND clientid='${member}'
            );
        `;
        return this.pool.query(queryText);
    }

    getCardsFor(user: string): Promise<pg.QueryResult> {
        return this.pool.query(`
            SELECT * 
            FROM ${DB_NAME}.${Tables.CC}
            WHERE ownerid = '${user}';
        `);
    }

    async addStreamingOrder(movieID: number, memberID: string, dateOfOrder: string): Promise<pg.QueryResult> {
        await this.pool.query(`
            INSERT INTO ${DB_NAME}.${Tables.Order} VALUES(DEFAULT, '${memberID}', ${movieID}, '${dateOfOrder}');
        `);
        const numberOfOrders = (await this.pool.query(`SELECT * FROM ${DB_NAME}.${Tables.Order};`)).rowCount;
        return this.pool.query(`
            INSERT INTO ${DB_NAME}.${Tables.OStream} VALUES(${numberOfOrders}, 0);
        `);
    }

    validateOrder(movieid: number, user: string): Promise<pg.QueryResult> {
        return this.pool.query(`
            SELECT stoppedat 
            FROM ${DB_NAME}.${Tables.OStream}
            WHERE idorder = (
                SELECT DISTINCT idorder
                FROM ${DB_NAME}.${Tables.Order}
                WHERE movieid = ${movieid}
                AND clientid = '${user}' 
            );
            `
        );
    }

    // Users
    addUser(
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
