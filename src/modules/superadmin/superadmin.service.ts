import { BadRequestError } from "routing-controllers";
import { dataSource } from "../../database/database-source";
import { CreateSuperAdminDto } from "./dto/create-superadmin.dto";
import { UpdateSuperAdminDto } from "./dto/update-superadmin.dto";
import { Superadmin } from "./superadmin.entity";
import * as bcrypt from "bcrypt";

class SuperadminService {
  private superadminRepository = dataSource.getRepository(Superadmin);

  public async getSuperAdmins() {
    return await this.superadminRepository.find();
  }

  public async createSuperAdmin(superadmin: CreateSuperAdminDto) {
    const superadminWithSameEmail = await this.superadminRepository.findOne({
      where: { email: superadmin.email },
    });
    if (superadminWithSameEmail) {
      return new BadRequestError("Email already in use");
    }
    const passwordHash = await bcrypt.hash(superadmin.password, 10);
    return await this.superadminRepository.save({
      ...superadmin,
      password: passwordHash,
    });
  }

  public async updateSuperAdmin(id: string, superadmin: UpdateSuperAdminDto) {
    return await this.superadminRepository.update(id, superadmin);
  }

  public async deleteSuperAdmin(id: string) {
    return await this.superadminRepository.delete(id);
  }

  public async getSuperAdminById(id: string) {
    return await this.superadminRepository.findOne({
      where: { id: id },
    });
  }

  public async getSuperAdminByEmail(email: string) {
    return await this.superadminRepository.findOne({ where: { email: email } });
  }

  public async getSuperAdminWithPasswordByEmail(email: string) {
    return await this.superadminRepository
      .createQueryBuilder("superadmin")
      .addSelect("superadmin.password")
      .where("superadmin.email = :email", { email })
      .getOne();
  }
}

export default new SuperadminService();
