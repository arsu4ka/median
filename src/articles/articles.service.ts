import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    const article = this.prisma.article.create({data: createArticleDto});
    return article
  }

  findAll() {
    const articles = this.prisma.article.findMany({where: {published: true}});
    return articles;
  }

  findDrafts() {
    const articles = this.prisma.article.findMany({where: {published: false}});
    return articles;
  }

  findOne(id: number) {
    const article = this.prisma.article.findUnique({
       where: {id},
       include: { author: true }
    });
    return article;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = this.prisma.article.update({
      where: { id },
      data: updateArticleDto
    });
    return article;
  }

  remove(id: number) {
    const article = this.prisma.article.delete({where: {id}});
    return article;
  }
}
