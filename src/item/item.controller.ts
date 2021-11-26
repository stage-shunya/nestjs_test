import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Item } from 'src/entities/item.entity';
import { DeleteParameter } from 'src/models/deleteParameter.dto';
import { CreateItemDTO, UpdateItemDTO } from '../models/item.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get()
  @ApiOperation({
    operationId: 'getItemList',
    description: 'アイテムを全件取得する',
    summary: 'アイテムを全件取得する',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '正常終了',
    isArray: true,
    type: Item,
  })
  async getItemList(): Promise<Item[]> {
    return await this.service.findAll();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    operationId: 'getItem',
    description: '該当のアイテムを1件取得する',
    summary: '該当のアイテムを1件取得する',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '正常終了',
    isArray: false,
    type: Item,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'アイテムが見つからない',
  })
  async getItem(@Param('id') id: number): Promise<Item> {
    return await this.service.findOneItem(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    operationId: 'addItem',
    description: 'アイテムを登録する',
    summary: 'アイテムを登録する',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '正常終了',
    isArray: false,
    type: Item,
  })
  async addItem(@Body() item: CreateItemDTO): Promise<Item> {
    return await this.service.insertItem(item);
  }

  @Put(':id/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    operationId: 'updateItem',
    description: '該当のアイテムを更新する',
    summary: '該当のアイテムを更新する',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '正常終了',
    isArray: false,
    type: Item,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'アイテムが見つからない',
  })
  async updateItem(
    @Param('id') id: number,
    @Body() itemData: UpdateItemDTO,
  ): Promise<Item> {
    return await this.service.updateItem(id, itemData);
  }

  @Delete(':id/delete')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    operationId: 'deleteItem',
    description: '該当のアイテムを削除する',
    summary: '該当のアイテムを削除する',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '正常終了',
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'パスワード不一致',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'アイテムが見つからない',
  })
  async deleteItem(
    @Param('id') id: number,
    @Body() deleteParameter: DeleteParameter,
  ): Promise<void> {
    return await this.service.deleteByPassword(
      id,
      deleteParameter.deletePassword,
    );
  }
}
