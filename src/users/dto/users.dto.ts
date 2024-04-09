import { IsNotEmpty, IsString, IsEmail, IsAlpha } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @IsAlpha()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty()
  @IsAlpha()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly avatar: string;
}
