/* eslint-disable @typescript-eslint/naming-convention */

const SERVICE_IDENTIFIER = {
  IBotCommandsInitializer: Symbol.for('IBotCommandsInitializer'),
  IBotEventHandler: Symbol.for('IBotEventHandler'),
  IBotEventHandlerFactory: Symbol.for('IBotEventHandlerFactory'),
  IBotReceiver: Symbol.for('IBotReceiver'),
  IBotService: Symbol.for('IBotService'),
  IBotServiceFactory: Symbol.for('IBotServiceFactory'),
  ICommand: Symbol.for('ICommand'),
  ICommandAndCallbackWorkingFields: Symbol.for(
    'ICommandAndCallbackWorkingFields'
  ),
  ICommandArguments: Symbol.for('ICommandArguments'),
  ICommandFactory: Symbol.for('ICommandFactory'),
  IConfiguration: Symbol.for('IConfiguration'),
  IHistoryManager: Symbol.for('IHistoryManager'),
  ILogger: Symbol.for('ILogger'),
  IMain: Symbol.for('IMain'),
  IGetCountryCommandHandler: Symbol.for('IGetCountryCommandHandler'),
  IMessageProcessor: Symbol.for('IMessageProcessor'),
  IPinoPrettyConfiguration: Symbol.for('IPinoPrettyConfiguration'),
  IPinoRegularConfiguration: Symbol.for('IPinoRegularConfiguration'),
  ISendMessageComposer: Symbol.for('ISendMessageComposer'),
  IStringKeyValueObject: Symbol.for('IStringKeyValueObject'),
  ITokenChecker: Symbol.for('ITokenChecker'),
  IUserMessageServiceInvoker: Symbol.for('IUserMessageServiceInvoker'),
  IWorkingFieldsInitializer: Symbol.for('IWorkingFieldsInitializer'),
  IKeyboardButtonsCreator: Symbol.for('IKeyboardButtonsCreator'),
  BotServiceFactory: Symbol.for('BotServiceFactory'),
  BotCommandsInitializer: Symbol.for('BotCommandsInitializer'),
  BotEventHandler: Symbol.for('BotEventHandler'),
  BotService: Symbol.for('BotService'),
  MessageProcessor: Symbol.for('MessageProcessor'),
  StartCommand: Symbol.for('StartCommand'),
  WrongCommand: Symbol.for('WrongCommand'),
  CommandFactory: Symbol.for('CommandFactory'),
  HistoryManager: Symbol.for('HistoryManager'),
  UserMessageServiceInvoker: Symbol.for('UserMessageServiceInvoker'),
  PinoLogger: Symbol.for('PinoLogger'),
  BotReceiver: Symbol.for('BotReceiver'),
  MessageToCommandConverter: Symbol.for('MessageToCommandConverter'),
  SendMessageComposer: Symbol.for('SendMessageComposer'),
  WorkingFieldsInitializer: Symbol.for('WorkingFieldsInitializer'),
  isCallbackQuery: Symbol.for('isCallbackQuery'),
  ErrorInstanceAdapter: Symbol.for('ErrorInstanceAdapter'),
  ErrorWithoutAdditionalHandling: Symbol.for('ErrorWithoutAdditionalHandling'),
  IErrorWithoutAdditionalHandling: Symbol.for('IErrorWithoutAdditionalHandling'),
  Token: Symbol.for('Token'),
  TelegramBot: Symbol.for('TelegramBot'),
  UserCommands: Symbol.for('userCommands'),
  PossibleEventsArray: Symbol.for('PossibleEventsArray'),
  BotAdapter: Symbol.for('BotAdapter'),
  IBotAdapter: Symbol.for('IBotAdapter'),
  countries: Symbol.for('countries'),
  inMessageCommands: Symbol.for('inMessageCommands'),
  IDateFormatter: Symbol.for('IDateFormatter'),
  IApiEndpointComposer: Symbol.for('IApiEndpointComposer'),
  IResponseFormatter: Symbol.for('IResponseFormatter'),
  IRequestHandler: Symbol.for('IRequestHandler'),
  IResponseParser: Symbol.for('IResponseParser'),
  IRequestProcessor: Symbol.for('IRequestProcessor'),
  ReplyKeyboard: Symbol.for('ReplyKeyboard'),
  IReplyKeyboard: Symbol.for('IReplyKeyboard'),
  IKeyboardButtonCreator: Symbol.for('IKeyboardButtonCreator'),
  IHandler: Symbol.for('IHandler'),
  IMessageFieldsHandler: Symbol.for('IMessageFieldsHandler'),
  MessageToCommandHandler: Symbol.for('MessageToCommandHandler'),
  ChatIdHandler: Symbol.for('ChatIdHandler'),
  UserNameHandler: Symbol.for('UserNameHandler'),
  UserLocationHandler: Symbol.for('UserLocationHandler'),
  PrismaService: Symbol.for('PrismaService'),
  IDB: Symbol.for('IDB'),
  UpdateLocationCommand: Symbol.for('UpdateLocationCommand'),
  UpdateTimeCommand: Symbol.for('UpdateTimeCommand'),
  SubscribeCommand: Symbol.for('SubscribeCommand'),
  UnsubscribeCommand: Symbol.for('UnsubscribeCommand'),
  ActiveUserTrack: Symbol.for('ActiveUserTrack'),
  IActiveUserTrack: Symbol.for('IActiveUserTrack'),
  UserTimeHandler: Symbol.for('UserTimeHandler'),
  InitialUserState: Symbol.for('InitialUserState'),
  ReadyToSubscribeState: Symbol.for('ReadyToSubscribeState'),
  UserContext: Symbol.for('UserContext'),
  WaitingForLocationState: Symbol.for('WaitingForLocationState'),
  WaitingForNotificationTimeState: Symbol.for('WaitingForNotificationTimeState'),
  IUserContext: Symbol.for('IUserContext'),
  IStateManager: Symbol.for('IStateManager'),
  StateManager: Symbol.for('StateManager'),
  Timers: Symbol.for('Timers'),
  ITimers: Symbol.for('ITimers'),
  UserListCache: Symbol.for('UserListCache'),
  IUserListCache: Symbol.for('IUserListCache'),
  KeyboardCreator: Symbol.for('KeyboardCreator'),
  IKeyboardCreator: Symbol.for('IKeyboardCreator'),
  IInlineKeyboard: Symbol.for('IInlineKeyboard'),
  InlineKeyboard: Symbol.for('InlineKeyboard'),
  IKeyboardInlineButtonsCreator: Symbol.for('IKeyboardInlineButtonsCreator'),
  KeyboardInlineButtonCreator: Symbol.for('KeyboardInlineButtonCreator'),
  AlreadySubscribedCommand: Symbol.for('AlreadySubscribedCommand'),
  ReadyToUpdateLocationState: Symbol.for('ReadyToUpdateLocationState'),
  ReadyToUpdateNotificationTimeState: Symbol.for('ReadyToUpdateNotificationTimeState'),
  WaitingForLocationUpdateState: Symbol.for('WaitingForLocationUpdateState'),
  WaitingForNotificationTimeUpdateState: Symbol.for('WaitingForNotificationTimeUpdateState'),
  InitialUserUpdateLocationState: Symbol.for('InitialUserUpdateLocationState'),
  InitialUserUpdateTimeState: Symbol.for('InitialUserUpdateTimeState'),
  IUserNotificationScheduler: Symbol.for('IUserNotificationScheduler'),
  UserNotificationScheduler: Symbol.for('UserNotificationScheduler'),
}

export { SERVICE_IDENTIFIER }
