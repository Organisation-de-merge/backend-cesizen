
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class RoleResponseDto {
    @ApiProperty({ description: "Identifiant du rôle" })
    @IsInt()
    id?: number;

    @ApiProperty({ description: "Libéllé du rôle" })
    @IsString()
    label: string;

    @ApiProperty({ description: "Niveau du rôle" })
    @IsInt()
    level: number;
}