import { DataSource } from 'typeorm';
import { User } from './models/user.models';
import { Transaction } from './models/transaction.model';

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

/**
 * Clase para gestionar la conexion a una base de datos de postgresSQL utilizando TypeORM
 *
 * @remarks
 * esta clase configura y administra la conexion a una base de datos, incluyendo la inicializacion de las entidades: User, Pet, Doctor, Specie y Appointment.
 *
 * La conexion se configura para sincronizar el esquema de la base de datosy utiliza SSL con `rejecrUnauthorized: false` para evitar errores en entornos de desarrollo.
 *
 * @example
 * ```typescript
 * const database = new PostgresDatabase({
 * 	host: 'localhost',
 * port: 5432,
 * username: 'postgres',
 * password: 'password',
 * database: 'veterinary',
 * 				});
 * database.connect().then(() => {}).catch(() => {});
 * ```
 */

export class PostgresDatabase {
  public datasource: DataSource;

  /**
   *  Crea una nueva instancia de la cpnexion a postgresSQL.
   * @param options  - opciones de configuracion para la conexions de la base de datos
   */

  constructor(options: Options) {
    this.datasource = new DataSource({
      type: 'postgres',
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      synchronize: true,
      entities: [User, Transaction],
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Inicializa la conexion a la base de datos
   * @remarks
   * Este metodo inicializa la conexion a la base de datos y muestra un mensaje en consola si la conexion fue exitosa o si hubo un error.
   *
   * @returns Una promesa que se resuelve cuando la conexion es exitosa y se rechaza si hay un error.
   */

  async connect() {
    try {
      await this.datasource.initialize();
      console.log('✅ Connected to database');
    } catch (error) {
      console.log('❌ Database connection failed:', error);
    }
  }
}
