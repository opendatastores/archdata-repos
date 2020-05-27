import { IDataContext } from "archdatacore";
import { MongoClient, Collection, Db, ObjectId } from "mongodb";

export interface IMongoDBDataContext extends IDataContext<MongoClient, Db, Collection, ObjectId | string> {
}
