import "reflect-metadata";
import superadminService from "./superadmin.service";
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
} from "routing-controllers";
import { CreateSuperAdminDto } from "./dto/create-superadmin.dto";
import { UpdateSuperAdminDto } from "./dto/update-superadmin.dto";

@JsonController("/superadmins")
export class SuperAdminController {
  @Get("/")
  getSuperAdmins() {
    return superadminService.getSuperAdmins();
  }

  @Get("/:id")
  getSuperAdminById(@Param("id") id: string) {
    return superadminService.getSuperAdminById(id);
  }

  @Post("/")
  createSuperAdmin(@Body() superAdmin: CreateSuperAdminDto) {
    return superadminService.createSuperAdmin(superAdmin);
  }

  @Patch("/:id")
  updateSuperAdmin(@Param("id") id: string, @Body() superAdmin: UpdateSuperAdminDto) {
    return superadminService.updateSuperAdmin(id, superAdmin);
  }

  @Delete("/:id")
  deleteSuperAdmin(@Param("id") id: string) {
    return superadminService.deleteSuperAdmin(id);
  }
}
