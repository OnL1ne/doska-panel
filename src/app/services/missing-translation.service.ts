import {MissingTranslationHandler, MissingTranslationHandlerParams} from "@ngx-translate/core";
import {Injectable} from "@angular/core";

@Injectable()
export class MissingTranslationService implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return `WARN: '${params.key}' is missing in '${params.translateService.currentLang}' locale`;
  }
}
