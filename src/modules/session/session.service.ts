import { Session } from "./session.entity";
import { dataSource } from "../../database/database-source";

class SessionService {
  private sessionRepository = dataSource.getRepository(Session);
  private EXTENSION_TIME = 600;
  public async validateSession(sessionKey: string) {
    // TODO - Implement checks for same ip address and timestamp
    const session = await this.sessionRepository.findOne({
      where: { id: sessionKey },
    });
    if (!session) {
      return false;
    }
    return true;
  }

  public async createSession(
    userId: string,
    ipAddress: string,
    userAgent: string
  ) {
    const session = await this.sessionRepository.save({
      userId,
      ipAddress,
      userAgent,
      startTime: new Date(),
      endTime: new Date(),
    });
    return session.id;
  }
  public async extendSession(sessionKey: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionKey },
    });
    if (!session) {
      throw new Error("Invalid session key");
    }
    session.endTime = new Date();
    session.endTime.setSeconds(
      session.endTime.getSeconds() + this.EXTENSION_TIME
    );
    await this.sessionRepository.save(session);
  }
}

export default new SessionService();
