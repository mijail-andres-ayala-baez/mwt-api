import { Module } from '@nestjs/common';
import { SessionQuestionnaireController } from './session-questionnaire.controller.js';
import { SessionQuestionnaireService } from './session-questionnaire.service.js';

@Module({
  controllers: [SessionQuestionnaireController],
  providers: [SessionQuestionnaireService],
})
export class SessionQuestionnaireModule {}
