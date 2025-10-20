import { Controller, Post, Body } from '@nestjs/common';

@Controller('publish')
export class PublisherController {
  constructor() {}

  @Post()
  create(@Body() createPublisherDto: any) {
    console.log(createPublisherDto);
  }
}
