import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { Room } from "../../../common/tables/Room";
import {schema} from "../createSchema";
import {data} from "../populateDB";

@injectable()
export class DatabaseService {

    // A MODIFIER POUR VOTRE BD
    public connectionConfig: pg.ConnectionConfig = {
        user: "sysadmin",
        database: "pg_exemple",
        password: "1234",
        port: 5432,
        host: "127.0.0.1",
        keepAlive : true
    };

    private pool: pg.Pool = new pg.Pool(this.connectionConfig);

    public constructor() {
        this.pool.connect();
    }
    /*

        METHODES DE DEBUG
    */
    public createSchema(): Promise<pg.QueryResult> {

        return this.pool.query(schema);
    }

    public populateDb(): Promise<pg.QueryResult> {

        return this.pool.query(data);
    }

    public getAllFromTable(tableName: string): Promise<pg.QueryResult> {

        return this.pool.query(`SELECT * FROM HOTELDB.${tableName};`);
    }

    // HOTEL
    public getHotels(): Promise<pg.QueryResult> {

        return this.pool.query('SELECT * FROM HOTELDB.Hotel;');
    }

    public getHotelNo(): Promise<pg.QueryResult> {

        return this.pool.query('SELECT hotelNo FROM HOTELDB.Hotel;');

    }

    public createHotel(hotelNo: string, hotelName: string, city: string): Promise<pg.QueryResult> {
        const values: string[] = [
            hotelNo,
            hotelName,
            city
        ];
        const queryText: string = `INSERT INTO HOTELDB.Hotel VALUES($1, $2, $3);`;

        return this.pool.query(queryText, values);
    }
	
	public deleteHotel(/*Todo*/): void /*TODO*/  {
		/*TODO*/
	}

    // ROOM
    public getRoomFromHotel(hotelNo: string, roomType: string, price: number): Promise<pg.QueryResult> {

        let query: string =
        `SELECT * FROM HOTELDB.room
        WHERE hotelno=\'${hotelNo}\'`;
        if (roomType !== undefined) {
            query = query.concat('AND ');
            query = query.concat(`typeroom=\'${roomType}\'`);
        }
        if (price !== undefined) {
            query = query.concat('AND ');
            query = query.concat(`price =\'${price}\'`);
        }
        console.log(query);

        return this.pool.query(query);
    }

    public getRoomFromHotelParams(params: object): Promise<pg.QueryResult> {

        let query: string = 'SELECT * FROM HOTELDB.room \n';
        const keys: string[] = Object.keys(params);
        if (keys.length > 0) {
            query = query.concat(`WHERE ${keys[0]} =\'${params[keys[0]]}\'`);
        }

        // On enleve le premier element
        keys.shift();

        // tslint:disable-next-line:forin
        for (const param in keys) {
            const value: string = keys[param];
            query = query.concat(`AND ${value} = \'${params[value]}\'`);
            if (param === 'price') {
                query = query.replace('\'', '');
            }
        }

        console.log(query);

        return this.pool.query(query);

    }

    public createRoom(room: Room): Promise<pg.QueryResult> {
        const values: string[] = [
            room.roomno,
            room.hotelno,
            room.typeroom,
            room.price.toString()
        ];
        const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1,$2,$3,$4);`;

        return this.pool.query(queryText, values);
    }

    // GUEST
    public createGuest(guestNo: string,
                       nas: string,
                       guestName: string,
                       gender: string,
                       guestCity: string): Promise<pg.QueryResult> {
        // this.pool.connect();
        const values: string[] = [
            guestNo,
            nas,
            guestName,
            gender,
            guestCity
        ];
        const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1,$2,$3,$4,$5);`;

        return this.pool.query(queryText, values);
    }

    // BOOKING
    public createBooking(hotelNo: string,
                         guestNo: string,
                         dateFrom: Date,
                         dateTo: Date,
                         roomNo: string): Promise<pg.QueryResult> {
        const values: string[] = [
            hotelNo,
            guestNo,
            dateFrom.toString(),
            dateTo.toString(),
            roomNo
        ];
        const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1,$2,$3,$4,$5);`;

        return this.pool.query(queryText, values);
        }
}
