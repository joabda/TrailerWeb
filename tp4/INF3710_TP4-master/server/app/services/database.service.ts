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

    public constructor() {
        this.pool.connect();
    }

    public async createSchema(): Promise<pg.QueryResult> {
        return this.pool.query(SCHEMA);
    }

    public async populateDb(): Promise<pg.QueryResult> {
        return this.pool.query(DATA);
    }

    public async getAllFromTable(tableName: string): Promise<pg.QueryResult> {
        return this.pool.query(`SELECT * FROM ${DB_NAME}.${tableName};`);
    }

    public async verifyUser(username: string, password: string, tableName: string): Promise<pg.QueryResult> {
        return this.pool.query(`
            Select *
            FROM ${DB_NAME}.${tableName}
            WHERE email = '${username}'
            AND password = netflixpoly.crypt('${password}', password);`);
    }

    public async addMovie(
        title: string,
        category: string,
        productionDate: string,
        duration: number,
        dvdPrice: number,
        streamingFee: number,
        movieURL: string,
        imageURL: string): Promise<pg.QueryResult> {
        const values: any[] = [
            title,
            category,
            productionDate,
            duration,
            dvdPrice,
            streamingFee,
            movieURL,
            imageURL
        ];
        const queryText: string = `INSERT INTO ${DB_NAME}.${Tables.Movie} VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8);`;
        this.pool.query(queryText, values);
        return this.pool.query(`SELECT max(idmovie) FROM ${DB_NAME}.${Tables.Movie};`)
    }

    public async  addCeremony(
        date: string,
        location: string,
        host: string,
        winner: boolean,
        category: string,
        movieID: number

    ): Promise<pg.QueryResult> {
        await this.pool.query(`INSERT INTO ${DB_NAME}.${Tables.Oscars} VALUES('${date}', '${location}', '${host}');`);
        return this.pool.query(`
            INSERT INTO ${DB_NAME}.${Tables.Nomination} VALUES('${date}', ${movieID}, ${winner}, '${category}');
        `);
    }

    public async deleteMovie(id: number): Promise<pg.QueryResult> {
        return this.pool.query(`
            DELETE
            FROM ${DB_NAME}.${Tables.Movie}
            WHERE idmovie = ${id};
        `);
    }

    public async updateURL(id: number, stoppedAt: number): Promise<pg.QueryResult> {
        const queryText: string = `
            UPDATE ${DB_NAME}.${Tables.OStream} SET stoppedat=${stoppedAt} WHERE idorder = ${id};
`;
        return this.pool.query(queryText);
    }

    public async getCardsFor(user: string): Promise<pg.QueryResult> {
        return this.pool.query(`
            SELECT *
            FROM ${DB_NAME}.${Tables.CC}
            WHERE ownerid = '${user}';
        `);
    }

    public async addStreamingOrder(movieID: number, memberID: string, dateOfOrder: string): Promise<pg.QueryResult> {
        await this.pool.query(`
            INSERT INTO ${DB_NAME}.${Tables.Order} VALUES(DEFAULT, '${memberID}', ${movieID}, '${dateOfOrder}');
        `);
        return this.pool.query(`
            INSERT INTO ${DB_NAME}.${Tables.OStream} VALUES( (SELECT max(idorder) FROM ${DB_NAME}.${Tables.Order}), 0);
        `);
    }

    public async validateOrder(movieid: number, user: string): Promise<pg.QueryResult> {
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

    public async  addParticipant(name: string, dateOfBirth: string, nationality: string,
        sex: string, role: string, salary: number, movieID: number): Promise<pg.QueryResult> {
        await this.pool.query(`
            INSERT INTO ${DB_NAME}.${Tables.Participant} VALUES(DEFAULT, '${name}', '${dateOfBirth}',
            '${nationality}', '${sex}');
        `);
        return this.pool.query(`
            INSERT INTO ${DB_NAME}.${Tables.Role} VALUES(${movieID},
                (SELECT max(idparticipant) FROM ${DB_NAME}.${Tables.Participant}), '${role}', ${salary});
        `);
    }

    // Users
    public async  addUser(
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
