import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(@Body() createArticleDto: CreateArticleDto) {
    const newArticle = await this.articlesService.create(createArticleDto);
    const newArticleEntity = new ArticleEntity(newArticle);
    return newArticleEntity;
  }

  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll() {
    const articles = await this.articlesService.findAll();
    const articlesEntities = articles.map((article) => new ArticleEntity(article));
    return articlesEntities;
  }

  @Get('drafts')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.articlesService.findDrafts();
    const draftsEntities = drafts.map((draft) => new ArticleEntity(draft));
    return draftsEntities;
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const article = await this.articlesService.findOne(id);
    const articleEntity = new ArticleEntity(article);
    return articleEntity;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto) {
    const updatedArticle = await this.articlesService.update(id, updateArticleDto);
    const updatedArticleEntity = new ArticleEntity(updatedArticle);
    return updatedArticleEntity;
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const removedArticle = await this.articlesService.remove(id);
    const removedArticleEntity = new ArticleEntity(removedArticle);
    return removedArticleEntity;
  }
}
