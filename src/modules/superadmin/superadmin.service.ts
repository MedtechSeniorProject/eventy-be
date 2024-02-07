import { dataSource } from "../../database/database-source";
import { CreateSuperAdminDto } from "./dto/create-superadmin.dto";
import { UpdateSuperAdminDto } from "./dto/update-superadmin.dto";
import { Superadmin } from "./superadmin.entity";

class SuperadminService {
  public superadminRepository = dataSource.getRepository(Superadmin);

  public async getSuperAdmins() {
    return await this.superadminRepository.find();
  }

  public async createSuperAdmin(superadmin: CreateSuperAdminDto) {
    return await this.superadminRepository.save(superadmin);
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
}

export default new SuperadminService();
