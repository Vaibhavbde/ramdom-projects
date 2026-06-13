// tslint:disable:max-classes-per-file
import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

import { UserResponseObject } from '../users/user.dto';
import { ApiModelProperty } from '@nestjs/swagger';

export class TodoCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  description: string;
}

export class TodoUpdateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiModelProperty({ required: false })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiModelProperty({ required: false })
  completed?: boolean;
}

export class TodoResponseObject {
  id: number;
  description: string;
  completed: boolean;
  'created_at': Date;
  'updated_at': Date;
}
