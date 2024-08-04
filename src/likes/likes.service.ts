import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type LikeCreateDeleteData = {
  userId: number;
  articleId: number;
};

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkArticleExists(
    data: Pick<LikeCreateDeleteData, 'articleId'>,
  ): Promise<boolean> {
    const article = await this.prisma.article.findUnique({ where: { id: data.articleId } });
    return article !== null;
  }

  private async checkLikeExists(data: LikeCreateDeleteData): Promise<boolean> {
    const like = await this.prisma.like.findUnique({ where: { articleId_userId: data } });
    return like !== null;
  }

  async create(data: LikeCreateDeleteData): Promise<void> {
    const [articleExists, likeExists] = await Promise.all([
      this.checkArticleExists(data),
      this.checkLikeExists(data),
    ]);
    if (!articleExists) {
      throw new NotFoundException('article not found');
    }
    if (likeExists) {
      throw new BadRequestException('you already liked this article');
    }

    await this.prisma.$transaction([
      this.prisma.like.create({ data: data }),
      this.prisma.article.update({
        where: { id: data.articleId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);
  }

  async delete(data: LikeCreateDeleteData): Promise<void> {
    const [articleExists, likeExists] = await Promise.all([
      this.checkArticleExists(data),
      this.checkLikeExists(data),
    ]);
    if (!articleExists) {
      throw new NotFoundException('article not found');
    }
    if (!likeExists) {
      throw new BadRequestException("you didn't like this article yet");
    }

    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: {
          articleId_userId: data,
        },
      }),
      this.prisma.article.update({
        where: { id: data.articleId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);
  }
}
