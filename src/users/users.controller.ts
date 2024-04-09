import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserDto })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
  })
  @ApiBadRequestResponse({ description: 'Validation Error' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: UserDto, @Res() response) {
    const res = await this.userService.create(createUserDto);
    return response.status(res.statusCode).json(res);
  }

  @ApiResponse({
    status: 200,
    description: 'Fetch user from an external API successfully',
  })
  @ApiOperation({ summary: 'Get user data from an external API by userId' })
  @Get('/:id')
  async findOne(@Param('id') id: string, @Res() response) {
    const res = await this.userService.getById(id);
    return response.status(res.statusCode).json(res);
  }

  @ApiResponse({
    status: 200,
    description: 'Fetch user avatar from an database successfully',
  })
  @ApiOperation({ summary: 'Get user avatar by userId' })
  @Get('/:id/avatar')
  async findOneAvatar(@Param('id') id: string, @Res() response) {
    const res = await this.userService.getAvatar(id);
    return response.status(res.statusCode).json(res);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete user data successfully',
  })
  @ApiOperation({ summary: 'Delete user avatar by userId' })
  @Delete('/:id/avatar')
  async deleteAvatar(@Param('id') id: string, @Res() response) {
    const res = await this.userService.deleteAvatar(id);
    return response.status(res.statusCode).json(res);
  }
}
