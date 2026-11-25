import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Public } from './auth/public.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Open on purpose: it only answers with the project name
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
