import { Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthorizedRequest } from '../auth/types';

@Controller('articles')
@UseGuards(JwtAuthGuard)
@ApiTags('article likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/:id/like')
  @ApiCreatedResponse()
  @ApiBearerAuth()
  async createLike(@Param('id') id: number, @Request() req: AuthorizedRequest) {
    return this.likesService.create({ articleId: id, userId: req.user.id });
  }

  @Delete('/:id/like')
  @ApiOkResponse()
  @ApiBearerAuth()
  async deleteLike(@Param('id') id: number, @Request() req: AuthorizedRequest) {
    return this.likesService.delete({ articleId: id, userId: req.user.id });
  }
}
