import * as uuid from "uuid";
import { Connection } from "../models/Connection";
import { ConnectionDAO } from "../dataLayer/ConnectionDAO";

const connectionDAO = new ConnectionDAO();

export async function createConnection(connectionId: string) {
  const timestamp = new Date().toISOString();

  const item = {
    id: connectionId,
    timestamp,
  };

  await connectionDAO.createConnection(item);
}

export async function deleteConnection(connectionId: string) {
  await connectionDAO.deleteConnection(connectionId);
}

export async function getConnections() {
  return await connectionDAO.getConnections();
}
