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
        database: 'postgres',
        password: "12345",
        port: 5432,
        host: "127.0.0.1",
        keepAlive: true
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

    verifyUser(username: string, password: string, tableName: string): Promise<pg.QueryResult> {
        return this.pool.query(`
            Select *
            FROM ${DB_NAME}.${tableName}
            WHERE email = '${username}'
            AND password = netflixpoly.crypt('${password}', password);`);
    }

    addMovie(
        title: string,
        category: string,
        productionDate: Date,
        duration: number,
        dvdPrice: number,
        streamingFee: number): Promise<pg.QueryResult> {
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

    deleteMovie(id: number): Promise<pg.QueryResult> {
        return this.pool.query(`
            DELETE 
            FROM ${DB_NAME}.${Tables.Movie} 
            WHERE idmovie = ${id};
        `);
    }



    updateURL(id: number, stoppedAt: number): Promise<pg.QueryResult> {
        const queryText: string = `
            UPDATE ${DB_NAME}.${Tables.OStream} SET stoppedat=${stoppedAt} WHERE idorder = ${id};
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
        return this.pool.query(`
            INSERT INTO ${DB_NAME}.${Tables.OStream} VALUES( (SELECT max(idorder) from netflixpoly.order), 0);
        `);
    }

    validateOrder(movieid: number, user: string): Promise<pg.QueryResult> {
        return this.pool.query(`
            SELECT * 
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
    async addUser(
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        street: string,
        appartmentNo: number,
        postalCode: string,
        city: string,
        state: string,
        country: string,
        subscribed: boolean,
        fee?: number,
        endDate?: string
    ): Promise<pg.QueryResult> {
        let values: any[] = [];
        await this.pool.query(`
            INSERT INTO ${DB_NAME}.${Tables.M} VALUES('${email}', ${DB_NAME}.crypt('${password}', ${DB_NAME}.gen_salt('bf')), '${firstName}',
                '${lastName}', '${street}', ${appartmentNo}, '${postalCode}', 
                '${city}', '${state}', '${country}');
        `);
        if (subscribed) {
            values.push(fee);
            values.push(endDate);
            console.log("DATE: " + endDate);
        }
        return this.pool.query(`INSERT INTO ${DB_NAME}.${subscribed ? Tables.SM : Tables.PPVM} 
            VALUES('${email}', ${subscribed ? (`${fee}, '${this.getCurrentDate()}' ,'${endDate}'`) : 0});`
        );
    }

    private getCurrentDate(): string {
        let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }
}
