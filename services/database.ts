import { AppDataSource } from "../ormconfig";

export const databaseConnection = async (User: any) => {

    const connection = await AppDataSource.initialize()

    console.log('Successfully connected to the database.')

    return connection.getRepository(User);
}